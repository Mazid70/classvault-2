import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import useCallData from '../../customHooks/useCallData';
import { RiVerifiedBadgeFill } from 'react-icons/ri';

const ForgetPass = () => {
  const axiosData = useCallData();
  const [isSend, setSend] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosData.post('/users/forgot-password', {
        email: e.target.email.value,
      });
      if (res.data.success) {
        setSend(true);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to send email. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen fixed inset-0 z-50 bg-[#1a1a1a] flex justify-center items-center relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[20px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-purple-500 to-pink-400 blur-[80px] rotate-6"></div>
      <div className="absolute left-1/2 top-1/2 h-[900px] w-[20px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-pink-400 to-purple-500 blur-[80px] rotate-90"></div>

      {loading ? (
        // Loader
        <div className="flex flex-col justify-center items-center gap-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 w-[400px] max-w-[80%]">
          <div className="w-12 h-12 border-4 border-t-indigo-500 border-b-indigo-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <p className="text-white/80 text-center">Sending email...</p>
        </div>
      ) : isSend ? (
        // Success message
        <div
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 w-[400px] max-w-[80%]"
          
        >
          <h2 className="text-lg flex items-center gap-3 font-semibold text-green-400">
            <RiVerifiedBadgeFill />
            Email Sent
          </h2>
          <p className="mt-2 text-sm text-white/80">
            We’ve sent a password reset email to your registered email address.
            Please check your inbox and spam folder.
          </p>
        </div>
      ) : (
        // Form
        <form
          onSubmit={handleSend}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 w-[400px] max-w-[80%]"
          data-aos="zoom-in"
          data-aos-duration="600"
        >
          <h1 className="font-bold text-xl">Forget Password</h1>
          <div className="w-full mt-2 relative">
            <MdEmail className="absolute top-11 left-3" />
            <label>Email</label>
            <input
              required
              name="email"
              type="email"
              className="bg-white/5 mt-2 text-white pl-10 pr-4 py-2 rounded border border-white/20 focus:border-indigo-400 outline-none w-full"
              placeholder="Enter Your Email"
            />
          </div>
          <input
            type="submit"
            value="Send"
            className="mt-4 font-medium cursor-pointer transition-all hover:scale-105 rounded bg-gradient-to-r from-pink-400 via-indigo-500 to-blue-500 py-2 w-full"
          />
        </form>
      )}
    </main>
  );
};

export default ForgetPass;
