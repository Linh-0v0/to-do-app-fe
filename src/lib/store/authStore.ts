import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "../types";

type AuthStore = AuthState & {
  // Login methods
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  loginWithFirebase: (firebaseUid: string) => Promise<void>;

  // Register methods
  registerWithEmailPassword: (
    email: string,
    password: string,
    username?: string,
    firstname?: string,
    lastname?: string
  ) => Promise<void>;
  registerWithFirebase: (
    firebaseUid: string,
    email: string,
    username?: string,
    firstname?: string,
    lastname?: string
  ) => Promise<void>;

  // Other auth methods
  logout: () => Promise<void>;
  updateFCMToken: (token: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;

  // State management
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Login methods
      loginWithEmailPassword: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock implementation - replace with actual API call
          // const response = await api.post('/auth/signin', { email, password });
          // const { user, token } = response.data;

          // Simulate successful login
          const mockUser: User = {
            id: "1",
            email,
            createdAt: new Date(),
          };

          const mockToken = "mock-jwt-token";

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
        }
      },

      loginWithFirebase: async (firebaseUid: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock implementation - replace with actual API call
          // const response = await api.post('/auth/firebase-signin', { firebaseUid });
          // const { user, token } = response.data;

          // Simulate successful login
          const mockUser: User = {
            id: "1",
            firebaseUid,
            email: "firebase-user@example.com",
            createdAt: new Date(),
          };

          const mockToken = "mock-firebase-jwt-token";

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Firebase login failed",
            isLoading: false,
          });
        }
      },

      // Register methods
      registerWithEmailPassword: async (
        email: string,
        password: string,
        username?: string,
        firstname?: string,
        lastname?: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          // Mock implementation - replace with actual API call
          // const response = await api.post('/auth/signup', {
          //   email, password, username, firstname, lastname
          // });
          // const { user, token } = response.data;

          // Simulate successful registration
          const mockUser: User = {
            id: "1",
            email,
            username,
            firstname,
            lastname,
            createdAt: new Date(),
          };

          const mockToken = "mock-jwt-token";

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
          });
        }
      },

      registerWithFirebase: async (
        firebaseUid: string,
        email: string,
        username?: string,
        firstname?: string,
        lastname?: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          // Mock implementation - replace with actual API call
          // const response = await api.post('/auth/firebase-signup', {
          //   firebaseUid, email, username, firstname, lastname
          // });
          // const { user, token } = response.data;

          // Simulate successful registration
          const mockUser: User = {
            id: "1",
            firebaseUid,
            email,
            username,
            firstname,
            lastname,
            createdAt: new Date(),
          };

          const mockToken = "mock-firebase-jwt-token";

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Firebase registration failed",
            isLoading: false,
          });
        }
      },

      // Other auth methods
      logout: async () => {
        set({ isLoading: true });
        try {
          // Mock implementation - replace with actual API call
          // await api.post('/auth/logout');

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Logout failed",
            isLoading: false,
          });
        }
      },

      updateFCMToken: async (token: string) => {
        if (!get().isAuthenticated) {
          set({ error: "Not authenticated" });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          // Mock implementation - replace with actual API call
          // await api.patch('/auth/update-fcm-token', { fcmToken: token });

          set({
            user: get().user ? { ...get().user, fcmToken: token } : null,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Updating FCM token failed",
            isLoading: false,
          });
        }
      },

      refreshToken: async () => {
        set({ isLoading: true, error: null });
        try {
          // Mock implementation - replace with actual API call
          // const response = await api.post('/auth/refresh-token');
          // const { token } = response.data;

          const mockToken = "mock-refreshed-jwt-token";

          set({ token: mockToken, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Token refresh failed",
            isLoading: false,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      changePassword: async (oldPassword: string, newPassword: string) => {
        if (!get().isAuthenticated) {
          set({ error: "Not authenticated" });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          // Mock implementation - replace with actual API call
          // await api.post('/auth/change-password', { oldPassword, newPassword });

          set({ isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Password change failed",
            isLoading: false,
          });
        }
      },

      // State management
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "todo-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
