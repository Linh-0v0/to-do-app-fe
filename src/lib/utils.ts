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
 * Returns initials from a name (up to 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}


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
