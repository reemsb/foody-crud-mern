import { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Modal, Form, FormGroup, Row, Col } from 'react-bootstrap/';
import './SnackForm.scss';
import { Snack } from '../models/snack';
import { getLocalDateTimeInput } from '../utils/utilsUI';
import { toast } from 'react-toastify';
import useSnackStore from '../stores/snackStore';

//form props
export type formProps = {
  showForm: boolean;
  callbackModal: any;
  selectedSnack?: Snack;
};
/**
 * Create and edit form for a snack.
 * @param props
 * @returns createEditForm of a snack
 */
function SnackForm({ showForm, callbackModal, selectedSnack }: formProps) {
  const addSnackToList = useSnackStore((state) => state.addSnack);
  const editSnackToList = useSnackStore((state) => state.editSnack);

  //initial states in edit/create mode:
  //local states definition
  const [name, setName] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [lastDay, setLastDay] = useState<Date>(new Date());
  const [caloriesValue, setCaloriesValue] = useState<number>(0);
  const [cloriesUnit, setCaloriesUnit] = useState('kcal');

  // reset or prefill form when selectedSnack changes
  useEffect(() => {
    console.log(
      `use effect form: selectedSnack: ${JSON.stringify(selectedSnack)}`
    );
    if (selectedSnack) {
      setName(selectedSnack.name);
      setFavorite(selectedSnack.isFavorite);
      setLastDay(selectedSnack.lastDayConsumed);
      setCaloriesValue(selectedSnack.calories?.value ?? 0);
      setCaloriesUnit(selectedSnack.calories?.unit ?? 'Kcal');
    } else {
      // reset for create mode
      setName('');
      setFavorite(false);
      setLastDay(new Date());
      setCaloriesValue(0);
      setCaloriesUnit('Kcal');
    }
  }, [selectedSnack, showForm]);

  //callbacks
  const createSnack = useCallback(() => {
    let snackToAdd: Partial<Snack> = {
      name: name,
      lastDayConsumed: lastDay,
      isFavorite: favorite,
      calories: {
        value: caloriesValue as number,
        unit: cloriesUnit as string,
      },
    };
    Axios.post('http://localhost:3001/api/v1/snacks/', snackToAdd)
      .then((response) => {
        addSnackToList(response.data);
        toast.success(`${response.data.name} was added successfully!`);
      })
      .catch((error) => {
        toast.error('The snack was not added, something went wrong');
      });
  }, [addSnackToList, caloriesValue, cloriesUnit, favorite, lastDay, name]);

  const updateSnack = useCallback(() => {
    if (!!selectedSnack) {
      let snack: Snack = {
        _id: selectedSnack._id,
        name: name as string,
        lastDayConsumed: lastDay as Date,
        isFavorite: favorite as boolean,
        calories: {
          value: caloriesValue as number,
          unit: cloriesUnit as string,
        },
      };
      Axios.put('http://localhost:3001/api/v1/snacks/' + snack._id, snack)
        .then((response) => {
          editSnackToList(response.data);
          toast.success(`${response.data.name} was updated successfully!`);
        })
        .catch((error) => {
          console.debug(error);
          toast.error('The snack was not updated, something went wrong');
        });
    } else {
      console.warn('No snack found to edit here');
    }
  }, [
    caloriesValue,
    cloriesUnit,
    editSnackToList,
    favorite,
    lastDay,
    name,
    selectedSnack,
  ]);

  const CreateUpdateSnack = useCallback(() => {
    console.log(`callback in createUpdateSnack ${selectedSnack}`);
    if (selectedSnack?._id) {
      console.log('in update');
      updateSnack();
    } else {
      console.log('in create');
      createSnack();
    }
    callbackModal();
  }, [createSnack, updateSnack, selectedSnack, callbackModal]);

  //UI
  return (
    <Modal show={showForm} onHide={callbackModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedSnack?._id ? (
            <label>Update snack</label>
          ) : (
            <label>Add new snack</label>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <Form className="create-form">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="snack name"
                value={name}
                pattern="[a-zA-Z]"
                onChange={(event) => setName(event.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Date consumed:</Form.Label>
              <Form.Control
                type="datetime-local"
                value={getLocalDateTimeInput(lastDay)}
                max={getLocalDateTimeInput(new Date())}
                onChange={(event) => {
                  if (event.target.value !== null) {
                    setLastDay(new Date(event.target.value));
                  } else {
                    setLastDay(new Date());
                  }
                }}
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
                    min="0"
                    onChange={(event) =>
                      setCaloriesValue(parseInt(event.target.value))
                    }
                  />
                </Col>
                <Col>
                  <Form.Select
                    aria-label="Unit"
                    onChange={(event) => {
                      setCaloriesUnit(event.target.value);
                    }}
                  >
                    <option value="Kcal">Kcal</option>
                    <option value="Kj">Kj</option>
                  </Form.Select>
                </Col>
              </Row>
            </FormGroup>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Favorite"
                checked={favorite}
                onChange={(event) => {
                  setFavorite(event.target.checked);
                }}
              />
            </Form.Group>
          </Form>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={CreateUpdateSnack}>
          Save
        </Button>
        <Button variant="secondary" onClick={callbackModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default SnackForm;
