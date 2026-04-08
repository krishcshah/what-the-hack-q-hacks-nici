import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, ScanLine, CheckCircle2 } from 'lucide-react';

export default function CameraScanner({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const [phase, setPhase] = useState<'camera' | 'scanning' | 'results'>('camera');

  const handleCapture = () => {
    setPhase('scanning');
    setTimeout(() => {
      setPhase('results');
      setTimeout(() => {
        onComplete();
      }, 3000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white z-10">
        <button onClick={onCancel} className="p-2 bg-white/20 rounded-full backdrop-blur-md">
          <X size={24} />
        </button>
        <div className="font-bold tracking-widest uppercase text-sm">Fridge Scanner</div>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 'camera' && (
            <motion.div key="camera" className="absolute inset-0 flex flex-col items-center justify-end pb-12">
              <div className="w-64 h-64 border-2 border-white/30 rounded-3xl mb-12 relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-3xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-3xl"></div>
              </div>
              <button 
                onClick={handleCapture}
                className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center shadow-[0_0_0_4px_rgba(255,255,255,0.2)]"
              >
                <Camera size={32} className="text-gray-900" />
              </button>
              <p className="text-white/70 mt-4 text-sm font-medium">Point at your open fridge</p>
            </motion.div>
          )}

          {phase === 'scanning' && (
            <motion.div key="scanning" className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
              <div className="relative w-full max-w-sm h-64 bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 shadow-2xl">
                {/* Simulated photo */}
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/fridge/400/300')] bg-cover bg-center opacity-50 blur-[2px]"></div>
                
                {/* Scanning line */}
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_5px_rgba(74,222,128,0.5)]"
                  animate={{ y: [0, 256, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 border border-white/10">
                    <ScanLine className="text-green-400 animate-pulse" size={20} />
                    <span className="text-white font-medium tracking-wide">Analyzing contents...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'results' && (
            <motion.div key="results" className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 px-6">
              <div className="bg-white rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan Complete</h2>
                <p className="text-gray-600 mb-6">Found Organic Milk and Eggs in your fridge.</p>
                <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100">
                  <p className="text-sm font-bold text-gray-900 mb-2">Removing from cart:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Organic Milk 1L
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Free-range Eggs (10)
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
