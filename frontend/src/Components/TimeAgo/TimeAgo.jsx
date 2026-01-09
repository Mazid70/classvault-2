import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const TimeAgo = ({ date }) => {
  const [time, setTime] = useState(
    formatDistanceToNow(new Date(date), { addSuffix: true })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatDistanceToNow(new Date(date), { addSuffix: true }));
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [date]);

  return <span>{time}</span>;
};

export default TimeAgo;
