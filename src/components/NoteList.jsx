import { useState, useRef } from 'react'

const NoteList = ({ notes }) => {
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [user, setUser] = useState(null)
    const noteFormRef = useRef()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
          setUser(user)
          noteService.setToken(user.token)
        }
      }, [])
    
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

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important)
    
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


}