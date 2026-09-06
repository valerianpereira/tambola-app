import { useState, useEffect, useMemo } from 'react';
import TambolaApp from './TambolaApp';
import './app.css';

function useSystemDark() {
  const mq = useMemo(() => matchMedia('(prefers-color-scheme: dark)'), []);
  const [dark, setDark] = useState(mq.matches);
  useEffect(() => {
    const h = (e) => setDark(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [mq]);
  return dark;
}

export default function App() {
  const [mode, setMode] = useState('system'); // 'system' | 'light' | 'dark'
  const systemDark = useSystemDark();
  const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
  const cycleTheme = () => setMode(m => m === 'system' ? 'light' : m === 'light' ? 'dark' : 'system');

  return (
    <div className="app-shell" data-theme={resolved}>
      <TambolaApp theme={resolved} themeMode={mode} onToggleTheme={cycleTheme} />
    </div>
  );
}
