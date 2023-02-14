import React, { useEffect } from 'react';
import {useCallback, useState } from 'react';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import { snackType } from '../models/snack';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import {Modal,Form,FormGroup, Row, Col} from 'react-bootstrap/';
import { getLocalDateTimeInput } from '../utils/utilsUI.tsx';
import './SnackForm.scss'

//form props
export type formProps= {
  showForm: boolean,
  callbackModal:any,
  selectedSnack?:snackType
}
/**
 * Create and edit form for a snack.
 * @param props
 * @returns createEditForm of a snack
 */
function SnackForm(props:formProps) {
  //initial states in edit mode:
const initialValues = props.selectedSnack?{
  name: props.selectedSnack.name,
  favorite: props.selectedSnack.isFavorite,
  lastDay: props.selectedSnack.lastDayConsumed,
  caloriesValue: props.selectedSnack.calories?.value,
  caloriesUnit: props.selectedSnack.calories?.unit,
}:{
  name:'',
  favorite: false,
  lastDay: '',
  caloriesValue: 0,
  caloriesUnit: "Kcal",
}

  //local states definition
  const [name,setName] = useState<string>()
  const [favorite,setFavorite] = useState<boolean>();
  const [lastDay,setLastDay] = useState<Date>();
  const [caloriesValue,setCaloriesValue] = useState<number>();
  const [cloriesUnit,setCaloriesUnit] = useState<string>();
  
//callbacks
  const createSnack = useCallback(()=>{
    let snackToAdd:Partial<snackType>= {
      name:name!==''?name:'Snack',
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
    .catch((error)=>{
      NotificationManager.error('The snack was not added, something went wrong', 'Failure', 5000)
    })
    
   },[caloriesValue, cloriesUnit, favorite, lastDay, name])

const updateSnack = useCallback(()=> {
  if(!!props.selectedSnack) {
    let snack:snackType= {
      _id:props.selectedSnack._id,
      name:name as string,
      lastDayConsumed:lastDay as Date,
      isFavorite:favorite as boolean,
      calories:{
        value:caloriesValue as number,
        unit:cloriesUnit as string
      }
    }
    Axios.put('http://localhost:3001/snack/'+ snack._id, snack)
    .then((response)=>{
      NotificationManager.success('The snack has been updated', 'Success', 2000);
    })
    .catch((error)=>{
      NotificationManager.error('The snack was not updated, something went wrong', 'Failure', 5000)
    })
  } else{
    console.warn(" No snack found to edit here");
  }
},[caloriesValue,
  cloriesUnit,
  favorite,
  lastDay,
  name,
  props.selectedSnack])

const CreateUpdateSnack = useCallback(()=>{
  if(props?.selectedSnack?._id) {
    updateSnack()
  } else {
    createSnack()
  }
  props.callbackModal()
  window.location.reload()
},[createSnack, props, updateSnack])

useEffect(()=>{
setName(initialValues.name)
setFavorite(initialValues.favorite)
setCaloriesValue(initialValues.caloriesValue)
setCaloriesUnit(initialValues.caloriesUnit)
setLastDay(initialValues.lastDay as Date)
},[initialValues.caloriesUnit,
  initialValues.caloriesValue,
  initialValues.favorite,
  initialValues.lastDay,
  initialValues.name])

  //UI
return(
  <Modal show={props.showForm} onHide={props.callbackModal}>
        <Modal.Header closeButton>
          <Modal.Title>{props.selectedSnack?._id?<label>Update snack</label>:<label>Add new snack</label>}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
          <Form className='create-form'>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="snack name"
                value={name}
                pattern="[a-zA-Z]"
                onChange={(event)=>setName(event.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
            >
              <Form.Label>Last Date consumed:</Form.Label>
              <Form.Control
              type="datetime-local"
              value={getLocalDateTimeInput(lastDay)}
              max={getLocalDateTimeInput(new Date())}
              onChange={(event)=>{if (event.target.value !==null){setLastDay(new Date(event.target.value))} else {setLastDay(new Date())}}}
              />
            </Form.Group>
            <FormGroup className="mb-3">
            <Form.Label>Calories: </Form.Label>
              <Row className="calories-input">
                <Col>
                  <Form.Control
                  aria-label="Calories"
                  type="number"
                  placeholder="calories"
                  value={caloriesValue}
                  min='0'
                  onChange={(event)=>setCaloriesValue(parseInt(event.target.value))}/>
                </Col>
                <Col>
                  <Form.Select aria-label="Unit"
                  value={cloriesUnit}
                  onChange={(event)=>setCaloriesUnit(event.target.value)}>
                  <option value="Kj">Kcal</option>
                  <option value="Kcal">Kj</option>
                  </Form.Select>
                </Col>
              </Row>
            </FormGroup>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Favorite"
                checked={favorite}
                onChange={(event)=>{setFavorite(event.target.checked)}}
              />
            </Form.Group>
          </Form>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={CreateUpdateSnack}>
            Save
          </Button>
          <Button variant="secondary" onClick={props.callbackModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
);
}
export default SnackForm