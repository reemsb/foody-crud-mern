import React, { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';
import { Card, Container, Row, Col, Button, Modal} from 'react-bootstrap/';
import { snackType } from '../models/snack';
import { NotificationManager } from 'react-notifications';
import './SnackList.scss';
import SnackForm from './SnackForm.tsx';
import { formatDate, getFavoriteIconStatus } from '../utils/utilsUI.tsx';



/**
 * All the component's functions and login related to the all displayed snack List. 
 * @returns the snacklist component
 */
function SnackList() {
  // local state
const [snacks, setSnacks] = useState([])
const [show, setShow]= useState(false);
const [showForm,setShowForm] = useState(false);
const[selectedSnack,setSelectedSnack]=useState(():snackType=>{return {} as snackType});

//deletion Handler
const handleDeletion = useCallback((snackID:string)=> {
Axios.delete('http://localhost:3001/delete-snack/'+ snackID).then((response)=>{
  setShow(false);
  if(snacks.length) {
  const cleanSnackList= snacks.filter((snack:snackType)=>snack._id!==snackID)
  setSnacks(cleanSnackList)
  }
  NotificationManager.success(response.data +' has been removed','Success',2000)
}).catch(error=>{
  console.log('something went wrong', error)
  NotificationManager.success('Deletion process idd not went through','Failure',2000)
})
},[setSnacks, snacks])


// open deletion confirmation modal
const openConfirmDeleteModal= useCallback((snackToDelete:snackType)=> {
  setSelectedSnack(snackToDelete);
  setShow(true);
},[setShow])
//close delete confirmation modal
const handleClose = useCallback(()=>{
  setShow(false);
  },[setShow])

// open form to edit the selected snack
const openCreateEditSnack= useCallback((snackToUpdate:snackType)=> {
  console.log("the update callback to open the form")
  setSelectedSnack(snackToUpdate);
  setShowForm(true);
  },[])

// callback modal for closing edit form:
const callbackModal = useCallback(()=>{
  setShowForm(false)
},[])
//callback to children to update the snack list:
const updateSnackList= useCallback(()=>{
  Axios.get('http://localhost:3001/snacks').then((res)=>setSnacks(res.data))
},[])

const ConfirmationModal = ()=>{
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>You are about to delete this snack: {selectedSnack.name}!</Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={()=>handleDeletion(selectedSnack._id)}>
          Delete
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
// get the snacks after refreshing
useEffect(()=> {
  updateSnackList()
},[updateSnackList])

  return(
    <Container className='snacks-container'>
      <Row>
      {snacks.map((snack:snackType,key)=>
      <Col key={key}>
        <Card key={snack._id} style={{ width: '18rem' }} className="snack-item">
        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
        <Card.Body>
          <Card.Title>{snack.name}</Card.Title>
          <Card.Text className="card-text">
          <>
          <label>Last Day Consumed: </label> {formatDate(snack?.lastDayConsumed)}
          <br/>
          <label>Favorite: </label> {getFavoriteIconStatus(snack?.isFavorite)}
          <br/>
          <label>Calories: </label> {snack?.calories?.value} {snack?.calories?.unit}
          </>
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" onClick={(event)=>openCreateEditSnack(snack)}>Update</Button>
          <Button variant="secondary" onClick={(event)=>openConfirmDeleteModal(snack)}>Remove</Button>
        </Card.Footer>
      </Card>
      </Col>
      )}
      </Row>
      {snacks.length===0 &&
      <div>
      <label className='no-data-label'>-No data has been found-</label>
      </div>}
      <ConfirmationModal/>
      <SnackForm showForm={showForm} selectedSnack={selectedSnack} callbackModal={callbackModal}/>
    </Container>
   
);
}
export default SnackList