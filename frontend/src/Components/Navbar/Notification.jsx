import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  IoMdNotificationsOff,
  IoMdNotificationsOutline,
  IoMdTrash,
} from 'react-icons/io';
import useCallData from '../../customHooks/useCallData';
import TimeAgo from '../TimeAgo/TimeAgo';
import { AuthContext } from '../../Provider/AuthProvider';

const Notification = () => {
  const axiosData = useCallData();
  const { user } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications'],
    enabled: !!user,
    queryFn: async () => {
      const res = await axiosData.get('/notifications');
      return res.data.data;
    },
  });

  // 🔴 unread count
  const unRead = notifications.filter(
    n => !n.readBy?.includes(user?.studentId)
  ).length;

  // 🔔 bell click → open + mark all read
  const handleToggle = async () => {
    setOpen(prev => !prev);

    if (unRead > 0) {
      try {
        await axiosData.patch('/notifications/up');
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 🗑 delete all notifications (for current user)
  const handleDeleteAll = async () => {
    try {
      await axiosData.patch('/notifications/delete-all');
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ outside click close
  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* 🔔 Bell Icon */}
      <button
        onClick={handleToggle}
        className="btn btn-ghost btn-circle relative"
      >
        <IoMdNotificationsOutline className="text-2xl text-white" />
        {unRead > 0 && (
          <>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
          </>
        )}
      </button>

      {/* 🔽 Panel */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-56 xl:w-80 z-[999]"
          data-aos="fade-down"
          data-aos-duration="600"
        >
          <div className="relative overflow-hidden rounded-xl border border-white/20 bg-[#1A1A1A] shadow-lg p-4">
            {/* glow */}
            <div className="pointer-events-none absolute h-20 w-20 bg-pink-400 blur-[80px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-20 w-20 bg-indigo-500 blur-[80px]" />

            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-white">
                Notifications
              </h3>

              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-1 cursor-pointer text-xs text-red-400 hover:text-red-300"
                >
                  <IoMdTrash />
                  Clear
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto space-y-3">
              {notifications.length > 0 && user?.status==='Accepted'? (
                notifications.map(noti => {
                  const isRead = noti.readBy?.includes(user?.studentId);

                  return (
                    <div
                      key={noti._id}
                      className={`rounded p-3 transition ${
                        isRead
                          ? 'bg-white/10'
                          : 'bg-indigo-500/10 border border-indigo-400/30'
                      }`}
                    >
                      <p className="text-sm text-white">{noti.message}</p>
                      <p className="mt-1 text-xs text-white/60">
                        <TimeAgo date={noti.createdAt} />
                        <span className="before:content-['•'] ml-2 before:mr-1">
                          {noti.type}
                        </span>
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-white/60">
                  <IoMdNotificationsOff className="text-4xl" />
                  No Notifications
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
