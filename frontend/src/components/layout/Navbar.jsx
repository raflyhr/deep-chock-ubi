import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X, Sun, Moon, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsCartOpen, cartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/admin/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/home');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '#shop' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 w-full z-50 transition-all duration-300',
                scrolled ? 'glass py-3 shadow-sm dark:bg-deepbrown-900/80 dark:border-deepbrown-800' : 'bg-transparent py-5'
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="text-2xl font-bold font-sans tracking-tight text-deepbrown-900 dark:text-cream-100">
                    Deep Chock <span className="text-terracotta-500">Ubi</span>
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-deepbrown-700 dark:text-cream-200 hover:text-terracotta-500 dark:hover:text-terracotta-400 font-medium transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-deepbrown-900 dark:text-cream-100"
                    >
                         {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ShoppingCart className="w-6 h-6 text-deepbrown-900 dark:text-cream-100" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="hidden lg:inline text-deepbrown-700 dark:text-cream-200 font-medium">
                                Hi, {user.name}
                            </span>
                            {user.role === 'admin' && !location.pathname.startsWith('/admin') ? (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="px-4 py-2 bg-terracotta-500 text-white rounded-full text-sm font-bold hover:bg-terracotta-600 transition-all"
                                >
                                    Dashboard
                                </button>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-terracotta-500 text-white rounded-full text-sm font-bold hover:bg-terracotta-600 transition-all"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Login"
                        >
                            <User className="w-6 h-6 text-deepbrown-900 dark:text-cream-100" />
                        </button>
                    )}

                    <button
                        className="md:hidden p-2 hover:bg-black/5 rounded-full"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-deepbrown-800"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
