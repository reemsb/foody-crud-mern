import { useCallback, useEffect, useState } from 'react';
import { Modal, Form, FormGroup, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Snack } from '../models/snack';
import { getLocalDateTimeInput } from '../utils/utilsUI';
import useSnackStore from '../stores/snackStore';
import { api } from '../api/client';
import './SnackForm.scss';

export type SnackFormProps = {
  showForm: boolean;
  onClose: () => void;
  selectedSnack?: Snack;
};

const UNITS = ['Kcal', 'Kj'] as const;
type Unit = (typeof UNITS)[number];

function SnackForm({ showForm, onClose, selectedSnack }: SnackFormProps) {
  const addSnackToStore = useSnackStore((state) => state.addSnack);
  const editSnackInStore = useSnackStore((state) => state.editSnack);

  const [name, setName] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [lastDay, setLastDay] = useState<Date>(new Date());
  const [caloriesValue, setCaloriesValue] = useState<number>(0);
  const [caloriesUnit, setCaloriesUnit] = useState<Unit>('Kcal');

  useEffect(() => {
    if (selectedSnack) {
      setName(selectedSnack.name);
      setFavorite(selectedSnack.isFavorite);
      setLastDay(new Date(selectedSnack.lastDayConsumed));
      setCaloriesValue(selectedSnack.calories?.value ?? 0);
      setCaloriesUnit((selectedSnack.calories?.unit as Unit) ?? 'Kcal');
    } else {
      setName('');
      setFavorite(false);
      setLastDay(new Date());
      setCaloriesValue(0);
      setCaloriesUnit('Kcal');
    }
  }, [selectedSnack, showForm]);

  const submitCreate = useCallback(async () => {
    try {
      const { data } = await api.post<Snack>('/snacks', {
        name,
        lastDayConsumed: lastDay,
        isFavorite: favorite,
        calories: { value: caloriesValue, unit: caloriesUnit },
      });
      addSnackToStore(data);
      toast.success(`${data.name} was added successfully!`);
    } catch {
      toast.error('The snack was not added — something went wrong');
    }
  }, [addSnackToStore, caloriesUnit, caloriesValue, favorite, lastDay, name]);

  const submitUpdate = useCallback(async () => {
    if (!selectedSnack) return;
    try {
      const { data } = await api.put<Snack>(`/snacks/${selectedSnack._id}`, {
        name,
        lastDayConsumed: lastDay,
        isFavorite: favorite,
        calories: { value: caloriesValue, unit: caloriesUnit },
      });
      editSnackInStore(data);
      toast.success(`${data.name} was updated successfully!`);
    } catch {
      toast.error('The snack was not updated — something went wrong');
    }
  }, [
    caloriesUnit,
    caloriesValue,
    editSnackInStore,
    favorite,
    lastDay,
    name,
    selectedSnack,
  ]);

  const handleSubmit = useCallback(async () => {
    if (selectedSnack?._id) {
      await submitUpdate();
    } else {
      await submitCreate();
    }
    onClose();
  }, [selectedSnack, submitCreate, submitUpdate, onClose]);

  return (
    <Modal show={showForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedSnack?._id ? 'Update snack' : 'Add new snack'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="create-form">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="snack name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last date consumed</Form.Label>
            <Form.Control
              type="datetime-local"
              value={getLocalDateTimeInput(lastDay)}
              max={getLocalDateTimeInput(new Date())}
              onChange={(event) =>
                setLastDay(
                  event.target.value ? new Date(event.target.value) : new Date(),
                )
              }
            />
          </Form.Group>
          <FormGroup className="mb-3">
            <Form.Label>Calories</Form.Label>
            <Row className="calories-input">
              <Col>
                <Form.Control
                  aria-label="Calories"
                  type="number"
                  placeholder="calories"
                  value={caloriesValue}
                  min="0"
                  onChange={(event) =>
                    setCaloriesValue(Number(event.target.value) || 0)
                  }
                />
              </Col>
              <Col>
                <Form.Select
                  aria-label="Unit"
                  value={caloriesUnit}
                  onChange={(event) =>
                    setCaloriesUnit(event.target.value as Unit)
                  }
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </FormGroup>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Favorite"
              checked={favorite}
              onChange={(event) => setFavorite(event.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SnackForm;
