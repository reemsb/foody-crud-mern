import './App.scss';
import React, { useCallback, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import { Card, Col, Container, Navbar } from 'react-bootstrap';
import SnackList from './components/SnackList.tsx';
import SnackForm from './components/SnackForm.tsx';

/**
 * Holds the one page application for managing snacks.
 * @author rsb
 * @returns App.tsx
 */
function App() {
const [showForm,setShowForm] = useState(false)

//callback functions
const handleCreateForm = useCallback(()=>{
  console.log("show the create form")
  setShowForm(true)
},[])
const callbackModal= useCallback(()=>{
  setShowForm(false);
},[])

//UI
  return (
    <div className="App">
      <Navbar bg="primary" variant="light">
        <Container>
          <Navbar.Brand href="/">
           <img
          alt="snack-logo"
          src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/60/null/external-baby-plate-baby-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png"
          width="60"
          height="60"
          className="d-inline-block align-top"
          />{' '}
          <label className="label-navbar">Snack Diary</label>
          </Navbar.Brand>
        </Container>
       </Navbar>

      <Container className="page-content">
        <Col>
          <Card style={{ width: '18rem' }} bg="light" onClick={handleCreateForm} className='add-card'>
            <Card.Body>
              <svg xmlns="http://www.w3.org/2000/svg" width="9rem" fill="grey" className="bi bi-file-plus" viewBox="1 0 13 13">
              <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z"/>
              </svg>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <SnackList/>
        </Col>
      </Container>


      <SnackForm showForm={showForm} selectedSnack={undefined} callbackModal={callbackModal}/>
      <NotificationContainer/>
    </div>
  );
}

export default App;
