const exercisesRouter = require('express').Router()
const Exercise = require('../models/exercise')


exercisesRouter.get('/', async (req, res) => {
  await Exercise.find({}).then(exercises => {
    res.json(exercises)
  })
})

exercisesRouter.get('/:id', async (req, res) => {
  const exercise = await Exercise.findById(req.params.id)
  if (exercise) {
    res.json(exercise)
  } else {
    res.status(404).end()
  }
})

exercisesRouter.delete('/:id', async (req, res) => {
  await Exercise.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

exercisesRouter.post('/', async (req, res) => {
  const body = req.body

  const exercise = new Exercise({
    movement: body.movement,
    class: body.class,
    type: body.type
  })

  const savedExercise = await exercise.save()
  res.status(201).json(savedExercise)
})

module.exports = exercisesRouter