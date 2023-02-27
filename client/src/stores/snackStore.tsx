import create from "zustand";
import { Snack } from './models/snack.tsx';

interface SnackState {
  snacks: Snack[];
  setSnacks:(snacks:Snack[])=>void;
  addSnack: (snack:Partial<Snack>) => void;
  removeSnack: (id: string) => void;
  editSnack: (snack:Partial<Snack>) => void;
}

const useSnackStore = create<SnackState>((set) => ({
  // initial state
  snacks: [],
  setSnacks:(snacks:Snack[])=>set((state=>({
    ...state,
    snacks:[...state.snacks,...snacks]
  }))),
  // methods for manipulating state
  addSnack: (snackAdded:Partial<Snack>) => set(state=>(
    {
      ...state,
     snacks: [
      ...state.snacks,snackAdded
     ]
    }
  )),
  removeSnack: (removeID: string) => set(state=>({
    ...state,
    snacks: state.snacks.filter((id)=>id!==removeID)
  })),
  editSnack: (snackEdited:Partial<Snack>) => set(state=>({
    ...state,
    snacks:state.snacks.map((snack) => {
      if (snack._id===snackEdited._id){
        return {
        _id:snackEdited._id,
       name:snackEdited.name,
        lastDayConsumed:snackEdited.lastDayConsumed,
        isFavorite:snackEdited.isFavorite,
        calories: {
          value:snackEdited.calories.value,
          unit:snackEdited.calories.unit
        }
        } as Snack
      }
      return snack
    })
  }))
}));

export default useSnackStore