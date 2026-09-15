import React, { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BookOpen, Lock, ExternalLink, ChevronRight, Crown, Check, X, AlertCircle,Calendar} from "lucide-react";
import AttemptQuestionModal from './AttemptQuestionModal';
import { attemptQuestion } from '../../redux/slices/authSlice';
import { QuestionsLayout } from './LayoutFilters';
import { PaginatedQuestions } from './Pagination';
const rightAnswerMap = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };

const AnalysisModal = ({ question, isOpen, onClose }) => {
  if (!isOpen || !question) return null;

  const { attemptDetails, question: questionData } = question;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getOptionClass = (optionKey) => {
    const rightAnswerAlphabet = rightAnswerMap[questionData.rightAnswer];
    
    if (optionKey === rightAnswerAlphabet) return 'bg-green-500/10 border-green-500/50 text-green-400';
    if (optionKey === attemptDetails.attemptedOption && !attemptDetails.isCorrect) return 'bg-red-500/10 border-red-500/50 text-red-400';
    return 'bg-white/5 border-line-light text-sand-300';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto font-sans">
      <div className="bg-ink border border-line rounded-lg w-full max-w-3xl mx-4 my-12 p-8 relative shadow-2xl overflow-hidden">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-sand-400 hover:text-paper focus:outline-none z-10 bg-white/10 rounded-full p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
          <div>
            <h2 className="font-sora text-2xl font-bold text-paper mb-4">Question Analysis</h2>
            
            <div className="bg-white/5 border border-line-light p-5 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2 text-paper">Question:</h3>
              <p className="text-sand-300">{questionData.questionStatement}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-paper">Options:</h3>
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((optionKey) => (
                  <div 
                    key={optionKey}
                    className={`p-4 rounded-lg border-2 ${getOptionClass(optionKey)} flex items-center transition-all duration-200 ease-in-out`}
                  >
                    <span className="font-medium mr-3 text-lg">{optionKey}.</span>
                    <span className="flex-grow">{questionData.options[`option${optionKey}`]}</span>
                    {optionKey === rightAnswerMap[questionData.rightAnswer] && (
                      <Check className="w-6 h-6 ml-auto text-green-400" />
                    )}
                    {optionKey === attemptDetails.attemptedOption && !attemptDetails.isCorrect && (
                      <AlertCircle className="w-6 h-6 ml-auto text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-accent-yellow/10 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-paper">Your Answer:</h3>
                <p className={`font-medium text-lg ${attemptDetails.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {attemptDetails.isCorrect ? 'Correct' : 'Incorrect'} - You chose option {attemptDetails.attemptedOption}
                </p>
              </div>

              <div className="bg-accent-yellow/10 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-paper">Explanation:</h3>
                <p className="text-sand-300">{questionData.explanation}</p>
              </div>
            </div>

            <div className="mt-6 bg-white/5 border border-line-light p-4 rounded-lg flex justify-between items-center text-sm text-sand-400">
              <span>Time spent: <strong className="text-paper">{formatTime(attemptDetails.timeSpent)}</strong></span>
              <span>Difficulty: <strong className="text-paper">{questionData.difficulty}</strong></span>
              <span>Chapter: <strong className="text-paper">{questionData.chapterName}</strong></span>
            </div>
          </div>

          <div className="flex justify-between space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-sand-700 text-paper rounded-[3px] hover:bg-sand-800 focus:outline-none focus:ring-2 focus:ring-sand-500"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-brand-gradient text-charcoal font-semibold rounded-[3px] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-orange2"
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
        <div className="animate-spin h-6 w-6 border-b-2 border-accent-orange2" />
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
    return styles[difficulty?.toLowerCase()] || 'bg-sand-100 text-sand-800';
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
    const updatedAttemptDetails = {
      attemptedOption: attemptData.selectedOption,
      timeSpent: attemptData.timeSpent,
      isCorrect: attemptData.selectedOption === rightAnswerMap[attemptData.question.question.rightAnswer]
    };
  
    dispatch(attemptQuestion({
      questionId: selectedQuestion._id,
      attemptDetails: updatedAttemptDetails
    }))
  
    setSelectedQuestion(null);
  };
  

  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin h-6 w-6 border-b-2 border-accent-orange2" />
    </div>
  );


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  

  return (
    <QuestionsLayout questions={questions} onFilterChange={handleFilterChange}>
      <div className="bg-white rounded-lg">
        <div className="p-4 border-b border-sand-200 flex justify-between items-center">
          <div className="flex items-center gap-2 font-medium text-charcoal">
            <BookOpen className="w-4 h-4 text-accent-orange2" />
            Questions Bank
          </div>
          {!isSubscribed && (
            <a href="/pricing" className="text-sm font-bold text-accent-orange2 hover:underline flex items-center gap-1">
              Upgrade <Crown className="w-4 h-4" />
            </a>
          )}
        </div>


      {displayQuestions.length === 0 ? (
        <div className="flex items-center justify-center h-32 p-4">
          <BookOpen className="w-6 h-6 text-sand-400 mr-2" />
          <p className="text-sand-600 text-sm">No questions available. Check back later!</p>
        </div>
      ) : (
        <div className="divide-y divide-sand-200">
        
          <PaginatedQuestions 
          questions={displayQuestions} 
          renderQuestion={(item, index) => (
            <div 
              key={item.question._id || index} 
              className="p-4 hover:bg-sand-100 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-sand-600 mb-2">
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-accent-yellow/20 text-accent-orange2 rounded-full text-xs font-medium">
                  {index + 1}
                </div>
                <span 
                  className={`px-2 py-0.5 rounded-full font-medium ${getDifficultyBadge(item.question.difficulty)}`}
                >
                  {item.question.difficulty || 'N/A'}
                </span>
                <span>{item.question.chapterName || 'General'}</span>
                {!isSubscribed && (
                  <span className="bg-accent-yellow/20 text-accent-orange2 px-2 py-0.5 rounded-full">
                    Sample
                  </span>
                )}
                <div className="flex items-center gap-1 text-xs text-sand-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.assignedDate)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-charcoal flex-1 mr-4">
                  {truncateText(item.question.questionStatement)}
                </p>
                {item.attempted ? (
                  <button 
                    onClick={() => handleAnalysis(item)}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium text-accent-orange2 hover:bg-accent-yellow/10 rounded-md transition-colors"
                  >
                    Analysis
                    <ExternalLink className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleAttemptQuestion(item)}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium text-accent-orange2 hover:bg-accent-yellow/10 rounded-md transition-colors"
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
                    <span className="text-sand-500">
                      Time: {formatTime(item.attemptDetails.timeSpent)}
                    </span>
                  </div>
                </div>
              )}
            </div> 
          )}/>
          
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
