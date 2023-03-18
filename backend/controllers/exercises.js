const exercisesRouter = require('express').Router()
const Exercise = require('../models/exercise')


exercisesRouter.get('/', (req, res) => {
  Exercise.find({}).then(exercises => {
    res.json(exercises)
  })
})

exercisesRouter.get('/:id', (req, res, next) => {
  Exercise.findById(req.params.id)
    .then(exercise => {
      if (exercise) {
        res.json(exercise)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

exercisesRouter.delete('/:id', (req, res, next) => {
  Exercise.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

exercisesRouter.post('/', (req, res, next) => {
  const body = req.body

  const exercise = new Exercise({
    movement: body.movement,
    class: body.class,
    type: body.type
  })

  exercise.save()
    .then(savedExercise => {
      res.status(201).json(savedExercise)
    })
    .catch(error => next(error))
})

module.exports = exercisesRouter