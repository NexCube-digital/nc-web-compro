import React from 'react';
import { usePerformanceMonitor } from '../hooks/useFrameOptimization';

interface PerformanceMonitorProps {
  visible?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  visible = false 
}) => {
  const { fps, memory, frameTime } = usePerformanceMonitor();

  if (!visible) return null;

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 backdrop-blur-xl bg-slate-900/90 text-white rounded-2xl p-4 shadow-2xl border border-white/10 font-mono text-sm">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">FPS:</span>
          <span className={`font-bold ${getFpsColor(fps)}`}>{fps}</span>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-4 rounded-full transition-colors ${
                  i < fps / 6 ? 'bg-green-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">Frame Time:</span>
          <span className="font-bold text-blue-400">{frameTime.toFixed(2)}ms</span>
        </div>

        {memory > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Memory:</span>
            <span className="font-bold text-purple-400">{memory}MB</span>
          </div>
        )}

        <div className="pt-2 border-t border-white/10 text-xs text-slate-500">
          Press Ctrl+Shift+P to toggle
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
