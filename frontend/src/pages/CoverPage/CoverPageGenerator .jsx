import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Templete from './Templete';
import { useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import NotUser from '../../Components/NotUser/NotUser';

const CoverPageGenerator = () => {
  const { user } = useContext(AuthContext)
  if (!user || user.status === 'Pending' || user.status === 'Blocked') {
    return <NotUser status={user?.status} />;
  }

  const [type, setType] = useState('Assignment');
  const [formData, setFormData] = useState({
    type: 'Assignment',
    assignment: '',
    experiment: '',
    experimentName: '',
    courseCode: '',
    courseTitle: '',
    name: '',
    id: '',
    teacher: '',
    department: '',
    date: '',
  });

  const [submittedData, setSubmittedData] = useState(null);

  // Handle type change
  const handleTypeChange = e => {
    const newType = e.target.value;
    setType(newType);
    setFormData(prev => ({
      ...prev,
      type: newType,
      assignment: newType === 'Assignment' ? prev.assignment : '',
      experiment: newType === 'Lab Report' ? prev.experiment : '',
      experimentName: newType === 'Lab Report' ? prev.experimentName : '',
    }));
  };

  // Handle input changes
  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submit
  const handleSubmit = e => {
    e.preventDefault();
    setSubmittedData({ ...formData });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex justify-center items-center relative p-4">
      {/* Decorative gradients */}
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[20px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-purple-500 to-pink-400 blur-[80px] rotate-6"></div>
      <div className="absolute left-1/2 top-1/2 h-[900px] w-[20px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-pink-400 to-purple-500  blur-[80px] rotate-90"></div>

      {/* Glassy Form */}
      <div
        className="relative w-full max-w-3xl p-8 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-lg z-10"
        data-aos="zoom-in"
        data-aos-duration="600"
      >
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          🎓 Cover Page Generator
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Type selector */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <label className="text-white font-semibold">Type:</label>
            <select
              value={type}
              onChange={handleTypeChange}
              className="w-full md:w-auto p-2 rounded-lg text-white outline-none"
            >
              <option value="Assignment">Assignment</option>
              <option value="Lab Report">Lab Report</option>
            </select>
          </div>

          {/* Flex grid for inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {type === 'Assignment' ? (
              <div>
                <label className="text-white font-semibold">
                  Assignment No:
                </label>
                <input
                  type="text"
                  name="assignment"
                  value={formData.assignment}
                  onChange={handleChange}
                  className="w-full border-b border-white/50 bg-transparent text-white py-1 px-2 outline-none placeholder-white/50"
                  placeholder="Enter assignment no."
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="text-white font-semibold">
                    Experiment No:
                  </label>
                  <input
                    type="text"
                    name="experiment"
                    value={formData.experiment}
                    onChange={handleChange}
                    className="w-full border-b border-white/50 bg-transparent text-white py-1 px-2 outline-none placeholder-white/50"
                    placeholder="Enter experiment no."
                    required
                  />
                </div>
                <div>
                  <label className="text-white font-semibold">
                    Experiment Name:
                  </label>
                  <input
                    type="text"
                    name="experimentName"
                    value={formData.experimentName}
                    onChange={handleChange}
                    className="w-full border-b border-white/50 bg-transparent text-white py-1 px-2 outline-none placeholder-white/50"
                    placeholder="Enter experiment name"
                    required
                  />
                </div>
              </>
            )}

            {/* Common fields */}
            {[
              { label: 'Course Code', name: 'courseCode' },
              { label: 'Course Title', name: 'courseTitle' },
              { label: 'Your Name', name: 'name' },
              { label: 'Your ID', name: 'id' },
              { label: 'Faculty Name', name: 'teacher' },
              { label: 'Department Of', name: 'department' },
              { label: 'Date', name: 'date', type: 'date' },
            ].map(field => (
              <div key={field.name}>
                <label className="text-white font-semibold">
                  {field.label}:
                </label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border-b border-white/50 bg-transparent text-white py-1 px-2 outline-none placeholder-white/50"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full h-10 text-xl cursor-pointer bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-lg mt-2"
          >
            Generate PDF
          </button>
        </form>

        {/* PDF DownloadLink */}
        {submittedData && (
          <div className="mt-4">
            <PDFDownloadLink
              document={<Templete data={submittedData} />}
              fileName={`${submittedData.type}_Cover_Page.pdf`}
            >
              {({ loading, url }) => (
                <a
                  href={url}
                  target="_blank"
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition mt-2"
                >
                  {loading ? 'Generating PDF...' : '⬇️ Download Cover Page'}
                </a>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverPageGenerator;
