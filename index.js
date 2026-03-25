require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

app.get('/info', (request, response) => {
  const timeNow = new Date();
  Person.find({}).then(persons => {
    const count = persons.length
  
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${timeNow}</p>
  `)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response)  => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  } else {
    Person.find({}).then(people => {
      if (people.some(p => p.name === body.name)) {
        return response.status(400).json({
          error: 'name must be unique'
        })
      }
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})