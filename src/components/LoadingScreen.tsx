import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
const logoUrl = 'https://i.postimg.cc/7ZKWrN26/Whats-App-Image-2026-10-24-at-14-13-41.jpg';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Elegant entrance duration allowing appreciation of the grand emblem
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050507] overflow-hidden select-none"
        >
          {/* Deep ambient backlighting glow behind the emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.2, 0.55, 0.35], 
              scale: [0.9, 1.15, 1] 
            }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            className="absolute w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-gradient-to-tr from-[#947238]/25 via-[#C9A86C]/35 to-[#1c304a]/30 blur-[130px] pointer-events-none"
          />

          {/* Golden luminous ring effect */}
          <motion.div
            initial={{ rotate: 0, scale: 0.9, opacity: 0 }}
            animate={{ rotate: 360, scale: 1, opacity: 0.6 }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.2, ease: "easeOut" },
              opacity: { duration: 1.2 }
            }}
            className="absolute w-[340px] sm:w-[460px] md:w-[540px] h-[340px] sm:h-[460px] md:h-[540px] rounded-full border border-[#C9A86C]/25 border-dashed pointer-events-none"
          />

          {/* Outer breathing halo */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[280px] sm:w-[400px] md:w-[480px] h-[360px] sm:h-[520px] md:h-[600px] rounded-full bg-[#C9A86C]/10 blur-2xl pointer-events-none"
          />

          {/* Grand Free Logo - Sem Texto - Grande e Livre com Efeitos */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 12 }}
            animate={{ 
              scale: [0.88, 1.02, 1], 
              opacity: 1, 
              y: [12, -4, 0] 
            }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex items-center justify-center p-4 max-w-[92vw]"
          >
            {/* Soft vignette and luxury glow frame */}
            <div className="relative group">
              <img
                src={logoUrl}
                alt="Mirage Parfum Emblem"
                className="w-[280px] sm:w-[400px] md:w-[480px] lg:w-[540px] h-auto object-contain rounded-3xl drop-shadow-[0_0_55px_rgba(201,168,108,0.45)] transition-all duration-700"
                style={{
                  maskImage: 'radial-gradient(circle at center, black 65%, transparent 98%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 65%, transparent 98%)'
                }}
              />

              {/* Shimmer light sweep across the golden filigree */}
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '180%', opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E8D5B7]/30 to-transparent skew-x-12 pointer-events-none"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
