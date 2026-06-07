import Person from "./Person"

const Persons = ({ persons, search, onDelete}) => {
  const personFilter = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {personFilter.map(person => (
        <Person key={person.id} person={person} onDelete={onDelete}/>
      ))}
    </div>
  )
}

export default Persons 