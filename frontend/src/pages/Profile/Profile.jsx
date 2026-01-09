import React, { useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import { FaUserGraduate, FaIdCard } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Profile = () => {
  const { user } = useContext(AuthContext);
  console.log(user?.email)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#1a1a1a] relative overflow-hidden">
      {/* ambient background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-[32px] p-[1px]
        bg-gradient-to-br from-indigo-500/30 via-transparent to-purple-500/30"
      >
        <div
          className="
          relative rounded-[32px] p-8
          bg-gradient-to-br from-[#232323] via-[#1c1c1c] to-[#151515]
          shadow-[0_30px_80px_rgba(0,0,0,0.7)]
          backdrop-blur-xl
        "
        >
          {/* inner highlight */}
          <div className="absolute inset-0 rounded-[32px] border border-white/5 pointer-events-none" />

          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/40 to-purple-500/40 blur-md opacity-70 group-hover:opacity-100 transition" />
              <img
                src={user?.photoUrl || 'https://i.pravatar.cc/150'}
                alt="profile"
                className="relative w-28 h-28 rounded-full border border-white/20 object-cover"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1a1a1a]" />
            </div>
          </div>

          {/* Name */}
          <h2 className="text-center text-white text-2xl font-semibold mt-5 tracking-wide">
            {user?.userName || 'Student Name'}
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
                value: user?.studentId,
              },
              { icon: <MdEmail />, label: 'Email', value: user?.email },
              { icon: <FaUserGraduate />, label: 'Role', value: user?.role },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex items-center gap-3
                bg-white/5 hover:bg-white/10
                rounded-xl px-4 py-3
                border border-white/10
                transition"
              >
                <span className="text-indigo-400 text-lg group-hover:scale-110 transition">
                  {item.icon}
                </span>
                <div>
                  <p className="text-gray-400 text-xs">{item.label}</p>
                  <p className="text-white font-medium break-all ">
                    {item.value || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              className="
              bg-gradient-to-r from-indigo-500 to-purple-500
              hover:from-indigo-600 hover:to-purple-600
              text-white py-2.5 rounded-xl
              transition shadow-lg shadow-indigo-500/30
            "
            >
              Edit Profile
            </button>

            <button
              className="
              bg-[#202020] hover:bg-[#262626]
              border border-white/10
              text-white py-2.5 rounded-xl
              transition
            "
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
