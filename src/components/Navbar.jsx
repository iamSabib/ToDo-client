import { Link, useNavigate } from 'react-router';
// import ThemeToggle from './ThemeToggle';
import { GiTreeBeehive } from "react-icons/gi";
import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const links = [

  ];

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      {/* Navbar Start: Logo and Hamburger */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
            {links}
          </ul>
        </div>
        <Link
          to="/"

        >
          <div className="btn btn-ghost text-2xl  italic flex items-center pl-0 md:pl-4 gap-2 ">
            <GiTreeBeehive className='text-yellow-300 text-3xl text-center' />
            <span className="text-center hidden sm:block font-bold">Honey Meal</span>
          </div>
        </Link>
      </div>

      {/* Navbar Center: Links for larger screens */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-4">
          {links}
        </ul>
      </div>

      {/* Navbar End: User Profile and Buttons */}
      <div className="navbar-end ">
        {user.displayName}
        <button className='btn btn-accent btn-sm ml-4' onClick={() => logOut()}>
          Logout</button>
        {/* <ThemeToggle></ThemeToggle> */}
      </div>

    </div>
  );
};

export default Navbar;
