import './App.scss';
// import {
//   NotificationContainer,
//   NotificationManager,
// } from 'react-notifications';
import { Col, Container, Navbar } from 'react-bootstrap';
import SnackList from './components/SnackList.tsx';

/**
 * Holds the one page application for managing snacks.
 * @author rsb
 * @returns App.tsx
 */
function App() {
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
          <SnackList />
        </Col>
      </Container>
      {/* <NotificationContainer /> */}
    </div>
  );
}

export default App;
