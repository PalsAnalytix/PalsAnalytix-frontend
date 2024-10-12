import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Phone, BookOpen, GraduationCap } from 'lucide-react';
import { updateUserWhatsAppDetails } from '../redux/slices/userSlice';

const WhatsAppModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [phoneNo, setPhoneNo] = useState('');
  const [currentChapter, setCurrentChapter] = useState('');
  const [currentCourse, setCurrentCourse] = useState('');

  const chapters = ['Chapter 1', 'Chapter 2', 'Chapter 3']; // Example chapters
  const courses = ['CFA', 'FRM', 'SCR']; // Example courses

  const handleSubmit = () => {
    dispatch(updateUserWhatsAppDetails({ phoneNo, currentChapterForWhatsapp: currentChapter, currentCourseForWhatsapp: currentCourse }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update WhatsApp Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Phone size={20} className="text-gray-500" />
            <input
              type="tel"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              placeholder="Phone Number"
              className="flex-1 p-2 border rounded-md"
            />
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen size={20} className="text-gray-500" />
            <select
              value={currentChapter}
              onChange={(e) => setCurrentChapter(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            >
              <option value="">Select a chapter</option>
              {chapters.map((chapter) => (
                <option key={chapter} value={chapter}>{chapter}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <GraduationCap size={20} className="text-gray-500" />
            <select
              value={currentCourse}
              onChange={(e) => setCurrentCourse(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;