import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Grid' },
    { path: '/payments', label: 'Payments' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block py-3 px-4 text-sm font-medium rounded-md transition-all duration-300 transform hover:scale-105 ${
                  location.pathname === item.path
                    ? 'text-white border-b-1 border-white'
                    : 'text-gray-200'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
