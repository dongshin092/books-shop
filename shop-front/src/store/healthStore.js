import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// 검증용 최소 스토어.
// zustand + persist(새로고침 방어) + immer(불변성 간소화) 적용 골격.
export const useHealthStore = create()(
  persist(
    immer((set) => ({
      lastStatus: null,
      setStatus: (status) =>
        set((state) => {
          state.lastStatus = status
        }),
    })),
    { name: 'books-shop-health' },
  ),
)