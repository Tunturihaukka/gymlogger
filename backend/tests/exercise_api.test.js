const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Exercise = require('../models/exercise')
const helper = require('./test_helper')

beforeEach(async () => {
  await Exercise.deleteMany({})
  let exObject = new Exercise(helper.initialExercises[0])
  await exObject.save()
  exObject = new Exercise(helper.initialExercises[1])
  await exObject.save()
})

describe('adding exercises', () => {
  test('adding a valid exercise succeeds with status code 201', async () => {
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

    expect(response.body).toHaveLength(helper.initialLength + 1)
    expect(movements).toContain(
      'squat'
    )
  })

  test('adding an exercise without the movement fails with status code 400', async () => {
    const newExercise = {
      class: 'legs',
      type: 'barbell'
    }

    await api
      .post('/api/exercises')
      .send(newExercise)
      .expect(400)

    const response = await api.get('/api/exercises')

    expect(response.body).toHaveLength(helper.initialLength)
  })

  test('adding an exercise with a too long movement fails with status code 400', async () => {
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

    expect(response.body).toHaveLength(helper.initialLength)
    expect(movements).not.toContain(
      'quat123456789012345678910'
    )
  })

  test('adding an exercise with an improper class fails with status code 400', async () => {
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

    expect(response.body).toHaveLength(helper.initialLength)
    expect(movements).not.toContain(
      'squat'
    )
  })

})

describe('requesting exercises', () => {


  test('requesting a single valid exercise by id succeeds with status code 200', async () => {
    const db = await helper.exercisesInDb()
    const id = db[0].id

    await api
      .get(`/api/exercises/${id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })

  test('requesting a single non-existing exercise fails with status code 404', async () => {
    const id = await helper.nonExistingId()

    await api
      .get(`/api/exercises/${id}`)
      .expect(404)

  })

  test('requesting a single exercise with malformatted id fails with status code 400', async () => {

    await api
      .get(`/api/exercises/${helper.malformattedId}`)
      .expect(400)
  })

  test('exercises are returned as json', async () => {
    await api
      .get('/api/exercises')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are correct amount of exercises', async () => {
    const response = await api.get('/api/exercises')

    expect(response.body).toHaveLength(helper.initialLength)
  })

  test('1st initial exercise is within the returned exercises', async () => {
    const response = await api.get('/api/exercises')

    const movements = response.body.map(r => r.movement)

    expect(movements).toContain(
      helper.initialExercises[0].movement
    )
  })

})

describe('deleting exercises', () => {

  test('deleting a non-existing exercise', async () => {
    const id = await helper.nonExistingId()

    await api
      .delete(`/api/exercises/${id}`)
      .expect(204)

  })

  test('deleting an exercise with malformatted id', async () => {
    await api
      .delete(`/api/exercises/${helper.malformattedId}`)
      .expect(400)

    const response = await api.get('/api/exercises')
    expect(response.body).toHaveLength(helper.initialLength)
  })

  test('deleting a valid exercise', async () => {
    const db = await helper.exercisesInDb()
    const id = db[0].id

    await api
      .delete(`/api/exercises/${id}`)
      .expect(204)

    const response = await api.get('/api/exercises')
    expect(response.body).toHaveLength(helper.initialLength - 1)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})