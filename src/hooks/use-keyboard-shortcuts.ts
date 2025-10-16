'use client';

import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const matchesKey = shortcut.key.toLowerCase() === event.key.toLowerCase();
        const matchesCtrl = shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey;
        const matchesMeta = shortcut.metaKey === undefined || shortcut.metaKey === event.metaKey;
        const matchesShift = shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey;
        const matchesAlt = shortcut.altKey === undefined || shortcut.altKey === event.altKey;

        if (matchesKey && matchesCtrl && matchesMeta && matchesShift && matchesAlt) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}