import React, { useState } from 'react';
import Axios from 'axios';
import { Card, Container, Row, Col} from 'react-bootstrap/';
import { snackType } from '../models/snack';
function SnackList(){
  //local state
  const [snacks, setSnacks] = useState([])
//TODO: check where to wrap maybe in useState so it only triggers initially or maybe useEffectLayout or something.
  Axios.get('http://localhost:3001/snacks').then(({data})=>setSnacks(data))

  return(
    <Container>
      <Row>
      {snacks.map((snack:snackType)=>
      <Col>
        <Card style={{ width: '18rem' }}>
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
      </Card>
      </Col>
      )}
      </Row>
    </Container>
);
}
export default SnackList
