import React, { useContext, useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Templete from './Templete';
import { AuthContext } from '../../Provider/AuthProvider';
import NotUser from '../../Components/NotUser/NotUser';

const CoverPageGenerator = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.status === 'Pending' || user.status === 'Blocked') {
    return <NotUser status={user?.status} />;
  }

  const [type, setType] = useState('Assignment');
  const [submittedData, setSubmittedData] = useState(null);
  const [showGenerate, setShowGenerate] = useState(true);

  const initialFormState = {
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
  };

  const [formData, setFormData] = useState(initialFormState);

  /* ===== DEFAULT VALUE FROM USER ===== */
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.userName || '',
        id: user.studentId || '',
        department: user.department || '',
        date: new Date().toISOString().split('T')[0],
      }));
    }
  }, [user]);

  /* ===== TYPE CHANGE ===== */
  const handleTypeChange = e => {
    const newType = e.target.value;
    setType(newType);
    setFormData(prev => ({
      ...prev,
      type: newType,
      assignment: '',
      experiment: '',
      experimentName: '',
    }));
  };

  /* ===== INPUT CHANGE ===== */
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = e => {
    e.preventDefault();

    setSubmittedData({ ...formData });
    setShowGenerate(false);

    // reset form but keep user defaults
    setFormData(prev => ({
      ...initialFormState,
      name: prev.name,
      id: prev.id,
      department: prev.department,
      date: prev.date,
      type,
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex justify-center items-center p-4 overflow-hidden relative pb-20 md:pb-0">
      {/* Decorative gradients */}
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[20px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-purple-500 to-pink-400 blur-[80px] rotate-6" />
      <div className="absolute left-1/2 top-1/2 h-[900px] w-[20px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-pink-400 to-purple-500 blur-[80px] rotate-90" />

      {/* Form */}
      <div
        className="relative w-full max-w-3xl p-8 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-lg z-10 mt-20 xl:mt-0"
        data-aos="zoom-in"
      >
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          🎓 Cover Page Generator
        </h1>

        {showGenerate && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Type */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <label className="text-white font-semibold">Type:</label>
              <select
                value={type}
                onChange={handleTypeChange}
                className="bg-[#313131] p-2 rounded-lg text-white outline-none"
              >
                <option value="Assignment">Assignment</option>
                <option value="Lab Report">Lab Report</option>
              </select>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type === 'Assignment' ? (
                <Input
                  label="Assignment No"
                  name="assignment"
                  value={formData.assignment}
                  onChange={handleChange}
                  required
                />
              ) : (
                <>
                  <Input
                    label="Experiment No"
                    name="experiment"
                    value={formData.experiment}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Experiment Name"
                    name="experimentName"
                    value={formData.experimentName}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              {[
                { label: 'Course Code', name: 'courseCode' },
                { label: 'Course Title', name: 'courseTitle' },
                { label: 'Your Name', name: 'name' },
                { label: 'Your ID', name: 'id' },
                { label: 'Faculty Name', name: 'teacher' },
                { label: 'Department Of', name: 'department' },
                { label: 'Date', name: 'date', type: 'date' },
              ].map(field => (
                <Input
                  key={field.name}
                  {...field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full h-10 text-xl cursor-pointer bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-lg mt-2"
            >
              Generate PDF
            </button>
          </form>
        )}

        {/* Download */}
        {submittedData && (
          <div className="mt-6">
            <PDFDownloadLink
              document={<Templete data={submittedData} />}
              fileName={`${submittedData.type}_Cover_Page.pdf`}
            >
              {({ loading, url }) => (
                <a
                  href={url}
                  target="_blank"
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition"
                >
                  {loading ? 'Generating PDF...' : '⬇️ Download Cover Page'}
                </a>
              )}
            </PDFDownloadLink>

            <button
              onClick={() => {
                setSubmittedData(null);
                setShowGenerate(true);
              }}
              className="mt-3 w-full text-white text-sm underline cursor-pointer"
            >
              Generate Another Cover Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverPageGenerator;

/* ===== SMALL INPUT COMPONENT ===== */
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-white font-semibold">{label}:</label>
    <input
      {...props}
      className="w-full border-b border-white/50 bg-transparent text-white py-1 px-2 outline-none placeholder-white/50"
      placeholder={`Enter ${label}`}
    />
  </div>
);
