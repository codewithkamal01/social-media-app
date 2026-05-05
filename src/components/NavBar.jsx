import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGitHub, signOut, user } = useAuth();
  const displayName = user?.user_metadata.user_name || user?.email;

  const location = useLocation();
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-mono text-xl font-bold text-white">
            social<span className="text-purple-500">.media</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
            <Link to="/create" className="text-gray-300 hover:text-white">
              Create Post
            </Link>
            <Link to="/communities" className="text-gray-300 hover:text-white">
              Communities
            </Link>
            <Link
              to="/community/create"
              className="text-gray-300 hover:text-white"
            >
              Create Community
            </Link>
          </div>

          {/* Authentication */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 px-3 py-1 rounded-full"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="bg-blue-500 px-3 py-1 rounded-full"
              >
                Sign in with GitHub
              </button>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[rgba(10,10,10,0.95)] backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-2">
              {/* Links */}
              <Link
                to="/"
                className="block px-3 py-2 text-gray-300 hover:text-white"
              >
                Home
              </Link>
              <Link
                to="/create"
                className="block px-3 py-2 text-gray-300 hover:text-white"
              >
                Create Post
              </Link>
              <Link
                to="/communities"
                className="block px-3 py-2 text-gray-300 hover:text-white"
              >
                Communities
              </Link>
              <Link
                to="/community/create"
                className="block px-3 py-2 text-gray-300 hover:text-white"
              >
                Create Community
              </Link>

              {/* Divider */}
              <div className="border-t border-white/10 my-2"></div>

              {/* Auth Section */}
              {user ? (
                <div className="flex items-center gap-3 px-3 py-2">
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-gray-300 text-sm flex-1">
                    {displayName}
                  </span>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="bg-red-500 px-3 py-1 rounded text-white text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signInWithGitHub();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-blue-500 px-3 py-2 rounded text-white text-sm"
                >
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
