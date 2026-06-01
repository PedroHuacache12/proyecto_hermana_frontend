const BASE = import.meta.env.VITE_STORAGE_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

export const storageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE}${url}`;
};
