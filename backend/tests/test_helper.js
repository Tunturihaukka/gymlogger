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

const initialLength = initialExercises.length
const malformattedId = '52389u5v928ut1nv9809v'

const nonExistingId = async () => {
  const exercise = new Exercise(
    {
      movement: 'test',
      class: 'legs',
      type: 'barbell'
    })
  await exercise.save()
  const id = exercise.toJSON().id
  await Exercise.findByIdAndRemove(id)

  return id
}

const exercisesInDb = async () => {
  const exercises = await Exercise.find({})
  return exercises.map(exercise => exercise.toJSON())
}

module.exports = {
  initialExercises,
  initialLength,
  malformattedId,
  nonExistingId,
  exercisesInDb
}