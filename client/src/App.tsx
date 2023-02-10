
import { useEffect, useState } from 'react';
import './App.scss';
import React from 'react';

//defined Type  
export type snackType = {
  name:String,
  lastDayConsumed:Date,
  isFavorite:Boolean,
  calories:{
    value:Number,
    unit:String
  }
}

function App() {

  const [name,setName] = useState('')
  const [favorite,setFavorite] = useState(false);
  const [lastDay,setLastDay] = useState(new Date());
  const [caloriesValue,setCaloriesValue] = useState(0);
  const [cloriesUnit,setCaloriesUnit] = useState('Kcal');

    // the function to persist food
   const createFood=()=>{
    let snackToAdd:snackType= {
      name:name,
      lastDayConsumed:lastDay,
      isFavorite:favorite,
      calories:{
        value:caloriesValue,
        unit:cloriesUnit
      }
    }
    console.dir(snackToAdd)
    // todo: make request to add the item
   }
   // todo:refresh after submission
   // useEffect(()=>{},[])
  return (
    <div className="App">
      <div> 
        <h1>Foody App with MERN</h1>
      </div>
      {/* todo: do this as a form */}
      <div className='create-form'>
        <label>Name:<input type='text' onChange={(event)=>setName(event.target.value)}/></label>
        <br/>
        <label>Last Date consumed: <input type='datetime-local' onChange={(event)=>
          {if (event.target.valueAsDate !==null){
            setLastDay(event.target.valueAsDate)
          }else{
            setLastDay(new Date());
          }}} /></label>
        <br/>
        <label> Calories: <input type='number' onChange={(event)=>setCaloriesValue(parseInt(event.target.value))}/> </label>
        <label> Kcal: <input type="radio" id="Kcal" name="calorieUnit" onChange={(event)=>setCaloriesUnit('Kcal')}/></label>
        <label> Kj:<input type="radio" id="Kj" name="calorieUnit" onChange={(event)=>setCaloriesUnit('Kj')}/></label>
         <br/>
         <label>Favorite Snack:<input type='checkbox' name='Favorite'onChange={(event)=>{setFavorite(event.target.checked)}}/></label>
         <br/>
         <button onClick={()=>createFood()}>Add To snacks</button>
      </div>
    </div>
  );
}

export default App;
