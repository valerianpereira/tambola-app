import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { TAMBOLA_RHYMES } from './data';

async function speakText(text) {
  if (Capacitor.isNativePlatform()) {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
    await TextToSpeech.speak({ text, rate: 0.9, pitch: 1.0, volume: 1.0 });
  } else {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synth.speak(utterance);
    }
  }
}

export function useGameState() {
  const [called, setCalled] = useState([]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState('normal'); // slow | normal | fast
  const [voice, setVoice] = useState(true);
  const [claimed, setClaimed] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const [toast, setToast] = useState(null);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [popKey, setPopKey] = useState(0);

  const calledSet = useMemo(() => new Set(called), [called]);
  const remaining = 90 - called.length;
  const finished = remaining === 0;
  const current = called.length ? called[called.length - 1] : null;

  const speedMs = { slow: 10000, normal: 7000, fast: 5000 }[speed];

  const callNext = useCallback(() => {
    setCalled(prev => {
      if (prev.length >= 90) return prev;
      const set = new Set(prev);
      const pool = [];
      for (let i = 1; i <= 90; i++) if (!set.has(i)) pool.push(i);
      const next = pool[Math.floor(Math.random() * pool.length)];
      return [...prev, next];
    });
    setPopKey(k => k + 1);
  }, []);

  const undoLast = () => {
    setCalled(prev => prev.slice(0, -1));
    setPopKey(k => k + 1);
  };

  const resetGame = () => {
    setCalled([]);
    setRunning(false);
    setClaimed({});
    setElapsed(0);
    setToast({ id: Date.now(), msg: 'New game — 90 numbers reset' });
  };

  const toggleClaim = (prizeId, label) => {
    setClaimed(prev => {
      const next = { ...prev };
      if (next[prizeId]) {
        delete next[prizeId];
      } else {
        next[prizeId] = true;
        setToast({ id: Date.now(), msg: `${label} claimed!` });
        setConfettiBurst(b => b + 1);
      }
      return next;
    });
  };

  // Auto-call tick
  useEffect(() => {
    if (!running || finished) return;
    const id = setInterval(callNext, speedMs);
    return () => clearInterval(id);
  }, [running, finished, speedMs, callNext]);

  // Elapsed timer
  useEffect(() => {
    if (!running || finished) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [running, finished]);

  // Auto-pause on finish
  useEffect(() => {
    if (finished) setRunning(false);
  }, [finished]);

  // Speak number + rhyme when a new ball is called
  const prevCurrentRef = useRef(null);
  useEffect(() => {
    if (current && current !== prevCurrentRef.current && voice) {
      const rhyme = TAMBOLA_RHYMES[current];
      const digits = String(current).split('').join(' ');
      const text = rhyme
        ? `${digits}. Number ${current}. ${rhyme}.`
        : `${digits}. Number ${current}.`;
      speakText(text);
    }
    prevCurrentRef.current = current;
  }, [current, voice]);

  // Dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  return {
    called, calledSet, current, remaining, finished, popKey,
    running, setRunning, speed, setSpeed, voice, setVoice,
    claimed, toggleClaim, elapsed, toast, confettiBurst,
    callNext, undoLast, resetGame,
  };
}
