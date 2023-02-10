import React from 'react';
import {useCallback, useState } from 'react';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import { snackType } from '../models/snack';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';

function SnackForm(){
  //local states definition
  const [name,setName] = useState('')
  const [favorite,setFavorite] = useState(false);
  const [lastDay,setLastDay] = useState(new Date());
  const [caloriesValue,setCaloriesValue] = useState(0);
  const [cloriesUnit,setCaloriesUnit] = useState('Kcal');

  const createFood=useCallback(()=>{
    let snackToAdd:snackType= {
      name:name,
      lastDayConsumed:lastDay,
      isFavorite:favorite,
      calories:{
        value:caloriesValue,
        unit:cloriesUnit
      }
    }
    Axios.post('http://localhost:3001/create-snack', snackToAdd)
    .then((response)=>{
      NotificationManager.success('The snack has been added', 'Success', 2000);
    })
    .catch((error )=>{
      NotificationManager.error('The snack was not added, something went wrong', 'Failure', 5000)
    })
    
   },[caloriesValue, cloriesUnit, favorite, lastDay, name])

return(
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
         <Button onClick={createFood} variant="primary" className="mr-1">Add To snacks</Button>
      </div>
);
}
export default SnackForm