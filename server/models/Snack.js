const mongoose = require('mongoose')


//define the schema.
const snackSchema= new mongoose.Schema({
  name: { 
    type:String,
    required:true
  },
  lastDayConsumed:Date,
  isFavorite:Boolean,
  calories:{
    value: { type: Number },
    unit: { type: String }
  }
},{
  versionKey:false,
  timestamps:true
})

//connect the model to the schema to be used later on.
const Snack = mongoose.model("Snack", snackSchema)
module.exports = Snack