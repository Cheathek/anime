import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

/**
 * Combines Tailwind classes conditionally using clsx and twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a more readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function getYoutubeId(url?: string): string | null {
  if (!url) return null;
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[7].length === 11) ? match[7] : null;
}

/**
 * Generate a random color from a string (useful for genre tags)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200',
    'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200',
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  ];
  
  return colors[Math.abs(hash) % colors.length];
}