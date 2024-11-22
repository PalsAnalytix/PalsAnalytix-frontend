import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
} from "../redux/slices/questionsSlice";
import axios from "axios";
import EditQuestionModal from "../components/admin/EditQuestionModal";
import AddQuestionModal from "../components/admin/AddQuestionModal";
import TestModal from "../components/admin/TestModal";
import BulkUpload from "../components/admin/BulkUpload";
import { logout, clearError} from "../redux/slices/authSlice"
const BASE_URL = import.meta.env.VITE_BASE_URL; // Make sure this is correctly set up

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } =  useSelector((state) => state.auth);

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setDropdownOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-500 cursor-pointer">
            PalsAnalytix
          </h1>
        </div>
        <div className="flex items-center relative">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="bg-[#FEE154] text-black px-4 py-2 rounded mr-4"
              >
                Account
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-[#FEE154] text-black px-4 py-2 rounded mr-4"
            >
              Login/Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.questions.items);
  const status = useSelector((state) => state.questions.status);
  const error = useSelector((state) => state.questions.error);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [filter, setFilter] = useState("");
  const stats = useSelector((state) => state.questions.stats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      // navigate('/');
      return; // Prevent unnecessary data fetching
    }

    if (status === "idle") {
      dispatch(fetchQuestions());
    }
  }, [isAdmin, status, dispatch, navigate]);

  // Secondary useEffect for filtering - only runs after data is loaded
  useEffect(() => {
    if (!questions.length) return;

    if (filter === "") {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(
        questions.filter((q) => {
          let courses = Array.isArray(q.courses) ? q.courses : [q.courses];
          return courses.includes(filter);
        })
      );
    }
  }, [filter, questions]);

  // Sorting questions by most recent first
  const sortedQuestions = [...filteredQuestions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const openModal = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleDeleteQuestion = async () => {
    if (questionToDelete) {
      try {
        await dispatch(deleteQuestion(questionToDelete)).unwrap();
        setQuestionToDelete(null);
        setShowDeleteConfirmation(false);
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  const openDeleteConfirmation = (questionId) => {
    setQuestionToDelete(questionId);
    setShowDeleteConfirmation(true);
  };

  return isAdmin ? (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg sm:text-xl font-semibold">
              Total Questions
            </h3>
            <p className="text-xl sm:text-2xl">{stats.totalQuestions}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg sm:text-xl font-semibold">FRM Questions</h3>
            <p className="text-xl sm:text-2xl">{stats.frmCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg sm:text-xl font-semibold">SCR Questions</h3>
            <p className="text-xl sm:text-2xl">{stats.scrCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg sm:text-xl font-semibold">CFA Questions</h3>
            <p className="text-xl sm:text-2xl">{stats.cfaCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg sm:text-xl font-semibold">Total Users</h3>
            <p className="text-xl sm:text-2xl">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded shadow ">
            <h3 className="text-lg sm:text-xl font-semibold">Total Revenue</h3>
            <p className="text-xl sm:text-2xl">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Add Question Button */}
        <div className="flex justify-end">
          <div className="flex justify-end mb-4 mr-4">
            <button
              className="bg-blue-500 hover:bg-blue-800 text-white py-2 px-4 rounded shadow"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Question
            </button>
          </div>
          <div className="flex justify-end mb-4 mr-4">
            <button
              className="bg-blue-500 hover:bg-blue-800 text-white py-2 px-4 rounded shadow"
              onClick={() => setIsTestModalOpen(true)}
            >
              Add New Test
            </button>
          </div>

          <BulkUpload />
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter("")}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
              filter === "" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          {["SCR", "FRM", "CFA"].map((course) => (
            <button
              key={course}
              onClick={() => setFilter(course)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                filter === course ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {course}
            </button>
          ))}
        </div>

        {/* Questions List */}
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Questions List
          </h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                  Sr. No
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                  Question
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                  Course
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                  Chapter
                </th>

                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                  Tags
                </th>
                <th className="border px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedQuestions.map((question, index) => (
                <tr key={question._id}>
                  <td className="border text-center px-2 py-1 sm:px-4 sm:py-2">
                    {index + 1}
                  </td>
                  <td className="border px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                    {question.questionStatement}
                  </td>
                  <td className="border px-2 py-1 sm:px-4 sm:py-2">
                    {(() => {
                      return question.courses.map((course, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs sm:text-sm font-semibold mr-1 mb-1 sm:mr-2 sm:mb-2"
                        >
                          {course}
                        </span>
                      ));
                    })()}
                  </td>
                  <td className="border px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                    {question.chapterName}
                  </td>

                  <td className="border px-2 py-1 sm:px-4 sm:py-2">
                    {question.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block text-green-800 rounded-full px-2 py-1 text-xs sm:text-sm font-bold mr-1 mb-1 sm:mr-2 sm:mb-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="border px-2 py-1 sm:px-4 sm:py-2 bg-gray-50">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openModal(question)}
                        className="group relative p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                        aria-label="Edit"
                      >
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Edit
                        </span>
                      </button>
                      <button
                        onClick={() => openDeleteConfirmation(question._id)}
                        className="group relative p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                        aria-label="Delete"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AddQuestionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        {/* Edit Question Modal */}
        {selectedQuestion && (
          <EditQuestionModal
            isOpen={isModalOpen}
            onClose={closeModal}
            question={selectedQuestion}
            // onSave={handleSaveQuestion}
          />
        )}

        {
          <TestModal
            isOpen={isTestModalOpen}
            onClose={() => {
              setIsTestModalOpen(false);
            }}
          />
        }

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="mb-6">
                Are you sure you want to delete this question? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteQuestion}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : <>Error</>;
};

export default AdminDashboard;
