// @ts-nocheck
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from './zustandStorage'

const initialConfigState = {
  fishes: 0,
  pairingId: null,
  accountId: null,
  config: {
    devMode: false,
    language: 'et',
    appearance: {
      theme: 'light',
      accentColor: '#3F80FF',
      borderRadius: 10,
      size: 'medium'
    }
  }
}
const createConfigSlice = (set: any) => ({
  ...initialConfigState,
  addFish: () => set((state: any) => ({ fishes: state.fishes + 1 })),
  updatePairingId: (p: string) => set(() => ({ pairingId: p})),
  updateConfig: (p: any) => set(() => ({ config: p})),
  updateAccountId: (p: string) => set(() => ({ accountId: p})),
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
