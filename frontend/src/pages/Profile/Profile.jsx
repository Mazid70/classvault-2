import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import {
  FaUserGraduate,
  FaIdCard,
  FaTimes,
  FaUpload,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import useCallData from '../../customHooks/useCallData';
import Loader from '../../Components/Loader/Loader';
import { toast, Toaster } from 'sonner'; // Sonner notifications

const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING;
const imageHostingAPI = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const Profile = () => {
  const { user, refetch } = useContext(AuthContext);
  const axiosData = useCallData();

  const [editModal, setEditModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    studentId: '',
    photoFile: null,
    photoPreview: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Sync formData with user whenever modal opens
  useEffect(() => {
    if (editModal && user) {
      setFormData({
        userName: user.userName || '',
        email: user.email || '',
        studentId: user.studentId || '',
        photoFile: null,
        photoPreview: user.photoUrl || '',
      });
    }
  }, [editModal, user]);

  const handleFormChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = e => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axiosData.patch(`/users/${user._id}/password`, passwordData);
      toast.success('Password updated successfully!');
      setPassModal(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to update password.');
    }
    setLoading(false);
  };

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      let photoUrl = formData.photoPreview;

      if (formData.photoFile) {
        const uploadData = new FormData();
        uploadData.append('image', formData.photoFile);

        const res = await fetch(imageHostingAPI, {
          method: 'POST',
          body: uploadData,
        });
        const data = await res.json();
        if (data.success) {
          photoUrl = data.data.display_url;
        } else {
          throw new Error('Image upload failed');
        }
      }

      await axiosData.patch(`/users/${user._id}`, {
        userName: formData.userName,
        email: formData.email,
        photoUrl,
      });

      await refetch(); // Update user context
      toast.success('Profile updated successfully!');
      setEditModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    }
    setLoading(false);
  };

  if (!user) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#1a1a1a] relative overflow-hidden ">
      <Toaster position="top-right" />

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />

      {/* Profile Card */}
      <div
        className="relative w-full mt-10 xl:mt-0 max-w-md rounded-[32px] p-[1px] bg-gradient-to-br from-indigo-500/30 via-transparent to-purple-500/30"
        data-aos="zoom-in"
        data-aos-duration="600"
      >
        <div className="relative rounded-[32px] px-3 py-5 xl:p-8 bg-gradient-to-br from-[#232323] via-[#1c1c1c] to-[#151515] shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div className="absolute inset-0 rounded-[32px] border border-white/5 pointer-events-none" />

          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/40 to-purple-500/40 blur-md opacity-70 group-hover:opacity-100 transition" />
              <img
                src={user.photoUrl || 'https://i.pravatar.cc/150'}
                alt="profile"
                className="relative w-28 h-28 rounded-full border border-white/20 object-cover"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1a1a1a]" />
            </div>
          </div>

          {/* Name */}
          <h2 className="text-center text-white text-2xl font-semibold mt-5 tracking-wide">
            {user.userName}
          </h2>
          <p className="text-center text-indigo-400/70 text-sm mt-1">
            Student Profile
          </p>

          {/* Divider */}
          <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Info */}
          <div className="space-y-4 text-sm">
            {[
              {
                icon: <FaIdCard />,
                label: 'Student ID',
                value: user.studentId,
              },
              { icon: <MdEmail />, label: 'Email', value: user.email },
              { icon: <FaUserGraduate />, label: 'Role', value: user.role },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl px-4 py-3 border border-white/10 transition cursor-pointer"
              >
                <span className="text-indigo-400 text-lg group-hover:scale-110 transition">
                  {item.icon}
                </span>
                <div>
                  <p className="text-gray-400 text-xs">{item.label}</p>
                  <p className="text-white font-medium break-all">
                    {item.value || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              onClick={() => setEditModal(true)}
              className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-2.5 rounded-xl transition shadow-lg shadow-indigo-500/30"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setPassModal(true)}
              className="cursor-pointer bg-[#202020] hover:bg-[#262626] border border-white/10 text-white py-2.5 rounded-xl transition"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div
            className="bg-[#232323]/90 rounded-2xl p-6 w-96 relative"
            data-aos="zoom-in"
            data-aos-duration="600"
          >
            <h2 className="text-white text-lg font-semibold mb-4">
              Edit Profile
            </h2>

            {/* Photo Upload */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-4 mb-4 cursor-pointer hover:border-indigo-500 transition">
              <FaUpload className="text-3xl text-indigo-400 mb-2" />
              <span className="text-white text-sm">
                {formData.photoFile ? 'Change Photo' : 'Upload Photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              {formData.photoPreview && (
                <img
                  src={formData.photoPreview}
                  alt="preview"
                  className="mt-3 w-24 h-24 rounded-full object-cover border border-white/20"
                />
              )}
            </label>

            {/* Name */}
            <label className="block mb-2 text-gray-300 text-xs">
              Full Name
            </label>
            <input
              type="text"
              name="userName"
              placeholder="Name"
              value={formData.userName}
              onChange={handleFormChange}
              className="w-full px-3 py-2 mb-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none"
            />

            {/* Email */}
            <label className="block mb-2 text-gray-300 text-xs">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full px-3 py-2 mb-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none"
            />

            {/* Student ID */}
            <label className="block mb-2 text-gray-300 text-xs">
              Student ID (Read Only)
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              readOnly
              className="w-full px-3 py-2 mb-3 rounded-xl bg-white/20 text-gray-400 border border-white/20 focus:outline-none cursor-not-allowed"
            />

            {/* Save / Cancel */}
            <div className="flex gap-4 mt-3">
              <button
                onClick={handleProfileSave}
                disabled={loading}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl transition cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setEditModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={() => setEditModal(false)}
              className="absolute top-3 right-3 text-white text-xl cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div
            className="bg-[#232323]/90 rounded-2xl p-6 w-96 relative"
            data-aos="zoom-in"
            data-aos-duration="600"
          >
            <h2 className="text-white text-lg font-semibold mb-4">
              Change Password
            </h2>

            {['old', 'new', 'confirm'].map(type => (
              <div key={type} className="relative mb-3">
                <input
                  type={showPassword[type] ? 'text' : 'password'}
                  name={
                    type === 'old'
                      ? 'oldPassword'
                      : type === 'new'
                      ? 'newPassword'
                      : 'confirmPassword'
                  }
                  placeholder={
                    type === 'old'
                      ? 'Old Password'
                      : type === 'new'
                      ? 'New Password'
                      : 'Confirm New Password'
                  }
                  value={
                    passwordData[
                      type === 'old'
                        ? 'oldPassword'
                        : type === 'new'
                        ? 'newPassword'
                        : 'confirmPassword'
                    ]
                  }
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(prev => ({ ...prev, [type]: !prev[type] }))
                  }
                  className="absolute right-3 top-2.5 text-white"
                >
                  {showPassword[type] ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            ))}

            <div className="flex gap-4">
              <button
                onClick={handlePasswordSubmit}
                disabled={loading}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl transition cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setPassModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={() => setPassModal(false)}
              className="absolute top-3 right-3 text-white text-xl cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
