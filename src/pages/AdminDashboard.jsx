import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
} from "../redux/slices/questionsSlice";
import EditQuestionModal from "../components/admin/EditQuestionModal";
import AddQuestionModal from "../components/admin/AddQuestionModal";
import TestModal from "../components/admin/TestModal";
import BulkUpload from "../components/admin/BulkUpload";
import MbaEvaluationPanel from "../components/admin/MbaEvaluationPanel";
import Navbar from "../components/common/Navbar";
const BASE_URL = import.meta.env.VITE_BASE_URL; // Make sure this is correctly set up

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
  const [activeSection, setActiveSection] = useState("main");

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
    <div className="font-sans">
      <Navbar />

      <div className="min-h-screen bg-paper p-4 sm:p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveSection("main")}
            className={`px-4 py-2 rounded font-medium ${activeSection === "main" ? "bg-brand-gradient text-charcoal" : "bg-white text-sand-700 border border-sand-300"}`}
          >
            CFA / FRM / SCR
          </button>
          <button
            onClick={() => setActiveSection("mba")}
            className={`px-4 py-2 rounded font-medium ${activeSection === "mba" ? "bg-brand-gradient text-charcoal" : "bg-white text-sand-700 border border-sand-300"}`}
          >
            MBA Evaluation
          </button>
        </div>

        {activeSection === "mba" ? (
          <MbaEvaluationPanel />
        ) : (
          <>
            <div className="font-mono text-xs tracking-[.14em] uppercase text-accent-orange2 mb-1">Admin</div>
            <h2 className="font-sora text-2xl font-bold text-charcoal mb-1">CFA / FRM / SCR Question Bank</h2>
            <div className="h-1 w-16 bg-brand-gradient rounded-full mb-6" />

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg border border-sand-200">
                <h3 className="text-lg sm:text-xl font-sora font-semibold text-charcoal">
                  Total Questions
                </h3>
                <p className="text-xl sm:text-2xl text-accent-orange2 font-bold">{stats.totalQuestions}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-sand-200">
                <h3 className="text-lg sm:text-xl font-sora font-semibold text-charcoal">FRM Questions</h3>
                <p className="text-xl sm:text-2xl text-accent-orange2 font-bold">{stats.frmCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-sand-200">
                <h3 className="text-lg sm:text-xl font-sora font-semibold text-charcoal">SCR Questions</h3>
                <p className="text-xl sm:text-2xl text-accent-orange2 font-bold">{stats.scrCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-sand-200">
                <h3 className="text-lg sm:text-xl font-sora font-semibold text-charcoal">CFA Questions</h3>
                <p className="text-xl sm:text-2xl text-accent-orange2 font-bold">{stats.cfaCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-sand-200">
                <h3 className="text-lg sm:text-xl font-sora font-semibold text-charcoal">Total Users</h3>
                <p className="text-xl sm:text-2xl text-accent-orange2 font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-sand-200">
                <h3 className="text-lg sm:text-xl font-sora font-semibold text-charcoal">Total Revenue</h3>
                <p className="text-xl sm:text-2xl text-accent-orange2 font-bold">{stats.totalUsers}</p>
              </div>
            </div>

            {/* Add Question Button */}
            <div className="flex justify-end flex-wrap gap-2">
              <div className="flex justify-end mb-4">
                <button
                  className="bg-brand-gradient hover:opacity-90 text-charcoal font-semibold py-2 px-4 rounded-[3px] transition"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add New Question
                </button>
              </div>
              <div className="flex justify-end mb-4">
                <button
                  className="bg-brand-gradient hover:opacity-90 text-charcoal font-semibold py-2 px-4 rounded-[3px] transition"
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
                  filter === "" ? "bg-brand-gradient text-charcoal" : "bg-sand-200 text-sand-900"
                }`}
              >
                All
              </button>
              {["SCR", "FRM", "CFA"].map((course) => (
                <button
                  key={course}
                  onClick={() => setFilter(course)}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                    filter === course ? "bg-brand-gradient text-charcoal" : "bg-sand-200 text-sand-900"
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="bg-white p-4 rounded-lg border border-sand-200 overflow-x-auto">
              <h2 className="font-sora text-lg sm:text-xl font-semibold text-charcoal mb-4">
                Questions List
              </h2>
              <table className="min-w-full bg-white border border-sand-200">
                <thead>
                  <tr className="bg-sand-100">
                    <th className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                      Sr. No
                    </th>
                    <th className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                      Question
                    </th>
                    <th className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                      Course
                    </th>
                    <th className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                      Chapter
                    </th>

                    <th className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                      Tags
                    </th>
                    <th className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedQuestions.map((question, index) => (
                    <tr key={question._id}>
                      <td className="border border-sand-200 text-center px-2 py-1 sm:px-4 sm:py-2">
                        {index + 1}
                      </td>
                      <td className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base text-sand-900">
                        {question.questionStatement}
                      </td>
                      <td className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2">
                        {(() => {
                          return question.courses.map((course, index) => (
                            <span
                              key={index}
                              className="inline-block bg-accent-yellow/20 text-accent-orange2 rounded-full px-2 py-1 text-xs sm:text-sm font-semibold mr-1 mb-1 sm:mr-2 sm:mb-2"
                            >
                              {course}
                            </span>
                          ));
                        })()}
                      </td>
                      <td className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base text-sand-900">
                        {question.chapterName}
                      </td>

                      <td className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2">
                        {question.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block text-green-700 rounded-full px-2 py-1 text-xs sm:text-sm font-bold mr-1 mb-1 sm:mr-2 sm:mb-2"
                          >
                            {tag}
                          </span>
                        ))}
                      </td>
                      <td className="border border-sand-200 px-2 py-1 sm:px-4 sm:py-2 bg-sand-100">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => openModal(question)}
                            className="group relative p-2 rounded-full hover:bg-sand-200 transition-colors duration-200"
                            aria-label="Edit"
                          >
                            <svg
                              className="w-5 h-5 text-sand-700"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-charcoal text-paper text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Edit
                            </span>
                          </button>
                          <button
                            onClick={() => openDeleteConfirmation(question._id)}
                            className="group relative p-2 rounded-full hover:bg-sand-200 transition-colors duration-200"
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
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-charcoal text-paper text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                <div className="bg-ink border border-line p-6 rounded-lg shadow-xl">
                  <h3 className="font-sora text-lg font-semibold text-paper mb-4">Confirm Deletion</h3>
                  <p className="mb-6 text-sand-400">
                    Are you sure you want to delete this question? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowDeleteConfirmation(false)}
                      className="px-4 py-2 bg-sand-700 text-paper rounded hover:bg-sand-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteQuestion}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  ) : <>Error</>;
};

export default AdminDashboard;
