import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useAuth();
  if (!toast) return null;

  const styles = {
    success: 'bg-white border-emerald-200 text-emerald-900 shadow-lg shadow-emerald-500/10',
    error: 'bg-white border-rose-200 text-rose-900 shadow-lg shadow-rose-500/10',
    info: 'bg-white border-indigo-200 text-indigo-900 shadow-lg shadow-indigo-500/10',
  };

  const iconStyles = {
    success: 'text-emerald-600 bg-emerald-50',
    error: 'text-rose-600 bg-rose-50',
    info: 'text-indigo-600 bg-indigo-50',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full animate-fade-in pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border ${
          styles[toast.type] || styles.info
        } transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconStyles[toast.type] || iconStyles.info}`}>
            {icons[toast.type] || <Info className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-semibold capitalize text-slate-800">
              {toast.type === 'error' ? 'Notice' : toast.type}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">{toast.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
