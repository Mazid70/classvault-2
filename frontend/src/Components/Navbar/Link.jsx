import { NavLink } from 'react-router';

const Link = ({ link, title }) => {
  return (
    <li>
      <NavLink
        to={link}
        className={({ isActive }) =>
          `relative  font-semibold text-md px-2 py-1 transition-all duration-300 
          before:absolute before:bottom-[-4px] before:left-0
          before:h-[2px] before:w-0 before:bg-gradient-to-r 
          before:from-pink-400 
          hover:before:w-full before:transition-all before:duration-300
          ${
            isActive
              ? 'font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent before:w-full'
              : ''
          }`
        }
      >
        {title}
      </NavLink>
    </li>
  );
};

export default Link;
