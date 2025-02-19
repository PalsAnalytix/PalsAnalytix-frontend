import React, { useState, useMemo } from 'react';
import { 
  Calendar, Filter, Check, X, Clock, BookOpen, 
  Target, ListFilter
} from 'lucide-react';

const QuestionsList = ({ questions }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div 
          key={question._id} 
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-900">
                {question.question.questionStatement}
              </div>
              
              <div className="mt-2 flex items-center gap-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  question.question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  question.question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {question.question.difficulty}
                </span>
                
                <span className="text-xs text-gray-500">
                  {question.question.chapterName}
                </span>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(question.assignedDate)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {question.attempted ? (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  question.attemptDetails.isCorrect ? 
                  'bg-green-100 text-green-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {question.attemptDetails.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Not Attempted
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const QuestionsSidebar = ({ questions, onFilterChange, isMobileOpen, onMobileToggle }) => {
  const [filters, setFilters] = useState({
    timeframe: 'all',
    chapter: 'all',
    difficulty: 'all',
    status: 'all',
  });

  const chapters = useMemo(() => {
    const uniqueChapters = new Set(questions.map(q => q.question.chapterName));
    return Array.from(uniqueChapters);
  }, [questions]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    let filteredQuestions = [...questions];
    
    const today = new Date();
    const getDaysAgo = (days) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    };

    // Time filter
    switch (newFilters.timeframe) {
      case 'today':
        filteredQuestions = filteredQuestions.filter(q => 
          new Date(q.assignedDate).toDateString() === today.toDateString()
        );
        break;
      case 'last5':
        filteredQuestions = filteredQuestions.filter(q => 
          new Date(q.assignedDate) >= getDaysAgo(5)
        );
        break;
      case 'last15':
        filteredQuestions = filteredQuestions.filter(q => 
          new Date(q.assignedDate) >= getDaysAgo(15)
        );
        break;
      case 'last30':
        filteredQuestions = filteredQuestions.filter(q => 
          new Date(q.assignedDate) >= getDaysAgo(30)
        );
        break;
    }

    // Apply other filters...
    if (newFilters.chapter !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => 
        q.question.chapterName === newFilters.chapter
      );
    }

    if (newFilters.difficulty !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => 
        q.question.difficulty.toLowerCase() === newFilters.difficulty.toLowerCase()
      );
    }

    switch (newFilters.status) {
      case 'attempted':
        filteredQuestions = filteredQuestions.filter(q => q.attempted);
        break;
      case 'notAttempted':
        filteredQuestions = filteredQuestions.filter(q => !q.attempted);
        break;
      case 'correct':
        filteredQuestions = filteredQuestions.filter(q => 
          q.attempted && q.attemptDetails.isCorrect
        );
        break;
      case 'incorrect':
        filteredQuestions = filteredQuestions.filter(q => 
          q.attempted && !q.attemptDetails.isCorrect
        );
        break;
    }

    filteredQuestions.sort((a, b) => 
      new Date(b.assignedDate) - new Date(a.assignedDate)
    );

    onFilterChange(filteredQuestions);
  };

  const sidebarContent = (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-500" />
          Filters
        </h3>
        <button 
          onClick={onMobileToggle}
          className="lg:hidden p-1 hover:bg-gray-100 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Time Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Time Period</label>
          <select 
            className="w-full p-1.5 text-xs border rounded-md bg-white"
            value={filters.timeframe}
            onChange={(e) => handleFilterChange('timeframe', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="last5">Last 5 Days</option>
            <option value="last15">Last 15 Days</option>
            <option value="last30">Last 30 Days</option>
          </select>
        </div>

        {/* Chapter Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Chapter</label>
          <select 
            className="w-full p-1.5 text-xs border rounded-md bg-white"
            value={filters.chapter}
            onChange={(e) => handleFilterChange('chapter', e.target.value)}
          >
            <option value="all">All Chapters</option>
            {chapters.map(chapter => (
              <option key={chapter} value={chapter}>{chapter}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Difficulty</label>
          <select 
            className="w-full p-1.5 text-xs border rounded-md bg-white"
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select 
            className="w-full p-1.5 text-xs border rounded-md bg-white"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Questions</option>
            <option value="attempted">Attempted</option>
            <option value="notAttempted">Not Attempted</option>
            <option value="correct">Correct</option>
            <option value="incorrect">Incorrect</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-gray-600 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

const QuestionsLayout = ({ children, questions, onFilterChange }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(250px,1fr),minmax(750px,3fr)] gap-4">
      <QuestionsSidebar 
        questions={questions}
        onFilterChange={onFilterChange}
        isMobileOpen={isMobileFilterOpen}
        onMobileToggle={() => setIsMobileFilterOpen(false)}
      />
      
      <div className="relative">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden absolute -top-12 left-4 flex items-center gap-2 text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-md shadow-sm"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
        
        {children}
      </div>
    </div>
  );
};

export { QuestionsLayout, QuestionsSidebar };