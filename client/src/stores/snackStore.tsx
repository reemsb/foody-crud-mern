import { create } from 'zustand';
import { Snack } from '../models/snack';

interface SnackState {
  snacks: Snack[];
  setSnacks: (snacks: Snack[]) => void;
  addSnack: (snack: Snack) => void;
  removeSnack: (id: string) => void;
  editSnack: (snack: Snack) => void;
}

const useSnackStore = create<SnackState>((set) => ({
  snacks: [],
  setSnacks: (snacks) => set({ snacks }),
  addSnack: (snack) =>
    set((state) => ({ snacks: [...state.snacks, snack] })),
  removeSnack: (id) =>
    set((state) => ({ snacks: state.snacks.filter((s) => s._id !== id) })),
  editSnack: (updated) =>
    set((state) => ({
      snacks: state.snacks.map((s) => (s._id === updated._id ? updated : s)),
    })),
}));

export default useSnackStore;
