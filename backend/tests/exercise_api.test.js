const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Exercise = require('../models/exercise')

const initialExercises = [

  {
    movement: 'bench press',
    class: 'chest',
    type: 'barbell'
  },
  {
    movement: 'deadlift',
    class: 'back',
    type: 'barbell'
  }
]

beforeEach(async () => {
  await Exercise.deleteMany({})
  let exObject = new Exercise(initialExercises[0])
  await exObject.save()
  exObject = new Exercise(initialExercises[1])
  await exObject.save()
})

test('adding a valid exercise', async () => {
  const newExercise = {
    movement: 'squat',
    class: 'legs',
    type: 'barbell'
  }

  await api
    .post('/api/exercises')
    .send(newExercise)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/exercises')

  const movements = response.body.map(r => r.movement)

  expect(response.body).toHaveLength(initialExercises.length + 1)
  expect(movements).toContain(
    'squat'
  )
})


test('adding an exercise without the movement', async () => {
  const newExercise = {
    class: 'legs',
    type: 'barbell'
  }

  await api
    .post('/api/exercises')
    .send(newExercise)
    .expect(400)

  const response = await api.get('/api/exercises')

  expect(response.body).toHaveLength(initialExercises.length)
})

test('adding an exercise with a too long movement name', async () => {
  const newExercise = {
    movement: 'squat123456789012345678910',
    class: 'legs',
    type: 'barbell'
  }

  await api
    .post('/api/exercises')
    .send(newExercise)
    .expect(400)

  const response = await api.get('/api/exercises')

  const movements = response.body.map(r => r.movement)

  expect(response.body).toHaveLength(initialExercises.length)
  expect(movements).not.toContain(
    'squat1234567890'
  )
})

test('adding an exercise with an improper class', async () => {
  const newExercise = {
    movement: 'squat',
    class: 'knees',
    type: 'barbell'
  }

  await api
    .post('/api/exercises')
    .send(newExercise)
    .expect(400)

  const response = await api.get('/api/exercises')

  const movements = response.body.map(r => r.movement)

  expect(response.body).toHaveLength(initialExercises.length)
  expect(movements).not.toContain(
    'squat'
  )
})

//----

test('requesting a single valid exercise by id', async () => {
  const response = await api.get('/api/exercises')
  const id = response.body[0].id

  await api
    .get(`/api/exercises/${id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body[0].movement).toBe('bench press')

})

test('requesting a single invalid exercise by id', async () => {

  const response = await api.get('/api/exercises')
  const id = response.body[0].id

  await api.delete(`/api/exercises/${id}`)

  await api
    .get(`/api/exercises/${id}`)
    .expect(404)

})

test('requesting a single exercise with malformatted id', async () => {

  await api
    .get('/api/exercises/52389u5v928ut1nv9809v')
    .expect(400)
})

//----

test('exercises are returned as json', async () => {
  await api
    .get('/api/exercises')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are correct amount of exercises', async () => {
  const response = await api.get('/api/exercises')

  expect(response.body).toHaveLength(initialExercises.length)
})

test('bench press is within the returned exercises', async () => {
  const response = await api.get('/api/exercises')

  const movements = response.body.map(r => r.movement)

  expect(movements).toContain(
    'bench press'
  )
})


//----

test('deleting a non-existing exercise', async () => {

})

test('deleting a valid exercise', async () => {
  const initResponse = await api.get('/api/exercises')
  const id = initResponse.body[0].id

  await api
    .delete(`/api/exercises/${id}`)
    .expect(204)

  const response = await api.get('/api/exercises')
  expect(response.body).toHaveLength(initialExercises.length - 1)
})



afterAll(async () => {
  await mongoose.connection.close()
})