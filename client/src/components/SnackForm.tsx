import { useCallback, useState } from 'react';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Modal, Form, FormGroup, Row, Col } from 'react-bootstrap/';
import './SnackForm.scss';
import useSnackStore from '../stores/snackStore';
import { Snack } from '../models/snack';
import { getLocalDateTimeInput } from '../utils/utilsUI';
import { toast } from 'react-toastify';

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
function SnackForm(props: formProps) {
  //store states
  const addSnack = useSnackStore((state) => state.addSnack);
  const editSnack = useSnackStore((state) => state.editSnack);

  //initial states in edit mode:
  const initialValues: Partial<Snack> = props.selectedSnack
    ? {
        name: props.selectedSnack.name,
        isFavorite: props.selectedSnack.isFavorite,
        lastDayConsumed: props.selectedSnack.lastDayConsumed,
        calories: {
          value: props.selectedSnack.calories?.value,
          unit: props.selectedSnack.calories?.unit,
        },
      }
    : {
        name: '',
        isFavorite: false,
        lastDayConsumed: new Date(),
        calories: {
          value: 0,
          unit: 'Kcal',
        },
      };
  //local states definition
  const [name, setName] = useState(initialValues.name);
  const [favorite, setFavorite] = useState(initialValues.isFavorite);
  const [lastDay, setLastDay] = useState(initialValues.lastDayConsumed);
  const [caloriesValue, setCaloriesValue] = useState(
    initialValues?.calories?.value
  );
  const [cloriesUnit, setCaloriesUnit] = useState(
    initialValues?.calories?.unit
  );

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
    console.log('snack to be created: ' + snackToAdd.calories);
    Axios.post('http://localhost:3001/api/v1/snacks/', snackToAdd)
      .then((response) => {
        addSnack(response.data);
        props.callbackModal();
        toast.success(`${response.data.name} was added successfully!`);
      })
      .catch((error) => {
        toast.error('The snack was not added, something went wrong');
      });
  }, [caloriesValue, cloriesUnit, favorite, lastDay, name]);

  const updateSnack = useCallback(() => {
    if (!!props.selectedSnack) {
      let snack: Snack = {
        _id: props.selectedSnack._id,
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
          editSnack(response.data);
          toast.success(`${response.data.name} was updated successfully!`);
          props.callbackModal();
        })
        .catch((error) => {
          toast.error('The snack was not updated, something went wrong');
        });
    } else {
      console.warn('No snack found to edit here');
    }
  }, [
    caloriesValue,
    cloriesUnit,
    favorite,
    lastDay,
    name,
    props.selectedSnack,
    editSnack,
    props,
  ]);

  const CreateUpdateSnack = useCallback(() => {
    if (props?.selectedSnack?._id) {
      updateSnack();
    } else {
      createSnack();
    }
    props.callbackModal();
  }, [createSnack, props, updateSnack]);

  //UI
  return (
    <Modal show={props.showForm} onHide={props.callbackModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {props.selectedSnack?._id ? (
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
        <Button variant="secondary" onClick={props.callbackModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default SnackForm;
