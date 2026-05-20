import { useCallback, useEffect, useState } from 'react';
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Snack } from '../models/snack';
import useSnackStore from '../stores/snackStore';
import SnackForm from './SnackForm';
import { formatDate, getFavoriteIconStatus } from '../utils/utilsUI';
import { api } from '../api/client';
import './SnackList.scss';

function SnackList() {
  const snacks = useSnackStore((state) => state.snacks);
  const setSnacks = useSnackStore((state) => state.setSnacks);
  const removeSnackFromStore = useSnackStore((state) => state.removeSnack);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState<Snack | undefined>();
  const [searchName, setSearchName] = useState('');

  const openCreateForm = useCallback(() => {
    setSelectedSnack(undefined);
    setShowForm(true);
  }, []);

  const openEditForm = useCallback((snack: Snack) => {
    setSelectedSnack({ ...snack });
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => setShowForm(false), []);

  const openDeleteModal = useCallback((snack: Snack) => {
    setSelectedSnack(snack);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => setShowDeleteModal(false), []);

  const handleDelete = useCallback(
    async (snackId: string) => {
      try {
        const { data } = await api.delete(`/snacks/${snackId}`);
        removeSnackFromStore(snackId);
        toast.success(`${data.name} was deleted successfully`);
      } catch {
        toast.error('Something went wrong — snack was not deleted');
      } finally {
        setShowDeleteModal(false);
      }
    },
    [removeSnackFromStore],
  );

  const refreshSnacks = useCallback(async () => {
    try {
      const { data } = await api.get<Snack[]>('/snacks');
      setSnacks(data);
    } catch {
      toast.error('Failed to load snacks');
    }
  }, [setSnacks]);

  useEffect(() => {
    refreshSnacks();
  }, [refreshSnacks]);

  const visibleSnacks = searchName
    ? snacks.filter((snack) =>
        snack.name.toLowerCase().includes(searchName.toLowerCase()),
      )
    : snacks;

  return (
    <Container className="snacks-container">
      <Row className="create">
        <Col>
          <Button onClick={openCreateForm} variant="primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="bi bi-file-plus"
              viewBox="1 0 13 13"
            >
              <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z" />
            </svg>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <InputGroup className="my-3">
              <Form.Control
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search for snacks by name"
              />
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        {visibleSnacks.map((snack) => (
          <Col key={snack._id}>
            <Card style={{ width: '18rem' }} className="snack-item">
              <Card.Body>
                <Card.Title>{snack.name}</Card.Title>
                <Card.Text as="div" className="card-text">
                  <div>
                    <label>Last Day Consumed: </label>{' '}
                    {formatDate(snack.lastDayConsumed)}
                  </div>
                  <div>
                    <label>Favorite: </label>{' '}
                    {getFavoriteIconStatus(snack.isFavorite)}
                  </div>
                  <div>
                    <label>Calories: </label> {snack.calories?.value}{' '}
                    {snack.calories?.unit}
                  </div>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" onClick={() => openEditForm(snack)}>
                  Update
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => openDeleteModal(snack)}
                >
                  Remove
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      {snacks.length === 0 && (
        <Row>
          <Col>
            <div>
              <label className="no-data-label">-No data has been found-</label>
            </div>
          </Col>
        </Row>
      )}

      {selectedSnack && (
        <Modal show={showDeleteModal} onHide={closeDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You are about to delete this snack: {selectedSnack.name}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => handleDelete(selectedSnack._id)}
            >
              Delete
            </Button>
            <Button variant="secondary" onClick={closeDeleteModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <SnackForm
        showForm={showForm}
        selectedSnack={selectedSnack}
        onClose={closeForm}
      />
    </Container>
  );
}

export default SnackList;
