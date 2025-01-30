import React from 'react';
import { sampleQuestions } from '@/app/data';
import SampleQuestionsCarousel from './SampleQuestionsCarousel';

interface SampleQuestionsProps {
  handleSend: (question: string) => void;
}

const SampleQuestions: React.FC<SampleQuestionsProps> = ({ handleSend }) => {
  return (
    <div className="mt-4">
      {/* Desktop layout */}
      <div className="hidden sm:flex flex-wrap justify-center gap-2">
        {sampleQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleSend(question)}
            className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="sm:hidden flex justify-center">
        <SampleQuestionsCarousel questions={sampleQuestions} onQuestionClick={handleSend} />
      </div>
    </div>
  );
};

export default SampleQuestions;
