import { useEffect, useState } from 'react';
import Landing from './Landing.jsx';
import Admin from './Admin.jsx';
import { defaultContent } from './defaultContent.js';
import { fetchContent, readCache, writeCache } from './content.js';

function useLiveContent() {
  const [content, setContent] = useState(() => readCache() || defaultContent);
  useEffect(() => {
    let off = false;
    fetchContent()
      .then(({ content: c, stored }) => {
        if (off || !stored) return;
        setContent(c);
        writeCache(c);
      })
      .catch(() => {});
    return () => {
      off = true;
    };
  }, []);
  return content;
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/admin') return <Admin />;
  return <PublicSite />;
}

function PublicSite() {
  const content = useLiveContent();
  useEffect(() => {
    document.title = content.brand || 'Online Shogirdlik';
  }, [content.brand]);
  return <Landing c={content} />;
}
