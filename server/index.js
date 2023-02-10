const express = require('express')
const mongoose = require('mongoose')
const app = express()
const snackModel = require('./models/Snack')

//receive data as json format
app.use(express.json())

//database connection
// todo copy this connection link from mongoDB Atlas with secure details.
mongoose.connect('mongodb+srv://<replacewithmongosuer>:<replacewithmongodbpwd>@<urclustername>.mongodb.net/foodyDB?retryWrites=true&w=majority', { useNewUrlParser: true })

// test peristance to db
app.get('/', async(req, res) => {
const snack = new snackModel(
  {
    name:'pear',
    lastDayConsumed: new Date(),
    isFavorite: true,
    calories: {
      value:13,
      unit:'kcal'
    }
  }
)

  try {
    await snack.save();
    console.log('insertedFood '+ snack.get('name'))
  } catch (error) {
    console.log('error mongo persist: '+ error)
  }
})


//the node server is running 
app.listen(3001, () => {
  console.log('Server running on port 3001...')
})


