// Type definitions based on the Prisma schema

/**
 * Enum for repeat types
 */
export enum RepeatType {
  NONE = "none",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

/**
 * User model type
 */
export type User = {
  id: string;
  firebaseUid?: string;
  email: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  createdAt: Date;
  fcmToken?: string;
};

/**
 * Task model type
 */
export type Task = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: boolean;
  priority: number;
  dueDate?: Date;
  reminder?: Date;
  jobKey?: string;
  repeatType: RepeatType;
  taggedUsers?: TaskTaggedUser[];
};

/**
 * Tagged users type
 */
export type TaskTaggedUser = {
  taskId: string;
  userId: string;
  user?: User;
};

/**
 * Auth context state type
 */
export type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
};

/**
 * Form input types
 */
export type LoginInputs = {
  email: string;
  password: string;
};

export type RegisterInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  firstname?: string;
  lastname?: string;
  username?: string;
};

export type TaskFormInputs = {
  title: string;
  description?: string;
  status: boolean;
  priority: number;
  dueDate?: Date | string;
  reminder?: Date | string;
  repeatType: RepeatType;
  taggedUsers?: string[];
};

/**
 * API response types
 */
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

/**
 * RHF base input props type
 */
export type TRHFBaseItemProps<T extends Record<string, any>> = {
  name: keyof T;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};
