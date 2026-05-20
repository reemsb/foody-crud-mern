import { useCallback, useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
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
  const [submitting, setSubmitting] = useState(false);

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
      toast.success(`${data.name} added`);
    } catch {
      toast.error('Could not add snack');
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
      toast.success(`${data.name} updated`);
    } catch {
      toast.error('Could not update snack');
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

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!name.trim() || submitting) return;
      setSubmitting(true);
      try {
        if (selectedSnack?._id) {
          await submitUpdate();
        } else {
          await submitCreate();
        }
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [name, submitting, selectedSnack, submitCreate, submitUpdate, onClose],
  );

  const isEditing = Boolean(selectedSnack?._id);

  return (
    <Modal show={showForm} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit snack' : 'New snack'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="snack-form" onSubmit={handleSubmit}>
          <Form.Group className="field">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="e.g. Dark chocolate"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="field">
            <Form.Label>Last date consumed</Form.Label>
            <Form.Control
              type="datetime-local"
              value={getLocalDateTimeInput(lastDay)}
              max={getLocalDateTimeInput(new Date())}
              onChange={(event) =>
                setLastDay(
                  event.target.value
                    ? new Date(event.target.value)
                    : new Date(),
                )
              }
            />
          </Form.Group>

          <Form.Group className="field">
            <Form.Label>Calories</Form.Label>
            <div className="calories-row">
              <Form.Control
                aria-label="Calories value"
                type="number"
                placeholder="0"
                value={caloriesValue || ''}
                min={0}
                onChange={(event) =>
                  setCaloriesValue(Number(event.target.value) || 0)
                }
              />
              <Form.Select
                aria-label="Calorie unit"
                value={caloriesUnit}
                onChange={(event) => setCaloriesUnit(event.target.value as Unit)}
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Form.Group>

          <Form.Group className="field">
            <Form.Check
              type="checkbox"
              id="snack-favorite"
              label="Mark as favorite"
              checked={favorite}
              onChange={(event) => setFavorite(event.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSubmit()}
          disabled={!name.trim() || submitting}
        >
          {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add snack'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SnackForm;
