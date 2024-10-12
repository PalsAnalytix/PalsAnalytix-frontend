import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchTestWithQuestions,
  answerQuestion,
  markForReview,
  submitTest,
  setCurrentQuestion,
  decrementTimer,
} from "../redux/slices/testPageSlice";
import { CheckCircle, Bookmark, Clock, AlertCircle } from "lucide-react";

const TestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  // const testPage = getState();
  // console.log(testPage);
  const {
    testDetails,
    questions,
    currentQuestionIndex,
    timeRemaining,
    loading,
    error,
  } = useSelector((state) => state.testPage);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    dispatch(fetchTestWithQuestions(id));
  }, [dispatch, id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        dispatch(decrementTimer());
      } else {
        clearInterval(timer);
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, dispatch]);

  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      setSelectedOption(questions[currentQuestionIndex].selectedAnswer);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswer = () => {
    if (selectedOption !== null && currentQuestion) {
      dispatch(
        answerQuestion({
          questionId: currentQuestion._id,
          answer: selectedOption,
        })
      );
      if (currentQuestionIndex < questions.length - 1) {
        dispatch(setCurrentQuestion(currentQuestionIndex + 1));
      }
      setSelectedOption(null);
    }
  };

  const handleReview = () => {
    if (currentQuestion) {
      dispatch(markForReview(currentQuestion._id));
    }
  };

  const handleSubmit = () => {
    dispatch(submitTest());
    navigate("/dashboard");
  };

  const handleNavigate = (index) => {
    dispatch(setCurrentQuestion(index));
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-bold text-gray-700">Loading test...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-bold text-red-600">Error: {error}</div>
      </div>
    );

  if (!questions || questions.length === 0)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-bold text-gray-700">
          No questions available.
        </div>
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-bold text-red-600">
          Error: Question not found
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side - Question and Options */}
      <div className="w-3/4 flex flex-col justify-between bg-white shadow-md rounded-lg overflow-y-auto">
        <div className="mb-4">
          <div className="flex p-3 justify-between items-center bg-slate-100 mb-6">
            <h1 className="text-xl font-bold text-gray-800 bg-slate-100">
              {testDetails?.name}
            </h1>
            <div>
            <h2 className="text-xl font-bold text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            </div>
          </div>
          <div className="p-5">
            <div className="">
          <p className="text-lg mb-6 text-gray-600">
            {currentQuestion.questionStatement} 
          </p>
          <img src={currentQuestion.questionImage} alt="questionImage" className="max-h-40 mb-2"/>
          </div>
          <div className="space-y-3">
            {["A", "B", "C", "D"].map((option) => (
              <label
                key={option}
                className={`flex items-center space-x-3 cursor-pointer p-3 rounded-md transition-colors duration-100 ${
                  selectedOption === option
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="text-md text-gray-700">
                  {currentQuestion.options[`option${option}`]}
                </span>
                {currentQuestion.options[`option${option}Image`] && (
                  <img
                    src={currentQuestion.options[`option${option}Image`]}
                    alt={`Option ${option}`}
                    className="ml-2 h-20 w-20 object-contain"
                  />
                )}
              </label>
            ))}
          </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-4 px-4 border-t border-gray-300">
          <button
            onClick={() => handleNavigate(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-500 text-white rounded-sm disabled:opacity-50 transition-colors duration-200 hover:bg-gray-600"
          >
            Previous
          </button>

          <button
            onClick={handleReview}
            className="px-6 py-2 bg-yellow-500 text-white rounded-sm transition-colors duration-200 hover:bg-yellow-600"
          >
            Mark for Review
          </button>
          <button
            onClick={handleAnswer}
            className="px-6 py-2 bg-green-500 text-white rounded-sm transition-colors duration-200 hover:bg-green-600"
          >
            Save & Next
          </button>
          <button
            onClick={() => handleNavigate(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-6 py-2 bg-gray-500 text-white rounded-sm disabled:opacity-50 transition-colors duration-200 hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>

      {/* Right side - Status Section */}
      <div className="w-1/4 bg-gray-200 p-8 flex flex-col justify-between overflow-y-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Test Progress</h3>
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-xl font-semibold text-gray-700">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-md font-semibold text-gray-700 mb-2">
            <span>Answered:</span>
            <div className="flex items-center">
              <span className="mr-2">
                {questions.filter((q) => q.status === "answered").length}
              </span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="flex items-center justify-between text-md font-semibold text-gray-700 mb-2">
            <span>Unanswered:</span>
            <div className="flex items-center">
              <span className="mr-2">
                {questions.filter((q) => q.status === "unanswered").length}
              </span>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="flex items-center justify-between text-md font-semibold text-gray-700 mb-6">
            <span>Marked for Review:</span>
            <div className="flex items-center">
              <span className="mr-2">
                {questions.filter((q) => q.status === "review").length}
              </span>
              <Bookmark className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Question Status
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => handleNavigate(index)}
                className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-full transition-colors duration-200
                  ${
                    q.status === "unanswered"
                      ? "bg-white text-gray-800 hover:bg-gray-300"
                      : q.status === "answered"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowConfirmSubmit(true)}
          className="mt-8 px-6 py-3 bg-red-500 text-white rounded-full text-lg font-bold transition-colors duration-200 hover:bg-red-600"
        >
          Submit Test
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Confirm Submission</h2>
            <p className="mb-6">
              Are you sure you want to submit the test? You cannot change your
              answers after submission.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;