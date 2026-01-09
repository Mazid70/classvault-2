import React from 'react';
import { IoMdNotificationsOff } from 'react-icons/io';

const NoDataFound = ({ message = 'No data found' }) => {
  return (
    <div className="flex h-[500px] flex-col items-center justify-center py-16 gap-4 w-full text-center text-white/70">
      <IoMdNotificationsOff className="text-6xl text-white/40" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-white/50">
        Try adjusting your search or filters.
      </p>
    </div>
  );
};

export default NoDataFound;
