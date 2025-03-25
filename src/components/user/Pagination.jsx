import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

// Pagination component that handles page navigation
const Pagination = ({ totalQuestions, questionsPerPage, onPageChange, currentPage }) => {
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  
  // Generate array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Logic to show a limited number of page buttons (e.g., 1 ... 4 5 6 ... 10)
  const getVisiblePageNumbers = () => {
    // If 7 or fewer pages, show all
    if (totalPages <= 7) {
      return pageNumbers;
    }
    
    // Always include first and last page
    let visiblePages = [1, totalPages];
    
    // Add current page and neighbors
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis indicators
    if (startPage > 2) {
      visiblePages.push('ellipsis1');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    
    if (endPage < totalPages - 1) {
      visiblePages.push('ellipsis2');
    }
    
    // Sort the array to ensure correct order
    return visiblePages.sort((a, b) => {
      if (a === 'ellipsis1') return -1;
      if (b === 'ellipsis1') return 1;
      if (a === 'ellipsis2') return 1;
      if (b === 'ellipsis2') return -1;
      return a - b;
    });
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <div className="flex items-center justify-center space-x-1 my-6">
      {/* Previous page button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {/* Page number buttons */}
      {visiblePageNumbers.map((number, index) => {
        if (number === 'ellipsis1' || number === 'ellipsis2') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              …
            </span>
          );
        }
        
        return (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-2 rounded-md min-w-[40px] ${
              currentPage === number 
                ? 'bg-blue-600 text-white font-medium' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
            aria-label={`Page ${number}`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        );
      })}
      
      {/* Next page button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Component that implements pagination for questions
const PaginatedQuestions = ({ questions, renderQuestion }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const questionsPerPage = 25;
  
  // Calculate question indices for current page
  const lastQuestionIndex = pageNumber * questionsPerPage;
  const firstQuestionIndex = lastQuestionIndex - questionsPerPage;
  
  // Get current page questions
  const currentQuestions = questions.slice(firstQuestionIndex, lastQuestionIndex);
  
  // Handle page change
  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
    // Optional: Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Reset to first page when questions array changes
  useEffect(() => {
    setPageNumber(1);
  }, [questions]);
  
  return (
    <div>
      {/* Display number of items shown */}
      <div className="py-2 px-4 bg-gray-50 border-b text-sm text-gray-600">
        Showing {firstQuestionIndex + 1}-{Math.min(lastQuestionIndex, questions.length)} of {questions.length} questions
      </div>
      
      {/* Questions list */}
      <div className="divide-y divide-gray-100">
        {currentQuestions.length > 0 ? (
          currentQuestions.map((question, index) => (
            renderQuestion(question, firstQuestionIndex + index)
          ))
        ) : (
          <div className="flex items-center justify-center h-32 p-4">
            <p className="text-gray-600 text-sm">No questions available.</p>
          </div>
        )}
      </div>
      
      {/* Pagination controls */}
      {questions.length > questionsPerPage && (
        <Pagination
          totalQuestions={questions.length}
          questionsPerPage={questionsPerPage}
          onPageChange={handlePageChange}
          currentPage={pageNumber}
        />
      )}
    </div>
  );
};

export { PaginatedQuestions, Pagination };