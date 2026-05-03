import { useState } from 'react'
import Notification from './Notification'
import LoginForm from './LoginForm'
import Togglable from './Toggleable'
import Note from './Note'
import noteService from '../services/notes'
import loginService from '../services/login'


const NoteList = ({ notes }) => {
    const [errorMessage, setErrorMessage] = useState(null)
    const [showAll, setShowAll] = useState(true)
    const [user, setUser] = useState(null)

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important)

    const handleLogin = async (loginObject) => {
        try {
          const user = await loginService.login(loginObject)
    
          window.localStorage.setItem(
            'loggedNoteappUser', JSON.stringify(user)
          )
    
          noteService.setToken(user.token)
          setUser(user)
        } catch {
          setErrorMessage('wrong credentials')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
        console.log('logging in with', loginObject, user)
      }

    const toggleImportanceOf = id => {
        console.log(`importance of ${id} needs to be toggled`)
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }
    
        noteService
          .update(id, changedNote)
          .then(returnedNote => {
            setNotes(notes.map(note => note.id === id ? returnedNote : note))
          })
          .catch(() => {
            setErrorMessage(
              `Note '${note.content}' was already removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setNotes(notes.filter(n => n.id !== id))
          })
      }
    
      const loginForm = () => (
        <Togglable buttonLabel="login">
            <LoginForm login={handleLogin} />
        </Togglable>
    )

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />

            {!user && loginForm()}

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map((note) =>
                    <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />)}
            </ul>
        </div>
    )
}

export default NoteList