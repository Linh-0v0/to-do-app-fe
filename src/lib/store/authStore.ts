import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "../types";
import { authService } from "../services/authService";

type AuthStore = AuthState & {
  // Login methods
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  loginWithFirebase: (idToken: string) => Promise<void>;

  // Register methods
  registerWithEmailPassword: (
    email: string,
    password: string,
    firstname?: string,
    lastname?: string,
    username?: string
  ) => Promise<void>;

  // Other auth methods
  logout: () => Promise<void>;
  updateFCMToken: (token: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateUserProfile: (data: {
    firstname?: string;
    lastname?: string;
    username?: string;
  }) => Promise<void>;

  // State management
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  refreshTokenValue: string | null;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshTokenValue: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Login methods
      loginWithEmailPassword: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          set({
            user: response.user,
            token: response.token,
            refreshTokenValue: response.refreshToken,
            isAuthenticated: true,
          });

          // Fetch complete user profile after authentication
          try {
            const userProfile = await authService.getUserProfile();
            console.log("Fetched user profile:", userProfile);

            // Ensure createdAt is a Date object
            const formattedProfile = {
              ...userProfile,
              createdAt:
                userProfile.createdAt instanceof Date
                  ? userProfile.createdAt
                  : new Date(userProfile.createdAt),
            };

            set({
              user: formattedProfile,
              isLoading: false,
            });
          } catch (profileError) {
            console.error("Failed to fetch user profile:", profileError);
            set({ isLoading: false });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      loginWithFirebase: async (idToken: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.googleLogin(idToken);
          set({
            user: response.user,
            token: response.token,
            refreshTokenValue: response.refreshToken,
            isAuthenticated: true,
          });

          // Fetch complete user profile after authentication
          try {
            const userProfile = await authService.getUserProfile();
            console.log("Fetched user profile:", userProfile);

            // Ensure createdAt is a Date object
            const formattedProfile = {
              ...userProfile,
              createdAt:
                userProfile.createdAt instanceof Date
                  ? userProfile.createdAt
                  : new Date(userProfile.createdAt),
            };

            set({
              user: formattedProfile,
              isLoading: false,
            });
          } catch (profileError) {
            console.error("Failed to fetch user profile:", profileError);
            set({ isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Firebase login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      // Register methods
      registerWithEmailPassword: async (
        email: string,
        password: string,
        firstname?: string,
        lastname?: string,
        username?: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(
            email,
            password,
            firstname,
            lastname,
            username
          );
          set({
            user: response.user,
            token: response.token,
            refreshTokenValue: response.refreshToken,
            isAuthenticated: true,
          });

          // Fetch complete user profile after authentication
          try {
            const userProfile = await authService.getUserProfile();
            console.log("Fetched user profile:", userProfile);

            // Ensure createdAt is a Date object
            const formattedProfile = {
              ...userProfile,
              createdAt:
                userProfile.createdAt instanceof Date
                  ? userProfile.createdAt
                  : new Date(userProfile.createdAt),
            };

            set({
              user: formattedProfile,
              isLoading: false,
            });
          } catch (profileError) {
            console.error("Failed to fetch user profile:", profileError);
            set({ isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      // Other auth methods
      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout API error:", error);
          // Continue with logout even if API fails
        } finally {
          // Always clear local state regardless of API success
          set({
            user: null,
            token: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
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
          await authService.updateFcmToken(token);
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                fcmToken: token,
              },
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Updating FCM token failed",
            isLoading: false,
          });
          throw error;
        }
      },

      refreshToken: async () => {
        set({ isLoading: true, error: null });
        try {
          const refreshToken = get().refreshTokenValue;
          if (!refreshToken) {
            // Just set not loading and return instead of throwing
            set({ isLoading: false });
            return;
          }

          const response = await authService.refreshToken(refreshToken);
          set({
            token: response.token,
            refreshTokenValue: response.refreshToken,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Token refresh failed",
            isLoading: false,
            token: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            user: null,
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
          await authService.changePassword(oldPassword, newPassword);
          set({ isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Password change failed",
            isLoading: false,
          });
          throw error;
        }
      },

      updateUserProfile: async (data: {
        firstname?: string;
        lastname?: string;
        username?: string;
      }) => {
        if (!get().isAuthenticated) {
          set({ error: "Not authenticated" });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          await authService.updateUserProfile(data);
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                ...data,
              },
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Updating user profile failed",
            isLoading: false,
          });
          throw error;
        }
      },

      // State setters
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) =>
        set({
          token,
          isAuthenticated: !!token,
        }),
      setRefreshToken: (refreshToken: string | null) =>
        set({ refreshTokenValue: refreshToken }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshTokenValue: state.refreshTokenValue,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
