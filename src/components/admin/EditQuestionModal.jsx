import React, { useState, useEffect } from "react";
import Modal from "react-modal";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import {updateQuestion} from "../../redux/slices/questionsSlice";
import { useDispatch, useSelector } from "react-redux";

const EditQuestionModal = ({ isOpen, onClose, question, onSave }) => {
  const dispatch = useDispatch();
  const [editedQuestion, setEditedQuestion] = useState({ ...question });
  const [tagInput, setTagInput] = useState("");

  const chapters = Array.from({ length: 40 }, (_, i) => `Chapter ${i + 1}`);
  const courses = ["SCR", "FRM", "CFA"];

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleInputChange = (e) => {
    setEditedQuestion({ ...editedQuestion, [e.target.name]: e.target.value });
  };

  const handleCourseChange = (course) => {
    const updatedCourses = editedQuestion.courses.includes(course)
      ? editedQuestion.courses.filter((c) => c !== course)
      : [...editedQuestion.courses, course];
    setEditedQuestion({ ...editedQuestion, courses: updatedCourses });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: updatedOptions });
  };

  const handleImageChange = (field, file) => {
    setEditedQuestion({ ...editedQuestion, [field]: file });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!editedQuestion.tags.includes(tagInput.trim())) {
        setEditedQuestion({
          ...editedQuestion,
          tags: [...editedQuestion.tags, tagInput.trim()],
        });
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setEditedQuestion({
      ...editedQuestion,
      tags: editedQuestion.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(
        updateQuestion({
          id: editedQuestion._id,
          updatedQuestion: editedQuestion,
        })
      ).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Question"
      className="w-full sm:w-11/12 md:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Edit Question</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
          {/* Question Statement and Image */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-lg font-semibold">
              Question Statement
            </label>
            <textarea
              name="questionStatement"
              value={editedQuestion.questionStatement}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            />
            {editedQuestion.questionImage && (
              <img
                src={`${editedQuestion.questionImage}`}
                alt="Question"
                className="max-h-40 object-contain"
              />
            )}
            <input
              type="file"
              onChange={(e) =>
                handleImageChange("questionImage", e.target.files[0])
              }
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
            />
          </div>

          {/* Courses */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-lg font-semibold">
              Select Courses
            </label>
            <div className="flex flex-wrap gap-2">
              {courses.map((course) => (
                <button
                  key={course}
                  type="button"
                  onClick={() => handleCourseChange(course)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    editedQuestion.courses.includes(course)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-lg font-semibold">
              Select Chapter
            </label>
            <select
              name="chapter"
              value={editedQuestion.chapterName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {chapters.map((chapter) => (
                <option key={chapter} value={chapter}>
                  {chapter}
                </option>
              ))}
            </select>
          </div>

          {/* Options */}
          {["A", "B", "C", "D"].map((letter) => (
            <div key={letter} className="space-y-2">
              <label className="block text-gray-700 text-lg font-semibold">
                Option {letter}
              </label>
              <input
                type="text"
                name={`option${letter}`}
                value={editedQuestion.options[`option${letter}`] || ""}
                onChange={(e) => handleOptionChange(letter, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {editedQuestion.options[`option${letter}Image`] && (
                <img
                  src={`${
                    editedQuestion.options[`option${letter}Image`]
                  }`}
                  alt={`Option ${letter}`}
                  className="max-h-40 object-contain"
                />
              )}
              <input
                type="file"
                onChange={(e) =>
                  handleImageChange(`option${letter}Image`, e.target.files[0])
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
              />
            </div>
          ))}

          {/* Right Answer */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-lg font-semibold">
              Right Answer
            </label>
            <select
              name="rightAnswer"
              value={editedQuestion.rightAnswer}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-lg font-semibold">
              Explanation
            </label>
            <textarea
              name="explanation"
              value={editedQuestion.explanation}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            />
            {editedQuestion.explanationImage && (
              <img
                src={`${editedQuestion.explanationImage}`}
                alt="Explanation"
                className="max-h-40 object-contain"
              />
            )}
            <input
              type="file"
              onChange={(e) =>
                handleImageChange("explanationImage", e.target.files[0])
              }
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-lg font-semibold">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedQuestion.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag and press Enter"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditQuestionModal;
