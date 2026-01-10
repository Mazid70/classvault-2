import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaTrash, FaCheck, FaBan } from 'react-icons/fa';
import { MdSearch } from 'react-icons/md';
import useCallData from '../../../customHooks/useCallData';
import Loader from '../../../Components/Loader/Loader';
import Pagination from '../../../Components/Pagination/Pagination';
import { toast } from 'sonner'; // 1️⃣ import sonner

// Status and role colors
const statusColors = {
  Pending: 'bg-yellow-500',
  Accepted: 'bg-green-500',
  Blocked: 'bg-red-500',
};

const roleColors = {
  admin: 'bg-purple-500',
  cr: 'bg-yellow-500',
  student: 'bg-indigo-500',
};

const User = () => {
  const axiosData = useCallData();

  // Search & Pagination
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [modalUser, setModalUser] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockModal, setBlockModal] = useState(false);

  // Search handlers
  const handleSearch = value => {
    setSearch(value.trim());
    setCurrentPage(1); // reset to first page on search
  };
  const handleInputChange = e => setInput(e.target.value);
  const handleReset = () => {
    setInput('');
    handleSearch('');
  };

  // Fetch users with pagination
  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['users', search, currentPage],
    queryFn: async () => {
      const res = await axiosData.get(
        `/users?search=${search}&page=${currentPage}&limit=${itemsPerPage}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  // Destructure
  const users = userData?.data || [];
  const totalCount = userData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const pages = [...Array(totalPages).keys()];

  // Open modals
  const openStatusModal = user => {
    setModalUser(user);
    setBlockModal(false);
    setBlockReason('');
  };

  // Status update
  const handleStatusUpdate = async newStatus => {
    if (!modalUser) return;
    try {
      if (newStatus === 'Blocked' && !blockReason) {
        setBlockModal(true);
        return;
      }
      await axiosData.patch(`/users/${modalUser._id}/status`, {
        status: newStatus,
        reason: blockReason,
      });

      // ✅ show success toast
      toast.success(`${modalUser.userName} is now ${newStatus}`);

      setModalUser(null);
      setBlockReason('');
      setBlockModal(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  // Delete user
  const handleDelete = async userId => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axiosData.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="xl:p-6 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-white text-2xl font-semibold">Users</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={e => e.key === 'Enter' && handleSearch(input)}
            placeholder="Search users..."
            className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:border-indigo-400 backdrop-blur w-full md:w-[300px]"
          />
          <button
            onClick={() => handleSearch(input)}
            className="bg-indigo-500 cursor-pointer xl:text-2xl p-2 xl:px-4 xl:py-2 rounded-xl text-white hover:bg-indigo-600 transition"
          >
            <MdSearch />
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 cursor-pointer xl:px-4 px-1 xl:py-2 rounded-xl text-white hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-2xl border-t border-white/20"
        data-aos="zoom-in"
        data-aos-duration="600"
      >
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              {[
                'Photo',
                'Name',
                'Student ID',
                'Email',
                'Role',
                'Status',
                'Actions',
              ].map(h => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr
                key={u?._id}
                className="bg-white/10 backdrop-blur-lg rounded-xl transition hover:bg-white/20"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={u?.photoUrl || 'https://i.pravatar.cc/40'}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-white/20 object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {u?.userName || '?'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {u?.studentId || '?'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white break-all">
                  {u?.email || '?'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-xl text-white text-xs ${
                      roleColors[u.role] || 'bg-gray-400'
                    }`}
                  >
                    {u?.role || '?'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-xl text-white text-xs ${
                      statusColors[u?.status] || 'bg-yellow-500'
                    }`}
                  >
                    {u?.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                  {u?.role !== 'admin' && u?.role !== 'cr' && (
                    <>
                      {u.status !== 'Accepted' && (
                        <button
                          onClick={() => openStatusModal(u)}
                          className="text-green-500 cursor-pointer hover:text-green-600 transition"
                          title="Accept"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {u.status === 'Accepted' && (
                        <button
                          onClick={() => {
                            setModalUser(u);
                            setBlockModal(true);
                          }}
                          className="text-red-500 cursor-pointer hover:text-red-600 transition"
                          title="Block"
                        >
                          <FaBan />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-400 cursor-pointer hover:text-red-500 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Accept Modal */}
      {modalUser && !blockModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 w-96 relative">
            <h2 className="text-white text-lg font-semibold mb-4">
              Accept {modalUser.userName}
            </h2>
            <button
              onClick={() => handleStatusUpdate('Accepted')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition cursor-pointer mb-2"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setModalUser(null);
                setBlockModal(false);
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setModalUser(null);
                setBlockModal(false);
              }}
              className="absolute top-3 right-3 text-white text-xl font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {modalUser && blockModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 w-96 relative">
            <h2 className="text-white text-lg font-semibold mb-4">
              Block {modalUser.userName}
            </h2>
            <textarea
              value={blockReason}
              onChange={e => setBlockReason(e.target.value)}
              placeholder="Enter reason for blocking..."
              className="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/20 backdrop-blur focus:outline-none mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={() => handleStatusUpdate('Blocked')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition cursor-pointer"
              >
                Block
              </button>
              <button
                onClick={() => {
                  setBlockModal(false);
                  setBlockReason('');
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <button
              onClick={() => {
                setModalUser(null);
                setBlockModal(false);
                setBlockReason('');
              }}
              className="absolute top-3 right-3 text-white text-xl font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
