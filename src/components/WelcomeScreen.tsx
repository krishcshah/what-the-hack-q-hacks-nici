import { motion } from 'motion/react';

export default function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#f4a3b4] to-[#fdfdfd] cursor-pointer"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.y < -50 || info.offset.y > 50) {
          onComplete();
        }
      }}
      onClick={onComplete}
    >
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-28 h-28 bg-[#c00020] rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="22" r="4.5" fill="white"/>
            <circle cx="44" cy="22" r="4.5" fill="white"/>
            <path d="M16 34 C 16 54, 48 54, 48 34" stroke="white" strokeWidth="8" strokeLinecap="round"/>
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold text-[#4a151b] mb-2 tracking-tight">
          Hi, I'm <span className="text-[#c00020]">Nici</span>
        </h1>
        <p className="text-2xl text-[#4a151b] font-medium">I shop for you</p>
      </div>
      
      <div className="pb-16 text-sm font-semibold tracking-widest text-[#4a151b]">
        SWIPE TO GET STARTED
      </div>
    </motion.div>
  );
}
