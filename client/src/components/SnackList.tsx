import React, { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';
import { Card, Container, Row, Col, Button, Modal} from 'react-bootstrap/';
import { snackType } from '../models/snack';
import { NotificationManager } from 'react-notifications';
import './SnackList.scss';



/**
 * All the component's functions and login related to the all displayed snack List. 
 * @returns the snacklist component
 */
function SnackList() {
  // local state
const [snacks, setSnacks] = useState([])
const [show, setShow]= useState(false);
const[snackToDelete,setSnackToDelete]=useState(():snackType=>{return {} as snackType});

//closeHandler
const handleClose = useCallback(()=>{
setShow(false);
},[setShow])

//deletionHandler
const handleDeletion = useCallback((snackID:string)=> {
Axios.delete('http://localhost:3001/delete-snack/'+snackID).then((snackName)=>{
  setShow(false);
  // remove the item after deletion
  if(snacks.length){
  const cleanSnackList= snacks.filter((snack:snackType)=>snack._id!==snackID)
  console.log("the updated snack list: ",cleanSnackList,snacks,snackID)
  setSnacks(cleanSnackList)}
  NotificationManager.success(snackName+' has been removed','Success',2000)
}).catch(error=>{
  console.log('something went wrong', error)
  NotificationManager.success('Deletion process idd not went through','Failure',2000)
})
},[snacks])


  // open modal of confirmation
const openConfirmDeleteModal= useCallback((snackToDelete:snackType)=> {
  setSnackToDelete(snackToDelete);
  setShow(true);
},[setShow])

const ConfirmationModal=()=>{
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>You are about to delete this {snackToDelete.name}!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={()=>handleDeletion(snackToDelete._id)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
);
}
// get the snacks after refreshing
useEffect(()=> {
  Axios.get('http://localhost:3001/snacks').then((res)=>setSnacks(res.data))
},[])

  return(
    <Container className='snacks-container'>
      <Row>
      {snacks.map((snack:snackType,key)=>
      <Col>
        <Card key={key} style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>{snack.name}</Card.Title>
          <Card.Text>
          <>
          LastDayConsumed: {snack.lastDayConsumed}
          Favorite: {snack.isFavorite}
          Calories: {snack.calories.value} {snack.calories.unit}
          </>
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="danger" onClick={(event)=>openConfirmDeleteModal(snack)}>Remove</Button>
        </Card.Footer>
      </Card>
      </Col>
      )}
      </Row>
      {snacks.length===0 &&
      <div>
      <label className='no-data-label'>No data has been found</label>
      </div>}
      <ConfirmationModal/>
    </Container>
   
);
}
export default SnackList
