import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} — FWP Catálogo`;
    return () => { document.title = 'FWP Catálogo'; };
  }, [title]);
}
