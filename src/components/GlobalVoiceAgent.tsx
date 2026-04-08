import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic } from 'lucide-react';

export default function GlobalVoiceAgent({ 
  isActive, 
  onClose, 
  cartSummary,
  onAction 
}: { 
  isActive: boolean; 
  onClose: () => void;
  cartSummary: string;
  onAction: (action: string) => void;
}) {
  const [phase, setPhase] = useState<'listening' | 'processing' | 'speaking'>('listening');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (!isActive) return;
    
    setPhase('listening');
    setTranscript('');
    setReply('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      onClose();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
      
      if (event.results[0].isFinal) {
        processVoice(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error(event);
      onClose();
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [isActive]);

  const processVoice = async (text: string) => {
    setPhase('processing');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          cartSummary
        })
      });
      const data = await res.json();
      
      setPhase('speaking');
      setReply(data.reply || "Okay, I've made the requested changes.");
      
      const utterance = new SpeechSynthesisUtterance(data.reply || "Okay, I've made the requested changes.");
      utterance.onend = () => {
        setTimeout(() => {
          onClose();
          if (data.action) {
            onAction(data.action);
          }
        }, 500);
      };
      window.speechSynthesis.speak(utterance);

    } catch (e) {
      setPhase('speaking');
      setReply("Sorry, I couldn't connect to the server.");
      setTimeout(onClose, 2000);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center px-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="flex flex-col items-center"
      >
        {/* Big Circle Agent */}
        <div className="relative mb-8">
          <motion.div 
            animate={
              phase === 'listening' ? { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] } :
              phase === 'processing' ? { rotate: 360 } :
              { scale: [1, 1.05, 1] }
            }
            transition={{ 
              repeat: Infinity, 
              duration: phase === 'processing' ? 1.5 : 2,
              ease: phase === 'processing' ? "linear" : "easeInOut"
            }}
            className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50"
          />
          <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center relative shadow-2xl border-4 border-white">
            {phase === 'listening' ? (
              <Mic size={48} className="text-white" />
            ) : (
              <div className="relative w-16 h-16">
                <div className="absolute top-4 left-3 w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute top-4 right-3 w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 border-b-4 border-white rounded-b-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Text Feedback */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 max-w-sm w-full text-center shadow-xl">
          {phase === 'listening' && (
            <>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Listening...</p>
              <p className="text-xl font-medium text-gray-900 min-h-[60px]">{transcript || "Speak now..."}</p>
            </>
          )}
          {phase === 'processing' && (
            <>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Thinking...</p>
              <p className="text-xl font-medium text-gray-900 min-h-[60px]">"{transcript}"</p>
            </>
          )}
          {phase === 'speaking' && (
            <>
              <p className="text-sm text-red-500 font-bold uppercase tracking-wider mb-2">Picnic Agent</p>
              <p className="text-xl font-medium text-gray-900 min-h-[60px]">{reply}</p>
            </>
          )}
        </div>
        
        <button 
          onClick={onClose}
          className="mt-8 text-white/70 hover:text-white text-sm font-medium"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
