import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const Navbar = () => {
  const { isLoggedIn, isAdmin, isUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const getNavLinks = () => {
    if (isAdmin) {
      return [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Manage Properties', href: '/admin/properties' },
        { name: 'View Sales', href: '/admin/sales' }
      ];
    } else if (isUser) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Properties', href: '/properties' },
        { name: 'My Dashboard', href: '/user/dashboard' }
      ];
    } else {
      return [
        { name: 'Home', href: '/' },
        { name: 'Properties', href: '/properties' }
      ];
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-primary-600">
              DreamHome
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavLinks().map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            
            {isLoggedIn ? (
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <div className="flex space-x-4">
                <Button variant="secondary" onClick={() => window.location.href = '/login'}>
                  Login
                </Button>
                <Button variant="primary" onClick={() => window.location.href = '/register'}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {getNavLinks().map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600"
              >
                Logout
              </button>
            ) : (
              <>
                <a
                  href="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;