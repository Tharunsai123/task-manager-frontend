export const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#28a745' },
  { value: 'medium', label: 'Medium', color: '#ffc107' },
  { value: 'high', label: 'High', color: '#dc3545' }
];

export const CATEGORIES = [
  { value: 'work', label: '💼 Work', color: '#007bff' },
  { value: 'personal', label: '👤 Personal', color: '#6f42c1' },
  { value: 'shopping', label: '🛒 Shopping', color: '#fd7e14' },
  { value: 'health', label: '💊 Health', color: '#20c997' },
  { value: 'other', label: '📌 Other', color: '#6c757d' }
];

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'title', label: 'Title A-Z' },
  { value: '-title', label: 'Title Z-A' },
  { value: 'dueDate', label: 'Due Date' },
  { value: '-priority', label: 'Priority High-Low' }
];