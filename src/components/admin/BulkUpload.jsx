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
    <div className="flex justify-end mb-4">
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        onClick={handleUploadClick}
        className="flex items-center justify-center px-4 py-2 bg-brand-gradient text-charcoal font-semibold rounded-[3px] hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-accent-orange2 focus:ring-opacity-50"
      >
        <Upload className="w-5 h-5 mr-2" />
        Upload .xlsx file
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-ink border border-line p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-sora text-xl font-bold text-paper">Confirm Upload</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-sand-400 hover:text-paper"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4 text-sand-400">Are you sure you want to upload these questions?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-sand-700 text-paper rounded-[3px] hover:bg-sand-800 focus:outline-none focus:ring-2 focus:ring-sand-500 focus:ring-opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                className="px-4 py-2 bg-brand-gradient text-charcoal font-semibold rounded-[3px] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-orange2 focus:ring-opacity-50 transition"
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
