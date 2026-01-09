import { FaRegHeart, FaHeart, FaRegCommentDots } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { useState } from 'react';
import CommentModal from './CommentModal';
import TimeAgo from '../../../Components/TimeAgo/TimeAgo';
import useCallData from '../../../customHooks/useCallData';
import { useContext } from 'react';
import { AuthContext } from '../../../Provider/AuthProvider';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();
const MaterialCard = ({ note, refetch }) => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const axiosData = useCallData();
  const handleLike = async _id => {
    try {
      await axiosData.patch(`/notes/${note._id}/react`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-indigo-400/60 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all"
        data-aos="zoom-in"
        data-aos-duration="600"
      >
        {/* Title */}
        <div className="flex gap-3">
          <HiOutlineDocumentText className="text-indigo-400 text-2xl mt-1" />
          <div>
            <h3 className="text-white font-semibold leading-snug">
              {note?.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Subject: {note?.subject}
            </p>
          </div>
        </div>

        {/* Uploader */}
        <div className="flex items-center gap-3 mt-4">
          <img
            src={note?.user?.photoUrl}
            className="w-9 h-9 rounded-full border border-white/20"
          />
          <div className="text-xs">
            <p className="text-gray-200 font-medium">{note?.user?.userName}</p>
            <p className="text-gray-500">ID: {note?.user?.studentId}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-5 text-xs text-gray-400">
          <span>
            <TimeAgo date={note?.createdAt} />
          </span>

          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => handleLike(note._id)}
              className="flex items-center gap-1 hover:text-red-400 transition"
            >
              {note?.reacts?.includes(user?.studentId) ? (
                <FaHeart className="text-red-500 cursor-pointer" />
              ) : (
                <FaRegHeart className="cursor-pointer" />
              )}
              {note?.reacts.length}
            </button>

            <button
              onClick={() => setOpen(true)}
              className="flex items-center cursor-pointer gap-1 hover:text-indigo-400 transition"
            >
              <FaRegCommentDots />
              {note?.comments?.length || 0}
            </button>

            <a
              href={note?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              View
            </a>
          </div>
        </div>
      </div>

      {open && (
        <CommentModal
          onClose={() => setOpen(false)}
          comments={note.comments}
          noteId={note._id}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default MaterialCard;
