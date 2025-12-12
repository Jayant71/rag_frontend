import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes with clsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  
  return date.toLocaleDateString();
}

// Format file size
export function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Get file icon based on mime type or extension
export function getFileIcon(filename: string, mimeType?: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (mimeType?.includes('pdf') || ext === 'pdf') return 'picture_as_pdf';
  if (mimeType?.includes('word') || ext === 'docx' || ext === 'doc') return 'description';
  if (mimeType?.includes('markdown') || ext === 'md') return 'markdown';
  if (mimeType?.includes('text') || ext === 'txt') return 'text_snippet';
  if (mimeType?.includes('csv') || ext === 'csv') return 'table_view';
  if (mimeType?.includes('excel') || ext === 'xlsx' || ext === 'xls') return 'table_view';
  
  return 'insert_drive_file';
}

// Get file icon color based on type
export function getFileIconColor(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'pdf':
      return 'text-red-600 bg-red-50';
    case 'docx':
    case 'doc':
      return 'text-blue-600 bg-blue-50';
    case 'md':
      return 'text-slate-600 bg-slate-100';
    case 'txt':
      return 'text-gray-500 bg-gray-100';
    case 'csv':
    case 'xlsx':
    case 'xls':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-500 bg-gray-100';
  }
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
