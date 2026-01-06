import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser } from '@/types/auth'

/**
 * 认证状态接口。
 */
interface AuthState {
  auth: {
    user: AuthUser | null
    accessToken: string
    isAuthenticated: boolean
    setUser: (user: AuthUser | null) => void
    setAccessToken: (token: string) => void
    setAuth: (user: AuthUser, token: string) => void
    reset: () => void
  }
}

/**
 * 认证状态存储。
 *
 * @example
 * ```tsx
 * const { user, accessToken, setAuth, reset } = useAuthStore((state) => state.auth)
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: {
        user: null,
        accessToken: '',
        isAuthenticated: false,

        setUser: (user) =>
          set((state) => ({
            auth: {
              ...state.auth,
              user,
              isAuthenticated: !!user && !!state.auth.accessToken,
            },
          })),

        setAccessToken: (accessToken) =>
          set((state) => ({
            auth: {
              ...state.auth,
              accessToken,
              isAuthenticated: !!state.auth.user && !!accessToken,
            },
          })),

        setAuth: (user, accessToken) =>
          set((state) => ({
            auth: {
              ...state.auth,
              user,
              accessToken,
              isAuthenticated: true,
            },
          })),

        reset: () =>
          set((state) => ({
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              isAuthenticated: false,
            },
          })),
      },
    }),
    {
      name: 'literature-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        auth: {
          user: state.auth.user,
          accessToken: state.auth.accessToken,
          isAuthenticated: state.auth.isAuthenticated,
        },
      }),
    }
  )
)
