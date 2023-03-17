// @ts-nocheck
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from './zustandStorage'

const initialConfigState = {
  fishes: 0,
  pairingId: null,
}
const createConfigSlice = (set: any) => ({
  ...initialConfigState,
  addFish: () => set((state: any) => ({ fishes: state.fishes + 1 })),
  updatePairingId: (p: string) => set(() => ({ pairingId: p})),
  reset: () => {
    set(initialConfigState)
  },
})



export const useBoundStore = create(
  persist(
    (...a) => ({
      ...createConfigSlice(...a),
    }),
    { name: 'bound-store',
      storage: createJSONStorage(() => zustandStorage)
   }
  )
)
