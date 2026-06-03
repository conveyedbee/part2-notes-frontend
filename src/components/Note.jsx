import { useParams, useNavigate } from 'react-router-dom'

const Note = ({note, user, toggleImportance, deleteNote}) => {
  const id = useParams().id
  const navigate = useNavigate()

  if (!note) {
    return null
  }

  const label = note.important
    ? 'make not important'
    : 'make important'
  
  const isCreator = user && note.user.name === user.name
  
  const handleDelete = () => {
    if (window.confirm(`Delete note ${note.content}?`)) {
      deleteNote(id)
      navigate('/notes')
    }   
  }

  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={() => toggleImportance(id)}>{label}</button>
      {isCreator && <button onClick={handleDelete}>delete</button>}
    </li>
  )
}

export default Note