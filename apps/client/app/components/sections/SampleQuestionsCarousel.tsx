'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const SampleQuestionsCarousel: React.FC<{
  questions: string[];
  onQuestionClick: (question: string) => void;
}> = ({ questions, onQuestionClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  return (
    <div className="w-full flex items-center justify-center sm:hidden">
      <button onClick={handlePrev} className="p-2 text-gray-600 hover:text-gray-900">
        <ChevronLeftIcon size={24} />
      </button>

      <AnimatePresence>
        <motion.button
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          onClick={() => onQuestionClick(questions[currentIndex])}
          className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 mx-2"
        >
          {questions[currentIndex]}
        </motion.button>
      </AnimatePresence>

      <button onClick={handleNext} className="p-2 text-gray-600 hover:text-gray-900">
        <ChevronRightIcon size={24} />
      </button>
    </div>
  );
};

export default SampleQuestionsCarousel;
