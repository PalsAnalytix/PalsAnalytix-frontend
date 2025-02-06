import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

const AttemptQuestionModal = ({ 
  question, 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Start timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsTimerActive(true);
      setSelectedOption(null);
      setTimeSpent(0);
      setErrorMessage(''); // Reset error message

      const timerId = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [isOpen]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      setErrorMessage('Please select an option.');
      return;
    }

    onSubmit({
      selectedOption,
      timeSpent,
      question
    });
    onClose();
  };

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 relative shadow-xl">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Timer */}
        <div className="absolute top-4 left-4 flex items-center text-red-600 font-semibold">
          <Clock className="w-5 h-5 mr-2" />
          {formatTime(timeSpent)}
        </div>

        {/* Question Content */}
        <div className="p-6 pt-16">
          <h2 className="text-lg font-bold mb-4 text-gray-900">
            {question.question.questionStatement}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((optionKey) => {
              const optionText = question.question.options[`option${optionKey}`];
              return (
                <button
                  key={optionKey}
                  onClick={() => setSelectedOption(optionKey)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedOption === optionKey 
                      ? 'bg-blue-100 border-blue-500' 
                      : 'bg-gray-50 hover:bg-gray-100 border-transparent'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 mr-3 rounded-full border-2 ${
                      selectedOption === optionKey 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`} />
                    <span className="flex-1">{optionText}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="mt-2 text-red-600">{errorMessage}</p>
          )}

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-colors ${
              selectedOption 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttemptQuestionModal;
