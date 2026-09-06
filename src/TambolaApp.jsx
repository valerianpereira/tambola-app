import { useState, useRef } from 'react';
import { useGameState } from './useGameState';
import { TAMBOLA_RHYMES, ballStyle, PRIZES } from './data';
import { Icon } from './Icons';

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

// ---------- Hero row: ball + meta column (stats + previous) ----------
function HeroRow({ state }) {
  const { current, popKey, voice, called, remaining, elapsed } = state;
  const rhyme = current ? TAMBOLA_RHYMES[current] : null;
  const prev = called.slice(-6, -1).reverse();
  const prevSlots = [...prev];
  while (prevSlots.length < 5) prevSlots.push(null);

  return (
    <div className="hero-row">
      <div className="hero-ball-col">
        <div className="hero-label">
          <span className="pulse" />
          {current ? 'Now calling' : 'Ready'}
        </div>
        {current ? (
          <div key={popKey} className="ball filled pop" style={ballStyle(current)}>
            {current}
          </div>
        ) : (
          <div className="ball empty">&mdash;</div>
        )}
        {current && voice && rhyme ? (
          <div className="hero-rhyme">
            <b>{current}</b> &mdash; {rhyme}
          </div>
        ) : (
          <div className="hero-rhyme-spacer" />
        )}
      </div>

      <div className="hero-meta-col">
        <div className="meta-stats">
          <div className="meta-stat">
            <div className="l">Called</div>
            <div className="v">
              {called.length}
              <em>/90</em>
            </div>
          </div>
          <div className="meta-stat">
            <div className="l">Left</div>
            <div className="v">{remaining}</div>
          </div>
          <div className="meta-stat">
            <div className="l">Time</div>
            <div className="v small">{fmtTime(elapsed)}</div>
          </div>
        </div>
        <div className="meta-prev">
          <div className="meta-prev-label">Previous</div>
          <div className="meta-prev-row">
            {prevSlots.map((n, i) =>
              n ? (
                <div key={i} className="mini-ball" style={ballStyle(n)}>
                  {n}
                </div>
              ) : (
                <div key={i} className="mini-ball empty">
                  &ndash;
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Board ----------
function Board({ calledSet, current, called }) {
  return (
    <div className="board-wrap">
      <div className="board-head">
        <span className="l">Board &middot; 1&ndash;90</span>
        <span className="count">
          <b>{called.length}</b> / 90 called
        </span>
      </div>
      <div className="board">
        {Array.from({ length: 90 }, (_, i) => i + 1).map(n => {
          const isCalled = calledSet.has(n);
          const isLast = n === current;
          return (
            <div
              key={n}
              className={`cell${isCalled ? ' called' : ''}${isLast ? ' last' : ''}`}
              style={isCalled ? ballStyle(n) : undefined}
            >
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Prize rail ----------
function PrizeRail({ claimed, toggleClaim }) {
  return (
    <div className="prizes">
      <div className="prizes-head">Prizes &middot; tap to mark claimed</div>
      <div className="prize-rail">
        {PRIZES.map(p => {
          const isClaimed = !!claimed[p.id];
          return (
            <button
              key={p.id}
              className={`prize-chip${isClaimed ? ' claimed' : ''}`}
              onClick={() => toggleClaim(p.id, p.label)}
            >
              {isClaimed ? (
                <span className="check">&check;</span>
              ) : (
                <span className="dot" />
              )}
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Control deck ----------
function ControlDeck({ state }) {
  const { running, setRunning, speed, setSpeed, callNext, undoLast, resetGame, finished, called } = state;
  const canUndo = called.length > 0;
  const [confirmUndo, setConfirmUndo] = useState(false);
  const confirmTimer = useRef(null);

  const onUndo = () => {
    if (!confirmUndo) {
      setConfirmUndo(true);
      confirmTimer.current = setTimeout(() => setConfirmUndo(false), 3000);
      return;
    }
    clearTimeout(confirmTimer.current);
    setConfirmUndo(false);
    undoLast();
  };

  const onPrimary = () => {
    if (finished) {
      resetGame();
      return;
    }
    setRunning(r => !r);
  };

  return (
    <div className="control-deck">
      <div className="speed-row">
        <div className="speed-label">Auto-call speed</div>
        <div className="speed-segmented">
          {[
            { id: 'fast', label: '5s' },
            { id: 'normal', label: '7s' },
            { id: 'slow', label: '10s' },
          ].map(s => (
            <button
              key={s.id}
              className={speed === s.id ? 'active' : ''}
              onClick={() => setSpeed(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="main-controls">
        <button className={`side-btn${confirmUndo ? ' confirm' : ''}`} onClick={onUndo} disabled={!canUndo}>
          <div className="icon-row">
            <Icon name="undo" size={18} />
          </div>
          {confirmUndo ? 'Sure?' : 'Undo'}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            className={`primary-cta${running ? ' running' : ''}${finished ? ' finished' : ''}`}
            onClick={onPrimary}
            aria-label={finished ? 'Restart' : running ? 'Pause' : 'Start'}
          >
            {finished ? (
              <Icon name="refresh" size={32} stroke="#fff" />
            ) : running ? (
              <Icon name="pause" size={32} stroke="#fff" />
            ) : (
              <Icon name="play" size={32} stroke="#fff" />
            )}
          </button>
          <div className="primary-cta-label">
            {finished ? 'Restart' : running ? 'Pause' : called.length === 0 ? 'Start' : 'Resume'}
          </div>
        </div>

        <button className="side-btn" onClick={callNext} disabled={finished}>
          <div className="icon-row">
            <Icon name="skip" size={18} />
          </div>
          Next
        </button>
      </div>
      <div className="footer-actions">
        <button className="ghost-btn" onClick={callNext} disabled={finished}>
          <Icon name="hand" size={13} /> Manual call
        </button>
        <button className="ghost-btn danger" onClick={resetGame}>
          <Icon name="refresh" size={13} /> New game
        </button>
      </div>
    </div>
  );
}

// ---------- Confetti layer ----------
function Confetti({ burst }) {
  if (!burst) return null;
  const colors = ['#dc354b', '#ffcc00', '#038770', '#3e6eea', '#8a38f5', '#ff5264', '#28cd4c', '#ffa61a'];
  const pieces = Array.from({ length: 40 }, (_, i) => {
    const dx = Math.random() * 320 - 160;
    const rot = Math.random() * 720 - 360;
    const left = 50 + (Math.random() * 30 - 15);
    const delay = Math.random() * 200;
    const color = colors[i % colors.length];
    const w = 6 + Math.random() * 6;
    const h = 10 + Math.random() * 8;
    return (
      <div
        key={`${burst}-${i}`}
        className="confetti"
        style={{
          left: `${left}%`,
          background: color,
          width: w,
          height: h,
          animationDelay: `${delay}ms`,
          '--dx': `${dx}px`,
          '--rot': `${rot}deg`,
        }}
      />
    );
  });
  return (
    <div key={burst} className="confetti-layer">
      {pieces}
    </div>
  );
}

// ---------- Main app ----------
export default function TambolaApp({ theme = 'dark', themeMode = 'system', onToggleTheme }) {
  const state = useGameState();

  return (
    <div className={`tambola-app theme-${theme}`}>
      <div className="app-header">
        <div className="logo-dot">T</div>
        <div className="title">
          Tambola
          <span>Caller &middot; Housie 1&ndash;90</span>
        </div>
        <button
          className={`icon-btn${state.voice ? ' on' : ''}`}
          onClick={() => state.setVoice(v => !v)}
          aria-label="Toggle voice rhymes"
          title="Toggle voice rhymes"
        >
          <Icon name={state.voice ? 'volume' : 'volume-off'} size={16} />
        </button>
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title={themeMode === 'system' ? 'Theme: System' : themeMode === 'light' ? 'Theme: Light' : 'Theme: Dark'}
        >
          {themeMode === 'system' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          ) : theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>
      </div>

      <HeroRow state={state} />
      <Board calledSet={state.calledSet} current={state.current} called={state.called} />
      <PrizeRail claimed={state.claimed} toggleClaim={state.toggleClaim} />
      <ControlDeck state={state} />

      {state.toast && (
        <div className="toast" key={state.toast.id}>
          <span className="t-dot" />
          {state.toast.msg}
        </div>
      )}
      <Confetti burst={state.confettiBurst} />
    </div>
  );
}
