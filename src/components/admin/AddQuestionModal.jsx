import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { addQuestion } from "../../redux/slices/questionsSlice";
import axios from "axios";

const AddQuestionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [questionData, setQuestionData] = useState({
    questionStatement: "",
    questionImage: null,
    courses: [],
    chapter: "",
    options: ["", "", "", ""],
    images: [null, null, null, null],
    rightAnswer: "",
    explanation: "",
    explanationImage: null,
    difficulty: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const chapterNames = [
    "SCR - Foundations of Climate Change",
    "SCR - Sustainability",
    "SCR - Climate Change Risk",
    "SCR - Sustainability and Climate Policy, Culture, and Governance",
    "SCR - Green and Sustainable Finance: Markets and Instruments",
    "SCR - Climate Risk Measurement and Management",
    "SCR - Climate Models and Scenario Analysis",
    "SCR - Net Zero",
    "SCR - Climate and Nature Risk Assessment",
    "SCR - Transition Planning and Carbon Reporting",
    "CFA - Ethical and Professional Standards",
    "CFA - Quantitative Methods",
    "CFA - Economics",
    "CFA - Financial Statement Analysis",
    "CFA - Corporate Issuers",
    "CFA - Equity Investments",
    "CFA - Fixed Income",
    "CFA - Derivatives",
    "CFA - Alternative Assets",
    "CFA - Portfolio Management",
  ];

  const chapters = chapterNames.map((name, i) => `Chapter ${i + 1}: ${name}`);
  const coursesList = ["SCR", "FRM", "CFA"];

  const handleInputChange = (e) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCourseChange = (course) => {
    const updatedCourses = questionData.courses.includes(course)
      ? questionData.courses.filter((c) => c !== course)
      : [...questionData.courses, course];
    setQuestionData({ ...questionData, courses: updatedCourses });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[index] = value;
    setQuestionData({ ...questionData, options: updatedOptions });
  };

  const handleImageChange = (field, file) => {
    if (field === "questionImage" || field === "explanationImage") {
      setQuestionData({ ...questionData, [field]: file });
    } else {
      const updatedImages = [...questionData.images];
      updatedImages[parseInt(field)] = file;
      setQuestionData({ ...questionData, images: updatedImages });
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!questionData.tags.includes(tagInput.trim())) {
        setQuestionData({
          ...questionData,
          tags: [...questionData.tags, tagInput.trim()],
        });
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setQuestionData({
      ...questionData,
      tags: questionData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
  
    // Validate form data
    if (
      !questionData.questionStatement ||
      questionData.courses.length === 0 ||
      !questionData.chapter ||
      questionData.options.some((option) => option === "") ||
      !questionData.rightAnswer ||
      !questionData.explanation ||
      !questionData.difficulty
    ) {
      setSubmitMessage("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }
  
    const formData = {
      questionStatement: questionData.questionStatement,
      courses: questionData.courses,
      chapter: questionData.chapter,
      optionA: questionData.options[0],
      optionB: questionData.options[1],
      optionC: questionData.options[2],
      optionD: questionData.options[3],
      optionImage1: questionData.images[0],
      optionImage2: questionData.images[1],
      optionImage3: questionData.images[2],
      optionImage4: questionData.images[3],
      rightAnswer: questionData.rightAnswer,
      explanation: questionData.explanation,
      difficulty: questionData.difficulty,
      tags: JSON.stringify(questionData.tags),
      questionImage: questionData.questionImage,
      explanationImage: questionData.explanationImage,
    };
  
    // Dispatch the Redux thunk to handle the API call
    const resultAction = await dispatch(addQuestion(formData));
  
    // Handle the result of the thunk
    if (addQuestion.fulfilled.match(resultAction)) {
      setSubmitMessage("Question added successfully!");
      // Reset form
      setQuestionData({
        questionStatement: "",
        questionImage: null,
        courses: [],
        chapter: "",
        options: ["", "", "", ""],
        images: [null, null, null, null],
        rightAnswer: "",
        explanation: "",
        explanationImage: null,
        difficulty: "",
        tags: [],
      });
      setTimeout(() => {
        onClose();
      }, 500);
    } else if (addQuestion.rejected.match(resultAction)) {
      setSubmitMessage(resultAction.payload || "Error adding question. Please try again.");
    }
  
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Question"
      className="w-full sm:w-11/12 md:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Question</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Statement and Image */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-lg font-semibold">
                Question Statement
              </label>
              <textarea
                name="questionStatement"
                value={questionData.questionStatement}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
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
                {coursesList.map((course) => (
                  <button
                    key={course}
                    type="button"
                    onClick={() => handleCourseChange(course)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      questionData.courses.includes(course)
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
                value={questionData.chapter}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select Chapter
                </option>
                {chapters.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    {chapter}
                  </option>
                ))}
              </select>
            </div>

            {/* Options */}
            {["A", "B", "C", "D"].map((letter, index) => (
              <div key={letter} className="space-y-2">
                <label className="block text-gray-700 text-lg font-semibold">
                  Option {letter}
                </label>
                <input
                  type="text"
                  value={questionData.options[index]}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="file"
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
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
                value={questionData.rightAnswer}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select Correct Option
                </option>
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
                value={questionData.explanation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
              <input
                type="file"
                onChange={(e) =>
                  handleImageChange("explanationImage", e.target.files[0])
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-lg font-semibold">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={questionData.difficulty}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select Difficulty
                </option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-lg font-semibold">
                Tags
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Press Enter to add a tag"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {questionData.tags.map((tag, index) => (
                  <span
                    key={index}
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
            </div>
          </form>
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
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Question"}
          </button>
        </div>

        {/* Submit Message */}
        {submitMessage && submitMessage.type===String (
          <div
            className={`text-center py-2 ${
              submitMessage.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {submitMessage}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddQuestionModal;
