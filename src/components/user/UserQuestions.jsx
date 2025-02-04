import React from 'react';
import { 
  BookOpen, Calendar, Lock, ExternalLink, ChevronRight, Sparkles, Crown
} from "lucide-react";

const UserQuestions = ({ isSubscribed, questions = [], loading }) => {
  const displayQuestions = isSubscribed ? questions : questions.filter(q => q.isSampleQuestion);

  const truncateText = (text, wordCount = 10) => text?.split(' ').slice(0, wordCount).join(' ') + (text?.split(' ').length > wordCount ? '...' : '');

  const getDifficultyBadge = (difficulty) => {
    const styles = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return styles[difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return 'Date unavailable';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-32"><div className="animate-spin h-6 w-6 border-b-2 border-blue-500" /></div>;

  return (
    <div className="space-y-2">
      {!isSubscribed && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-50 p-2.5 rounded-lg flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-50" />
            <span className="text-sm text-blue-1000 font-semibold">Try {displayQuestions.length} Free Questions</span>
          </div>
          <a href="/pricing" className="text-sm font-bold text-green-700 hover:underline flex items-center gap-1">
            Upgrade <Crown className="w-4 h-4" />
          </a>
        </div>
      )}

      {displayQuestions.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-white rounded-lg shadow-sm p-4">
          <BookOpen className="w-6 h-6 text-gray-400 mr-2" />
          <p className="text-gray-600 text-sm">No questions available. Check back later!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
          {displayQuestions.map((item, index) => (
            <div key={item.question._id || index} className="p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1.5">
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                  {index + 1}
                </div>
                <span className={`px-2 py-0.5 rounded-full font-medium ${getDifficultyBadge(item.question.difficulty)}`}>
                  {item.question.difficulty || 'N/A'}
                </span>
                <span>{item.question.chapterName || 'General'}</span>
                {!isSubscribed && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Sample</span>}
                <span className="ml-auto flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(item.question.assignedDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900 flex-1 mr-4">{truncateText(item.question.questionStatement)}</p>
                <button className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  Attempt
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserQuestions;