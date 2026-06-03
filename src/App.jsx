import { useState, useEffect } from 'react'
import { Container } from '@mui/material'
import noteService from './services/notes'
import loginService from './services/login'
import Notification from './components/Notification'

import {
  Routes, Route, Link,
  useMatch
} from 'react-router-dom'
import NoteList from './components/NoteList'
import Note from './components/Note'
import Home from './components/Home'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'

const App = () => {
  const [user, setUser] = useState(null)
  const [notes, setNotes] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ({ username, password}) => {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
    noteService.setToken(user.token)
    setUser(user)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    noteService.setToken(null)
  }

  const addNote = noteObject => {
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNotification({
        text: `Note '${returnedNote.content}' added!`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
  }

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter(note => note.id !== id))
    })
  }

  const toggleImportanceOf = id => {
      const note = notes.find(n => n.id === id)
      const changedNote = { ...note, important: !note.important }
  
      noteService
        .update(id, changedNote)
        .then(returnedNote => {
          setNotes(notes.map(note => (note.id !== id ? note : returnedNote)))
        })
        .catch(() => {
          // setErrorMessage(
          //   `Note '${note.content}' was already removed from server`
          // )
          // setTimeout(() => {
          //   setErrorMessage(null)
          // }, 5000)
          setNotes(notes.filter(n => n.id !== id))
        })
  }

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === match.params.id)
    : null

  const padding = {
    padding: 5
  }

  return (
    <Container>
      <div>
        <div>
          <Link style={padding} to="/">home</Link>
          <Link style={padding} to="/notes">notes</Link>
          {user && <Link style={padding} to="/create">new note</Link>}
          {user && <button onClick={handleLogout}>logout</button>}
        </div>

        <Notification message={notification} />

        <Routes>
          <Route path="/notes/:id" element={
            <Note
              note={note}
              user={user}
              toggleImportance={toggleImportanceOf}
              deleteNote={deleteNote}
            />
          } />
          <Route path="/notes" element={
            <NoteList notes={notes} user={user} handleLogin={handleLogin} />
          } />
          <Route path="/create" element={
            <NoteForm createNote={addNote} />
          } />
          <Route path="/" element={<Home />} />
        </Routes>

        <Footer />
      </div>
    </Container>
  )
}

export default App