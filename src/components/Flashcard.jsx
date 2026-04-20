import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const Flashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="h-64 w-full perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div 
          className="absolute w-full h-full backface-hidden bg-surface border border-surface-hover rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg hover:border-primary/50 transition-colors"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-4 right-4 text-text-muted">
            <RefreshCw size={16} className="opacity-50" />
          </div>
          <h3 className="text-xl font-medium text-center">{question}</h3>
          <p className="text-sm text-text-muted mt-4 absolute bottom-4">Click to reveal</p>
        </div>

        {/* Back */}
        <div 
          className="absolute w-full h-full backface-hidden bg-primary/10 border border-primary/30 rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg transform rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-lg text-center font-medium text-text-main leading-relaxed overflow-y-auto w-full h-full flex items-center justify-center">
            {answer}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;
