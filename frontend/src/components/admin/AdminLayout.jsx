import React, { useState } from 'react';
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Users, 
    Settings, 
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Mail
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api/api';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Produk', path: '/admin/products' },
        { icon: ShoppingCart, label: 'Penjualan', path: '/admin/sales' },
        { icon: ShoppingCart, label: 'Pesanan', path: '/admin/orders' },
        { icon: Mail, label: 'Pesan Masuk', path: '/admin/messages' },
    ];

    const handleLogout = async () => {
        try {
            await api.post('/admin/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 dark:bg-deepbrown-900 flex font-sans">
            {/* Sidebar */}
            <aside className={`
                ${isSidebarOpen ? 'w-72' : 'w-24'} 
                hidden md:flex flex-col bg-white dark:bg-deepbrown-900 border-r border-deepbrown-50 dark:border-white/5 transition-all duration-300
            `}>
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center shrink-0">
                        <Package className="text-white w-6 h-6" />
                    </div>
                    {isSidebarOpen && (
                        <span className="text-deepbrown-900 dark:text-white font-black text-xl tracking-tight">DC Admin</span>
                    )}
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`
                                    w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group
                                    ${isActive 
                                        ? 'bg-terracotta-500 text-white shadow-lg shadow-terracotta-500/20' 
                                        : 'text-deepbrown-400 dark:text-cream-200/50 hover:bg-cream-50 dark:hover:bg-white/5 hover:text-terracotta-500 dark:hover:text-white'}
                                `}
                            >
                                <item.icon className="w-6 h-6 shrink-0" />
                                {isSidebarOpen && <span className="font-bold">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-deepbrown-50 dark:border-white/5">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-4 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                        <LogOut className="w-6 h-6 shrink-0" />
                        {isSidebarOpen && <span className="font-bold">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                    
                    {/* Mobile Sidebar */}
                    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-deepbrown-900 z-50 md:hidden flex flex-col shadow-2xl">
                        <div className="p-6 flex items-center justify-between border-b border-deepbrown-50 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
                                    <Package className="text-white w-6 h-6" />
                                </div>
                                <span className="text-deepbrown-900 dark:text-white font-black text-xl tracking-tight">DC Admin</span>
                            </div>
                            <button 
                                onClick={() => setIsMobileSidebarOpen(false)}
                                className="p-2 hover:bg-deepbrown-100 dark:hover:bg-deepbrown-800 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-deepbrown-600 dark:text-cream-200" />
                            </button>
                        </div>

                        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                            {menuItems.map((item, index) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            navigate(item.path);
                                            setIsMobileSidebarOpen(false);
                                        }}
                                        className={`
                                            w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all
                                            ${isActive 
                                                ? 'bg-terracotta-500 text-white shadow-lg shadow-terracotta-500/20' 
                                                : 'text-deepbrown-400 dark:text-cream-200/50 hover:bg-cream-50 dark:hover:bg-white/5 hover:text-terracotta-500'}
                                        `}
                                    >
                                        <item.icon className="w-6 h-6" />
                                        <span className="font-bold">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="p-6 border-t border-deepbrown-50 dark:border-white/5">
                            <button 
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileSidebarOpen(false);
                                }}
                                className="w-full flex items-center gap-4 px-4 py-4 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                            >
                                <LogOut className="w-6 h-6" />
                                <span className="font-bold">Logout</span>
                            </button>
                        </div>
                    </aside>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-white dark:bg-deepbrown-800 border-b border-deepbrown-50 dark:border-deepbrown-700 px-8 flex items-center justify-between sticky top-0 z-20">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:flex hidden p-2.5 bg-cream-50 dark:bg-deepbrown-900 rounded-xl hover:bg-terracotta-500 transition-all text-deepbrown-600 dark:text-cream-200 hover:text-white"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="md:hidden p-2.5 bg-cream-50 dark:bg-deepbrown-900 rounded-xl hover:bg-terracotta-500 transition-all text-deepbrown-600 dark:text-cream-200 hover:text-white"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 bg-cream-50 dark:bg-deepbrown-900 rounded-xl hover:bg-terracotta-500 transition-all text-deepbrown-600 dark:text-cream-200 hover:text-white"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="flex items-center pl-6 border-l border-deepbrown-50 dark:border-deepbrown-700">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-deepbrown-900 dark:text-cream-50">Admin Ubi</p>
                                <p className="text-[10px] font-black uppercase text-terracotta-500 tracking-wider">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
