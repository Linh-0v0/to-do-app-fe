import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single className string
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncates text with ellipsis if it exceeds maxLength
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Returns initials from a name (up to 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Convert a UTC date to local date for display
 * This fixes the issue where dates from the server (UTC) need to be displayed in the user's local timezone
 */
export const utcToLocalDate = (utcDate: Date | string | null | undefined): Date | null => {
  if (!utcDate) return null;

  // Create a date object from the input
  const date = new Date(utcDate);

  // UTC time string - this preserves the UTC time but displays it in local timezone
  // We don't need to adjust the timezone offset manually
  return date;
};

/**
 * Convert a local date to UTC for API requests
 * This ensures dates selected by users in their local timezone are correctly stored as UTC in the database
 */
export const localToUtcDate = (localDate: Date | string | null | undefined): Date | null => {
  if (!localDate) return null;

  // Create a date object from the input
  const date = new Date(localDate);

  // Create a UTC date by setting the UTC components to match the local date components
  const utcDate = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ));

  return utcDate;
};

/**
 * Format a date with proper timezone adjustment
 */
export const formatDateTime = (date: Date | string): string => {
  if (!date) return "No date";

  // Make sure we're dealing with a Date object
  const localDate = new Date(date);

  // Get date part (e.g., "Aug 12, 2023")
  const dateStr = localDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Get time part (e.g., "2:30 PM")
  const timeStr = localDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${dateStr} at ${timeStr}`;
};
