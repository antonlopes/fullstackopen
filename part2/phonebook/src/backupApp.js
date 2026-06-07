import { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import personService from "./services/persons"


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState(
    {
      name: '',
      number: ''
    }
  )
  
  const [search, setSearch] = useState('')



  const handleChange = (event) => {
    const { name, value } = event.target
    setNewName({...newName, [name]: value
    })
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  ///


  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addContact = event => {

        
    const person = persons.find(p => p.name === newName.name)


    const changePerson = {...person}


    event.preventDefault()

    const nameExists = persons.some(
      person => person.name.toLowerCase() === newName.name.trim().toLowerCase()
    )
    

    if (nameExists) {
      window.confirm(`${newName.name} is already added to phonebook, replace the old number with a new one?`)

      personService
      .update(newName, changePerson).then(returnedPerson => {
        setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
      })
    }

    const personObject = {
      name: newName.name,
      number: newName.number
    }

    personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName({
        name: '',
        number: ''
      })
    })
  }

  const handleDelete = id => {
    const person = persons.find(p => p.id === id )
    const changePerson = {...person, id: !person.id }

    personService
    .remove(id, changePerson).then(returnedPerson => {
      setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
    })
    
    .catch(error => {
      window.confirm(`Delete ${person.name}?`)
      setPersons(persons.filter(p => p.id !== id))
    })
  }
  
  ///

  

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchChange={handleSearchChange} search={search}/>
      <PersonForm handleChange={handleChange} addContact={addContact} newName={newName}/>

      <h2>Numbers</h2>
      <Persons persons={persons} search={search} onDelete={handleDelete}/>
      
    </div>
  )
}

export default App