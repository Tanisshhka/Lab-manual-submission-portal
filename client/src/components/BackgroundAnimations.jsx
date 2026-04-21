import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-white">
      
      {/* Ultra Bright High-Energy Blobs for Light Mode */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.9, 0.6],
          x: [0, 80, 0],
          y: [0, -40, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 blur-[100px] mix-blend-multiply opacity-70"
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.9, 0.6],
          x: [0, -80, 0],
          y: [0, 80, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-cyan-300 to-blue-500 blur-[120px] mix-blend-multiply opacity-70"
      />

      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
          x: [0, 120, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[15%] right-[25%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 blur-[110px] mix-blend-multiply opacity-60"
      />

      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.5, 0.8, 0.5],
          x: [0, -100, 0],
          y: [0, -60, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[20%] left-[15%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-emerald-300 to-teal-400 blur-[120px] mix-blend-multiply opacity-60"
      />

      {/* Bright Glass Overlay to soften the mix-blend effect slightly and keep text readable */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[50px] z-0"></div>
    </div>
  );
};

export default BackgroundAnimations;
