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
      className="w-full sm:w-11/12 md:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto bg-ink border border-line rounded-lg shadow-xl overflow-hidden font-sans"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line">
          <h2 className="font-sora text-2xl font-bold text-paper">Edit Question</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
          {/* Question Statement and Image */}
          <div className="space-y-2">
            <label className="block text-sand-300 text-lg font-semibold">
              Question Statement
            </label>
            <textarea
              name="questionStatement"
              value={editedQuestion.questionStatement}
              onChange={handleInputChange}
              className="w-full p-3 bg-transparent border border-line-light rounded-lg text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
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
              className="block w-full text-sm text-sand-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-yellow/20 file:text-accent-orange2 hover:file:bg-accent-yellow/30"
              accept="image/*"
            />
          </div>

          {/* Courses */}
          <div className="space-y-2">
            <label className="block text-sand-300 text-lg font-semibold">
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
                      ? "bg-brand-gradient text-charcoal"
                      : "bg-white/10 text-sand-300 hover:bg-white/20"
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter */}
          <div className="space-y-2">
            <label className="block text-sand-300 text-lg font-semibold">
              Select Chapter
            </label>
            <select
              name="chapter"
              value={editedQuestion.chapterName}
              onChange={handleInputChange}
              className="w-full p-3 bg-transparent border border-line-light rounded-lg text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
            >
              {chapters.map((chapter) => (
                <option key={chapter} value={chapter} className="text-charcoal">
                  {chapter}
                </option>
              ))}
            </select>
          </div>

          {/* Options */}
          {["A", "B", "C", "D"].map((letter) => (
            <div key={letter} className="space-y-2">
              <label className="block text-sand-300 text-lg font-semibold">
                Option {letter}
              </label>
              <input
                type="text"
                name={`option${letter}`}
                value={editedQuestion.options[`option${letter}`] || ""}
                onChange={(e) => handleOptionChange(letter, e.target.value)}
                className="w-full p-3 bg-transparent border border-line-light rounded-lg text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
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
                className="block w-full text-sm text-sand-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-yellow/20 file:text-accent-orange2 hover:file:bg-accent-yellow/30"
                accept="image/*"
              />
            </div>
          ))}

          {/* Right Answer */}
          <div className="space-y-2">
            <label className="block text-sand-300 text-lg font-semibold">
              Right Answer
            </label>
            <select
              name="rightAnswer"
              value={editedQuestion.rightAnswer}
              onChange={handleInputChange}
              className="w-full p-3 bg-transparent border border-line-light rounded-lg text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num} className="text-charcoal">
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <label className="block text-sand-300 text-lg font-semibold">
              Explanation
            </label>
            <textarea
              name="explanation"
              value={editedQuestion.explanation}
              onChange={handleInputChange}
              className="w-full p-3 bg-transparent border border-line-light rounded-lg text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
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
              className="block w-full text-sm text-sand-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-yellow/20 file:text-accent-orange2 hover:file:bg-accent-yellow/30"
              accept="image/*"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sand-300 text-lg font-semibold">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedQuestion.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-accent-yellow/20 text-accent-orange2 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-red-400 hover:text-red-300"
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
              className="w-full p-3 bg-transparent border border-line-light rounded-lg text-paper placeholder:text-sand-600 focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-line flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sand-700 text-paper rounded-[3px] hover:bg-sand-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-brand-gradient text-charcoal font-semibold rounded-[3px] hover:opacity-90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditQuestionModal;
