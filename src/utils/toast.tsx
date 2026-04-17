'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = sticky
}

interface ToastContextValue {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const CONFIG: Record<ToastType, { icon: React.ElementType; color: string; bg: string; border: string; progress: string }> = {
  success: {
    icon: CheckCircle2,
    color: 'var(--color-success-700)',
    bg: 'var(--color-success-50)',
    border: 'var(--color-success-200)',
    progress: 'var(--color-success-500)',
  },
  error: {
    icon: XCircle,
    color: 'var(--color-danger-700)',
    bg: 'var(--color-danger-50)',
    border: 'var(--color-danger-200)',
    progress: 'var(--color-danger-500)',
  },
  warning: {
    icon: AlertTriangle,
    color: 'var(--color-warning-700)',
    bg: 'var(--color-warning-50)',
    border: 'var(--color-warning-200)',
    progress: 'var(--color-warning-500)',
  },
  info: {
    icon: Info,
    color: 'var(--color-primary-700)',
    bg: 'var(--color-primary-50)',
    border: 'var(--color-primary-200)',
    progress: 'var(--color-primary-500)',
  },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const cfg = CONFIG[toast.type];
  const Icon = cfg.icon;
  const duration = toast.duration ?? 4000;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        background: 'var(--color-surface-card)',
        border: `1px solid ${cfg.border}`,
        borderLeft: `4px solid ${cfg.progress}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        minWidth: '320px',
        maxWidth: '420px',
        position: 'relative',
        overflow: 'hidden',
        animation: 'toast-in 0.25s ease',
      }}
    >
      <Icon size={20} color={cfg.color} style={{ flexShrink: 0, marginTop: '1px' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', color: cfg.color }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
            {toast.message}
          </div>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--color-text-secondary)', flexShrink: 0 }}
      >
        <X size={16} />
      </button>
      {/* Progress bar */}
      {duration > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            background: cfg.progress,
            opacity: 0.4,
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
}

// ─── Container ───────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (typeof window === 'undefined' || toasts.length === 0) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>,
    document.body
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const add = useCallback((type: ToastType, title: string, message?: string, duration = 4000) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-4), { id, type, title, message, duration }]);
    if (duration > 0) {
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    }
  }, [dismiss]);

  const value: ToastContextValue = {
    success: (title, msg) => add('success', title, msg),
    error: (title, msg) => add('error', title, msg),
    warning: (title, msg) => add('warning', title, msg),
    info: (title, msg) => add('info', title, msg),
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
