import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 lg:px-6 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            NotesApp
          </span>
        </Link>
        <div className="flex md:order-2">
          <div className="hidden space-x-4 md:-mx-2 md:flex md:items-center md:w-auto">
            <Link
              to="/dashboard"
              className={`
                bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium
                ${isActive('/dashboard') ? 'bg-indigo-600' : 'hover:bg-gray-700 hover:text-white'}
              `}
            >
              Dashboard
            </Link>
            <Link
              to="/testing-list"
              className={`
                bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium
                ${isActive('/testing-list') ? 'bg-indigo-600' : 'hover:bg-gray-700 hover:text-white'}
              `}
            >
              Testing List
            </Link>
            <Link
              to="/testing-form"
              className={`
                bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium
                ${isActive('/testing-form') ? 'bg-indigo-600' : 'hover:bg-gray-700 hover:text-white'}
              `}
            >
              Testing Form
            </Link>
            <Link
              to="/backend-list"
              className={`
                bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium
                ${isActive('/backend-list') ? 'bg-indigo-600' : 'hover:bg-gray-700 hover:text-white'}
              `}
            >
              Backend List
            </Link>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-label="Open main menu"
            >
              {/* Hamburger icon */}
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        <div className="hidden space-x-4 md:-mx-2 md:flex md:items-center md:w-auto">
          {user ? (
            <>
              <span className="px-3 py-2 rounded-md text-sm font-medium">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="ml-4 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}