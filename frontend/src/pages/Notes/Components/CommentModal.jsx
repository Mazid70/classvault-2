import { useState, useContext } from 'react';
import { AuthContext } from '../../../Provider/AuthProvider';
import useCallData from '../../../customHooks/useCallData';
import TimeAgo from '../../../Components/TimeAgo/TimeAgo';
import { FaTimes } from 'react-icons/fa';

const CommentModal = ({ onClose, noteId, comments, refetch }) => {
  const axiosData = useCallData();
  const { user } = useContext(AuthContext);

  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  // Add comment
  const handleSubmit = async e => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      await axiosData.post(`/notes/${noteId}/comment`, { text: commentText });
      setCommentText('');
      refetch(); // refresh comments
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete comment
  const handleDelete = async commentId => {
    try {
      await axiosData.delete(`/notes/${noteId}/comment/${commentId}`);
      refetch(); // refresh comments
    } catch (err) {
      console.error(err);
    }
  };

  // Sort comments: newest first
  const sortedComments = comments
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/5 border border-white/10 rounded-2xl w-[90%] max-w-xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <FaTimes />
        </button>

        <h3 className="text-white font-semibold text-lg mb-4">Comments</h3>

        {/* Comments List */}
        <div className="max-h-80 overflow-y-auto space-y-3 mb-4">
          {sortedComments?.length > 0 ? (
            sortedComments.map(c => (
              <div key={c._id} className="flex gap-3 items-start">
                <img
                  src={c.user?.photoUrl || 'https://i.pravatar.cc/40'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-white/20"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-white font-medium text-sm">
                      {c.user?.userName}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">
                        <TimeAgo date={c.createdAt} />
                      </span>
                      {c.user?._id === user?._id && (
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="text-red-400 hover:text-red-600 text-xs cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-200 text-sm mt-1">{c.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center mt-4">
              No comments yet
            </p>
          )}
        </div>

        {/* Add Comment */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Write a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-400 hover:bg-indigo-500 text-white px-4 py-2 rounded-full transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
