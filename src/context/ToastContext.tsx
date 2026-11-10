import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Toast, ToastType } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  Satellite,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastOptions {
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
  toast: {
    (title: string, options?: ToastOptions & { type?: ToastType }): string;
    success: (title: string, options?: ToastOptions | string) => string;
    info: (title: string, options?: ToastOptions | string) => string;
    warning: (title: string, options?: ToastOptions | string) => string;
    error: (title: string, options?: ToastOptions | string) => string;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (newToast: Omit<Toast, 'id' | 'timestamp'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const duration = newToast.duration ?? 4500;
      const toastItem: Toast = {
        ...newToast,
        id,
        duration,
        timestamp: Date.now(),
      };

      setToasts((prev) => [toastItem, ...prev.slice(0, 4)]); // Keep max 5 active toasts

      return id;
    },
    []
  );

  // Helper convenience methods
  const normalizeOptions = (opts?: ToastOptions | string): ToastOptions => {
    if (typeof opts === 'string') {
      return { message: opts };
    }
    return opts || {};
  };

  const toastBase = useCallback(
    (title: string, options?: ToastOptions & { type?: ToastType }) => {
      const { type = 'info', message, duration, action } = options || {};
      return addToast({ title, type, message, duration, action });
    },
    [addToast]
  );

  const toastHelpers = Object.assign(toastBase, {
    success: (title: string, options?: ToastOptions | string) => {
      const opts = normalizeOptions(options);
      return addToast({ title, type: 'success', ...opts });
    },
    info: (title: string, options?: ToastOptions | string) => {
      const opts = normalizeOptions(options);
      return addToast({ title, type: 'info', ...opts });
    },
    warning: (title: string, options?: ToastOptions | string) => {
      const opts = normalizeOptions(options);
      return addToast({ title, type: 'warning', ...opts });
    },
    error: (title: string, options?: ToastOptions | string) => {
      const opts = normalizeOptions(options);
      return addToast({ title, type: 'error', ...opts });
    },
  });

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        dismissToast,
        clearToasts,
        toast: toastHelpers,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <aside
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-3 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </aside>
  );
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration ?? 4500;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const remainingTimeRef = useRef(duration);
  const startTimeRef = useRef(Date.now());

  React.useEffect(() => {
    if (duration <= 0) return;

    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onDismiss(toast.id);
      }, remainingTimeRef.current);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toast.id, duration, isPaused, onDismiss]);

  const getTheme = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-[#6EE7B7]" />,
          border: 'border-[#10B981]/50 hover:border-[#10B981]/80',
          bg: 'bg-gradient-to-r from-[#0d2a1f]/95 to-[#0b2219]/95',
          glow: 'shadow-[0_4px_20px_rgba(16,185,129,0.15)]',
          badge: 'bg-[#10B981]/20 text-[#6EE7B7] border-[#10B981]/40',
          progress: 'bg-[#10B981]',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-[#FBBF24]" />,
          border: 'border-[#F59E0B]/50 hover:border-[#F59E0B]/80',
          bg: 'bg-gradient-to-r from-[#291f0d]/95 to-[#1c1407]/95',
          glow: 'shadow-[0_4px_20px_rgba(245,158,11,0.15)]',
          badge: 'bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/40',
          progress: 'bg-[#F59E0B]',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-[#F87171]" />,
          border: 'border-[#EF4444]/50 hover:border-[#EF4444]/80',
          bg: 'bg-gradient-to-r from-[#2a0e12]/95 to-[#1c080b]/95',
          glow: 'shadow-[0_4px_20px_rgba(239,68,68,0.15)]',
          badge: 'bg-[#EF4444]/20 text-[#F87171] border-[#EF4444]/40',
          progress: 'bg-[#EF4444]',
        };
      case 'info':
      default:
        return {
          icon: <Satellite className="w-5 h-5 text-[#74BDE0]" />,
          border: 'border-[#38BDF8]/40 hover:border-[#38BDF8]/70',
          bg: 'bg-gradient-to-r from-[#0d242d]/95 to-[#091b22]/95',
          glow: 'shadow-[0_4px_20px_rgba(56,189,248,0.15)]',
          badge: 'bg-[#38BDF8]/20 text-[#74BDE0] border-[#38BDF8]/40',
          progress: 'bg-[#38BDF8]',
        };
    }
  };

  const theme = getTheme();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-xl ${theme.bg} ${theme.border} ${theme.glow} text-white shadow-xl transition-all duration-200`}
      role="status"
    >
      <div className="p-4 sm:p-4.5 flex items-start gap-3.5">
        {/* Icon Container */}
        <div className="shrink-0 mt-0.5 p-2 rounded-xl bg-black/30 border border-white/10 shadow-inner">
          {theme.icon}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold tracking-tight text-white font-serif-display leading-snug">
              {toast.title}
            </h4>
            <span className="text-[10px] font-mono text-white/40 uppercase shrink-0">
              {toast.type}
            </span>
          </div>

          {toast.message && (
            <p className="text-xs text-white/80 leading-relaxed break-words font-normal">
              {toast.message}
            </p>
          )}

          {/* Action Button if provided */}
          {toast.action && (
            <div className="pt-2">
              <button
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{toast.action.label}</span>
                <Sparkles size={12} className="text-[#A8C3A0]" />
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X size={15} />
        </button>
      </div>

      {/* Countdown Progress Bar (animated smoothly) */}
      {duration > 0 && (
        <div className="h-1 w-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: isPaused ? undefined : '0%' }}
            transition={{
              duration: duration / 1000,
              ease: 'linear',
            }}
            className={`h-full ${theme.progress} opacity-75`}
          />
        </div>
      )}
    </motion.div>
  );
};
