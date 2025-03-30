import apiClient from "../api/apiClient";
import { User, ApiResponse } from "../types";

type AuthResponse = {
    user: User;
    token: string;
    refreshToken: string;
};

export const authService = {
    // Manual authentication methods
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await apiClient.post<{ accessToken: string; refreshToken: string }>("/auth/signin", {
            email,
            password,
        });

        // Create a minimal user object based on login data
        const user: User = {
            id: "temp-id", // This will be replaced when we fetch user details
            email,
            createdAt: new Date(),
        };

        return {
            user,
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
        };
    },

    async register(
        email: string,
        password: string,
        firstname?: string,
        lastname?: string,
        username?: string
    ): Promise<AuthResponse> {
        const response = await apiClient.post<{ accessToken: string; refreshToken: string }>("/auth/signup", {
            email,
            password,
            firstname,
            lastname,
            username
        });

        // Create a minimal user object based on registration data
        const user: User = {
            id: "temp-id", // This will be replaced when we fetch user details later
            email,
            firstname,
            lastname,
            username,
            createdAt: new Date(),
        };

        return {
            user,
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
        };
    },

    // Firebase authentication methods
    async googleLogin(idToken: string): Promise<AuthResponse> {
        const response = await apiClient.post<{ accessToken: string; refreshToken: string; userdb?: any; firebaseUser?: any }>("/auth/google-login", {
            idToken,
        });

        // Extract user data from response
        const userData = response.data.userdb || {};
        const firebaseUserData = response.data.firebaseUser || {};

        const user: User = {
            id: userData.id || "temp-id",
            email: userData.email || firebaseUserData.email || "",
            firstname: userData.firstname || "",
            lastname: userData.lastname || "",
            createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
            firebaseUid: firebaseUserData.uid || userData.firebaseUid,
        };

        return {
            user,
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
        };
    },

    // User data
    async getUserProfile(): Promise<User> {
        try {
            // The backend directly returns the user object with limited fields
            const response = await apiClient.get("/users/me");
            console.log("User profile raw response:", response);

            // The backend is configured to only return: id, email, username, createdAt
            const userData = response.data;

            if (!userData || !userData.id) {
                throw new Error("Invalid user data received");
            }

            // Convert createdAt to Date object if it's a string
            if (userData.createdAt && typeof userData.createdAt === 'string') {
                userData.createdAt = new Date(userData.createdAt);
            }

            return userData as User;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    },

    // Token management
    async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
        const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
            "/auth/refresh-token",
            {
                refreshToken,
            }
        );
        return {
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken
        };
    },

    // User management
    async logout(): Promise<void> {
        await apiClient.post("/auth/logout");
    },

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        await apiClient.post("/auth/change-password", {
            oldPassword,
            newPassword,
        });
    },

    async updateFcmToken(fcmToken: string): Promise<void> {
        await apiClient.patch("/auth/update-fcm-token", {
            fcmToken,
        });
    },
}; 