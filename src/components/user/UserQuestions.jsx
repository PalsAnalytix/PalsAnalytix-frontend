import React, { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BookOpen, Lock, ExternalLink, ChevronRight, Crown, Check, X, AlertCircle,Calendar} from "lucide-react";
import AttemptQuestionModal from './AttemptQuestionModal';
import { attemptQuestion } from '../../redux/slices/authSlice';
import { QuestionsLayout } from './LayoutFilters';
const rightAnswerMap = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };

const AnalysisModal = ({ question, isOpen, onClose }) => {
  if (!isOpen || !question) return null;

  const { attemptDetails, question: questionData } = question;

  console.log(attemptDetails);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getOptionClass = (optionKey) => {
    const rightAnswerAlphabet = rightAnswerMap[questionData.rightAnswer];
    
    if (optionKey === rightAnswerAlphabet) return 'bg-green-100 border-green-500 text-green-800';
    if (optionKey === attemptDetails.attemptedOption && !attemptDetails.isCorrect) return 'bg-red-100 border-red-500 text-red-800';
    return 'bg-gray-50 border-gray-300 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl mx-4 my-12 p-8 relative shadow-2xl overflow-hidden">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none z-10 bg-gray-100 rounded-full p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Question Analysis</h2>
            
            <div className="bg-gray-50 p-5 rounded-xl mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Question:</h3>
              <p className="text-gray-700">{questionData.questionStatement}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Options:</h3>
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((optionKey) => (
                  <div 
                    key={optionKey}
                    className={`p-4 rounded-xl border-2 ${getOptionClass(optionKey)} flex items-center transition-all duration-200 ease-in-out`}
                  >
                    <span className="font-medium mr-3 text-lg">{optionKey}.</span>
                    <span className="flex-grow">{questionData.options[`option${optionKey}`]}</span>
                    {optionKey === rightAnswerMap[questionData.rightAnswer] && (
                      <Check className="w-6 h-6 ml-auto text-green-600" />
                    )}
                    {optionKey === attemptDetails.attemptedOption && !attemptDetails.isCorrect && (
                      <AlertCircle className="w-6 h-6 ml-auto text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-blue-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Your Answer:</h3>
                <p className={`font-medium text-lg ${attemptDetails.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {attemptDetails.isCorrect ? 'Correct' : 'Incorrect'} - You chose option {attemptDetails.attemptedOption}
                </p>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Explanation:</h3>
                <p className="text-gray-700">{questionData.explanation}</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-100 p-4 rounded-xl flex justify-between items-center text-sm">
              <span>Time spent: <strong>{formatTime(attemptDetails.timeSpent)}</strong></span>
              <span>Difficulty: <strong>{questionData.difficulty}</strong></span>
              <span>Chapter: <strong>{questionData.chapterName}</strong></span>
            </div>
          </div>

          <div className="flex justify-between space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserQuestions = ({ isSubscribed, questions = [], loading }) => {
  const dispatch = useDispatch();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [analysisQuestion, setAnalysisQuestion] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  
  useEffect(() => {
    setFilteredQuestions(questions);
  }, [questions]);

  const handleFilterChange = (newFilteredQuestions) => {
    setFilteredQuestions(newFilteredQuestions);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-6 w-6 border-b-2 border-blue-500" />
      </div>
    );
  }

  const displayQuestions = isSubscribed ? filteredQuestions : filteredQuestions.filter(q => q.isSampleQuestion);

  const truncateText = (text, wordCount = 10) => 
    text?.split(' ').slice(0, wordCount).join(' ') + 
    (text?.split(' ').length > wordCount ? '...' : '');

  const getDifficultyBadge = (difficulty) => {
    const styles = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return styles[difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleAttemptQuestion = (question) => {
    setSelectedQuestion(question);
  };

  const handleAnalysis = (question) => {
    setAnalysisQuestion(question);
  };
  
  const handleSubmitAnswer = (attemptData) => {
    console.log("Submitting answer");
    const updatedAttemptDetails = {
      attemptedOption: attemptData.selectedOption,
      timeSpent: attemptData.timeSpent,
      isCorrect: attemptData.selectedOption === rightAnswerMap[attemptData.question.question.rightAnswer]
    };
    console.log("Attempt details:", updatedAttemptDetails);
  
    dispatch(attemptQuestion({
      questionId: selectedQuestion._id,
      attemptDetails: updatedAttemptDetails
    }))
  
    setSelectedQuestion(null);
  };
  

  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin h-6 w-6 border-b-2 border-blue-500" />
    </div>
  );


  const formatDate = (dateString) => {
    console.log(dateString);
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  

  return (
    <QuestionsLayout questions={questions} onFilterChange={handleFilterChange}>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2 font-medium">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Questions Bank
          </div>
          {!isSubscribed && (
            <a href="/pricing" className="text-sm font-bold text-green-700 hover:underline flex items-center gap-1">
              Upgrade <Crown className="w-4 h-4" />
            </a>
          )}
        </div>


      {displayQuestions.length === 0 ? (
        <div className="flex items-center justify-center h-32 p-4">
          <BookOpen className="w-6 h-6 text-gray-400 mr-2" />
          <p className="text-gray-600 text-sm">No questions available. Check back later!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
        {filteredQuestions.map((item, index) => (
            <div 
              key={item.question._id || index} 
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                  {index + 1}
                </div>
                <span 
                  className={`px-2 py-0.5 rounded-full font-medium ${getDifficultyBadge(item.question.difficulty)}`}
                >
                  {item.question.difficulty || 'N/A'}
                </span>
                <span>{item.question.chapterName || 'General'}</span>
                {!isSubscribed && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Sample
                  </span>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.assignedDate)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900 flex-1 mr-4">
                  {truncateText(item.question.questionStatement)}
                </p>
                {item.attempted ? (
                  <button 
                    onClick={() => handleAnalysis(item)}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  >
                    Analysis
                    <ExternalLink className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleAttemptQuestion(item)}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Attempt
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              {item.attempted && (
                <div className="mt-2 text-xs flex justify-between items-center">
                  <div>
                    <span 
                      className={`font-medium mr-2 ${
                        item.attemptDetails.isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.attemptDetails.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    <span className="text-gray-500">
                      Time: {formatTime(item.attemptDetails.timeSpent)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AttemptQuestionModal
        question={selectedQuestion}
        isOpen={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        onSubmit={handleSubmitAnswer}
      />

      <AnalysisModal
        question={analysisQuestion}
        isOpen={!!analysisQuestion}
        onClose={() => setAnalysisQuestion(null)}
      />
    </div>
    </QuestionsLayout>
  );
};

export default UserQuestions;