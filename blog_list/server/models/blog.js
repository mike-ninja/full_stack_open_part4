/*
 * Defining the database schema
*/
const mongoose = require('mongoose')

const blogShema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogShema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogShema)
