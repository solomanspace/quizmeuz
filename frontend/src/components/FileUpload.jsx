import { useState } from 'react';
import axios from 'axios';

function FileUpload({ onFileProcessed }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Iltimos, fayl tanlang');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://quizme-backend-7qyo.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onFileProcessed(response.data.questions);
      } else {
        setError(response.data.error || 'Faylni yuklashda xatolik');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server bilan bog\'lanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4 text-center">Test Faylini Yuklang</h2>
        <p className="text-gray-600 mb-6 text-center">
          .pdf, .xlsx, .docx, .txt va boshqa formatlarni qo'llab-quvvatlaydi
        </p>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? 'border-primary bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <p className="text-lg mb-2">
            Faylni bu yerga tashlang yoki
          </p>
          
          <label className="inline-block cursor-pointer">
            <span className="text-primary font-medium hover:underline">
              faylni tanlang
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.xlsx,.xls,.docx,.doc,.txt,.csv"
            />
          </label>

          {file && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Tanlangan fayl:</span> {file.name}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Yuklanmoqda...
              </span>
            ) : (
              'Davom etish'
            )}
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Fayl formati:</h3>
          <p className="text-sm text-blue-800">
            Savollar quyidagi formatda bo'lishi kerak:
          </p>
          <div className="mt-2 text-xs text-blue-700 font-mono bg-white p-2 rounded overflow-x-auto">
            savol | variant 1 | variant 2 | variant 3 | variant 4 | to'g'ri javob
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
