import { useState } from 'react'

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('')

    const addNote = (event) => {
        event.preventDefault()
        createNote({
            content: newNote,
            important: true
        })

        setNewNote('')
    }

    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }

    return (
        <div>
            <h2>Create a new note</h2>

        <form onSubmit={addNote}>
            <label>
                new note
                <input value={newNote} onChange={handleNoteChange}/>
                <button type="submit">save</button>
            </label>
            
        </form>
        </div>
    )
}

export default NoteForm