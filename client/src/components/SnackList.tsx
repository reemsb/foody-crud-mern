import React, { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  InputGroup,
} from 'react-bootstrap/';
import { Snack } from '../models/snack';
import { NotificationManager } from 'react-notifications';
import './SnackList.scss';
import SnackForm from './SnackForm.tsx';
import { formatDate, getFavoriteIconStatus } from '../utils/utilsUI.tsx';
import useSnackStore from '../stores/snackStore.tsx';

/**
 * All the component's functions and login related to the all displayed snack List.
 * @returns the snacklist component
 */
function SnackList() {
  // local state
  const snacks = useSnackStore((state) => state.snacks);
  const setSnacks = useSnackStore((state) => state.setSnacks);
  const [show, setShow] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState((): Snack => {
    return {} as Snack;
  });
  const [searchName, setSearchName] = useState('');

  // open create form handler
  const handleCreateForm = useCallback(() => {
    console.log('show the create form');
    setShowForm(true);
  }, []);
  // open form to edit the selected snack
  const openCreateEditSnack = useCallback((snackToUpdate: Snack) => {
    console.log('the update callback to open the form');
    setSelectedSnack(snackToUpdate);
    setShowForm(true);
  }, []);

  // callback modal for closing edit form:
  const callbackModal = useCallback(() => {
    setShowForm(false);
  }, []);

  // open deletion confirmation modal
  const openConfirmDeleteModal = useCallback(
    (snackToDelete: Snack) => {
      setSelectedSnack(snackToDelete);
      setShow(true);
    },
    [setShow]
  );
  //close delete confirmation modal
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);
  //deletion Handler
  const handleDeletion = useCallback((snackID: string) => {
    Axios.delete('http://localhost:3001/delete-snack/' + snackID)
      .then((response) => {
        setShow(false);
        NotificationManager.success(
          response.data + ' has been removed',
          'Success',
          2000
        );
      })
      .catch((error) => {
        console.log('something went wrong', error);
        NotificationManager.success(
          'Deletion process idd not went through',
          'Failure',
          2000
        );
      });
  }, []);
  // deletion confirmation modal
  const ConfirmationModal = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are about to delete this snack: {selectedSnack.name}!
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => handleDeletion(selectedSnack._id)}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // callback to children to update the snack list:
  const updateSnackList = useCallback(() => {
    Axios.get('http://localhost:3001/snacks').then((res) =>
      setSnacks(res.data)
    );
  }, [setSnacks]);
  // get the snacks after refreshing
  useEffect(() => {
    updateSnackList();
  }, [updateSnackList]);

  return (
    <Container className="snacks-container">
      <Row>
        <Form>
          <InputGroup className="my-3">
            <Form.Control
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search for snacks by names"
            ></Form.Control>
          </InputGroup>
        </Form>
      </Row>
      <Row>
        <Col>
          <Card
            style={{ width: '18rem' }}
            bg="light"
            onClick={handleCreateForm}
            className="add-card"
          >
            <Card.Body>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9rem"
                fill="grey"
                className="bi bi-file-plus"
                viewBox="1 0 13 13"
              >
                <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z" />
              </svg>
            </Card.Body>
          </Card>
        </Col>

        {snacks
          .filter((snack: Snack) => {
            return searchName.toLowerCase() !== ''
              ? snack?.name?.toLowerCase().includes(searchName.toLowerCase())
              : snack;
          })
          .map((snack: Snack, key) => (
            <Col key={key}>
              <Card
                key={snack._id}
                style={{ width: '18rem' }}
                className="snack-item"
              >
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
                  <Card.Title>{snack.name}</Card.Title>
                  <Card.Text className="card-text">
                    <>
                      <label>Last Day Consumed: </label>{' '}
                      {formatDate(snack?.lastDayConsumed)}
                      <br />
                      <label>Favorite: </label>{' '}
                      {getFavoriteIconStatus(snack?.isFavorite)}
                      <br />
                      <label>Calories: </label> {snack?.calories?.value}{' '}
                      {snack?.calories?.unit}
                    </>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="primary"
                    onClick={(event) => openCreateEditSnack(snack)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={(event) => openConfirmDeleteModal(snack)}
                  >
                    Remove
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
      </Row>
      {snacks.length === 0 && (
        <div>
          <label className="no-data-label">-No data has been found-</label>
        </div>
      )}
      <ConfirmationModal />
      <SnackForm
        showForm={showForm}
        selectedSnack={selectedSnack}
        callbackModal={callbackModal}
      />
    </Container>
  );
}
export default SnackList;
