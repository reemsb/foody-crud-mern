const express = require('express')
const mongoose = require('mongoose')
const app = express()
const snackModel = require('./models/Snack')

//receive data as json format
app.use(express.json())
var cors = require('cors')

app.use(cors()) // Use this after the variable declaration
//database connection
// todo copy this connection link from mongoDB Atlas with secure details.
mongoose.connect('mongodb+srv://<replacewithmongosuer>:<replacewithmongodbpwd>@<urclustername>.mongodb.net/foodyDB?retryWrites=true&w=majority', { useNewUrlParser: true })

// create a snack request
app.post('/create-snack', async(request,response) => {
  try {
    const snack = await snackModel.create(request.body)
    await snack.save()
    console.log('success creation')
    return response.send('ok')
  } catch (error) {
    console.log('failed to create a snack', error)
    return response.status(400).json()
  }
})

//get snacks
app.get('/snacks', async (request,response)=>{
  try {
    const snacks = await snackModel.find().lean()
    console.log('retrieve is successful', snacks.length)
    return response.status(200).json(snacks)
  } catch (error) {
    console.log('failed to get snacks', error)
    return response.status(400).json()
  }
})


//the node server is running 
app.listen(3001, () => {
  console.log('Server running on port 3001...')
})


