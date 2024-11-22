import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { createTest } from "../../redux/slices/testsSlice";
import { fetchQuestions } from "../../redux/slices/questionsSlice";

const TestModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const allQuestions = useSelector((state) => state.questions.items);
  const [testData, setTestData] = useState({
    name: "",
    questions: "",
    marks: "",
    time: "",
    free: false,
    tags: [],
    questionsList: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (e) => {
    setTestData({
      ...testData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!testData.tags.includes(tagInput.trim())) {
        setTestData({
          ...testData,
          tags: [...testData.tags, tagInput.trim()],
        });
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTestData({
      ...testData,
      tags: testData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleQuestionInputChange = (e) => {
    setQuestionInput(e.target.value);
  };

  const handleQuestionKeyDown = (e) => {
    if (e.key === "Enter" && questionInput.trim()) {
      e.preventDefault();
      if (!testData.questionsList.includes(questionInput.trim())) {
        setTestData({
          ...testData,
          questionsList: [...testData.questionsList, questionInput.trim()],
        });
        setQuestionInput("");
      }
    }
  };

  const removeQuestion = (questionToRemove) => {
    setTestData({
      ...testData,
      questionsList: testData.questionsList.filter(
        (question) => question !== questionToRemove
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    if (
      !testData.name ||
      !testData.questions ||
      !testData.marks ||
      !testData.time ||
      testData.questionsList.length === 0
    ) {
      setSubmitMessage("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    const preparedData = {
      ...testData,
      questionsList: testData.questionsList
        .map((index) => {
          const question = allQuestions[index - 1];
          return question ? question._id : null;
        })
        .filter((id) => id !== null),
      marks: parseInt(testData.marks),
      time: parseInt(testData.time),
      free: testData.free === "true",
    };

    try {
      await dispatch(createTest(preparedData)).unwrap();
      setSubmitMessage("Test created successfully!");
      setTestData({
        name: "",
        questions: "",
        marks: "",
        time: "",
        free: false,
        tags: [],
        questionsList: [],
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setSubmitMessage("Error creating test. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Test"
      className="w-full sm:w-11/12 md:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Create New Test</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Name */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-lg font-semibold">
                Test Name
              </label>
              <input
                type="text"
                name="name"
                value={testData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Number of Questions */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-lg font-semibold">
                Number of Questions
              </label>
              <input
                type="number"
                name="questions"
                value={testData.questions}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Total Marks */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-lg font-semibold">
                Total Marks
              </label>
              <input
                type="number"
                name="marks"
                value={testData.marks}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-lg font-semibold">
                Time (in minutes)
              </label>
              <input
                type="number"
                name="time"
                value={testData.time}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Free */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-lg font-semibold">
                Free
              </label>
              <select
                name="free"
                value={testData.free}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
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
                {testData.tags.map((tag, index) => (
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

            {/* Question IDs */}
            <div className="space-y-2">
              <label className="block text-gray-700 text-lg font-semibold">
                Question IDs (Add serial number of Question)
              </label>
              <input
                type="text"
                value={questionInput}
                onChange={handleQuestionInputChange}
                onKeyDown={handleQuestionKeyDown}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Press Enter to add a question ID"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {testData.questionsList.map((question, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center"
                  >
                    {question}
                    <button
                      type="button"
                      onClick={() => removeQuestion(question)}
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
            {isSubmitting ? "Creating..." : "Create Test"}
          </button>
        </div>

        {/* Submit Message */}
        {submitMessage && (
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

export default TestModal;
