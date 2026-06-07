import { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import personService from "./services/persons"
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState({
    name: '',
    number: ''
  })
  const [search, setSearch] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setNewName({
      ...newName,
      [name]: value
    })
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const addContact = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.name.trim().toLowerCase()
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )

      if (!confirmUpdate) {
        return
      }

      const changedPerson = {
        ...existingPerson,
        number: newName.number
      }

      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person =>
            person.id !== existingPerson.id ? person : returnedPerson
          ))

          setNotificationMessage({
            message: `${returnedPerson.name} was changed on the list.`,
            type: 'success'

          })

          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)

          setNewName({
            name: '',
            number: ''
          })
        })
        .catch(error => {
          setNotificationMessage({
            message: `${changedPerson.name} has already been removed from server.`,
            type: 'error'
          })

          setPersons(persons.filter(person => person.id !== existingPerson.id))

          setTimeout(() => {
            setNotificationMessage(null) 
          }, 5000)
        })
      return
    }

    const personObject = {
      name: newName.name,
      number: newName.number
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))       

        setNotificationMessage({
          message: `${returnedPerson.name} has been added to the list.`,
          type: 'success'
        })

        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        
        setNewName({
          name: '',
          number: ''
        })
      })
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)

    if (!person) {
      return
    }

    const confirmDelete = window.confirm(`Delete ${person.name}?`)

    if (!confirmDelete) {
      return
    }

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        setNotificationMessage({
            message: `Information of ${person.name} has already been removed from server.`,
            type: 'error'
          })

         setPersons(persons.filter(person => person.id !== id))

          setTimeout(() => {
            setNotificationMessage(null) 
          }, 5000)
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notificationMessage}/>

      <Filter
        searchChange={handleSearchChange}
        search={search}
      />

      <PersonForm
        handleChange={handleChange}
        addContact={addContact}
        newName={newName}
      />

      <h2>Numbers</h2>

      <Persons
        persons={persons}
        search={search}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default App