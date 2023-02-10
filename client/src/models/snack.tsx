export type snackType = {
  name:String,
  lastDayConsumed:Date,
  isFavorite:Boolean,
  calories:{
    value:Number,
    unit:String
  }
}