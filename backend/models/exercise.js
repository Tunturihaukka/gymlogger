const mongoose = require('mongoose')


const exerciseSchema = new mongoose.Schema({
  movement: {
    type: String,
    maxlength: 20,
    required: true
  },
  class: {
    type: String,
    enum: ['chest', 'back', 'legs', 'arms', 'shoulders'],
    required: true
  },
  type: {
    type: String,
    enum: ['barbell', 'dumbbell', 'machine', 'bodyweight', 'kettlebell'],
    required: true
  }

})

exerciseSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Exercise', exerciseSchema)