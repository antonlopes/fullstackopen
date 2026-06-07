const Person = ({ person, onDelete }) => {
  return (
    <>
      <p>
        {person.name} {person.number}
      </p>
      <button onClick={() => onDelete(person.id)}>
        delete
      </button>
    </>
    
  )
}

export default Person