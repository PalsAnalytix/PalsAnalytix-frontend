import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { uploadQuestions } from '../../redux/slices/questionsSlice';
import { Upload, X } from 'lucide-react';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setShowModal(true);
    } else if (selectedFile) {
      alert('Please select a valid .xlsx file');
    }
    // Reset the file input
    e.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const confirmUpload = async() => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await dispatch(uploadQuestions(formData));
    }
    setShowModal(false);
    setFile(null);
  };

  return (
    <div className="flex justify-end mb-4 mr-4">
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        onClick={handleUploadClick}
        className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <Upload className="w-5 h-5 mr-2" />
        Upload .xlsx file
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirm Upload</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4">Are you sure you want to upload these questions?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Confirm Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;