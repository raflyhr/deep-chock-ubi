import React, { useState, useEffect } from 'react';
import { 
    User, 
 
 
    Moon, 
    Sun, 
    Shield, 
    Save,
    Mail,
    UserCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const AdminSettings = () => {
    const { theme, toggleTheme } = useTheme();
    
    // Get user data from localStorage
    const [profileData, setProfileData] = useState({
        fullName: 'Admin Ubi',
        email: 'admin@gmail.com'
    });
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        // Load user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.name || userData.email) {
            setProfileData({
                fullName: userData.name || 'Admin Ubi',
                email: userData.email || 'admin@gmail.com'
            });
        }
    }, []);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSaveProfile = async () => {
        setIsSaving(true);
        
        // Simulate API call (replace with actual API later)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
            ...currentUser,
            name: profileData.fullName,
            email: profileData.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setIsSaving(false);
        alert('Profil berhasil diperbarui!');
    };

    return (
        <AdminLayout>
            <div className="mb-6 md:mb-10">
                <h1 className="text-2xl md:text-3xl font-black text-deepbrown-900 dark:text-cream-50">Pengaturan Dashboard</h1>
                <p className="text-sm md:text-base text-deepbrown-500 dark:text-cream-200/50 mt-1 font-medium">Kelola profil admin dan preferensi tampilan Anda.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Left Column: Account Settings */}
                <div className="xl:col-span-2 space-y-6 md:space-y-8">
                    <section className="bg-white dark:bg-deepbrown-800 rounded-2xl md:rounded-[2.5rem] border border-deepbrown-50 dark:border-deepbrown-700 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-deepbrown-50 dark:border-deepbrown-700 flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                                <UserCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-black text-deepbrown-900 dark:text-cream-50">Profil Admin</h2>
                                <p className="text-[10px] md:text-xs text-deepbrown-400 dark:text-cream-200/40 font-bold uppercase tracking-widest">Informasi Dasar Akun</p>
                            </div>
                        </div>
                        
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-[10px] md:text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest mb-2 md:mb-3 ml-1">
                                        Nama Lengkap
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deepbrown-400" />
                                        <input 
                                            type="text"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 md:py-4 bg-cream-50 dark:bg-deepbrown-900 border-none rounded-xl md:rounded-2xl text-sm font-bold text-deepbrown-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] md:text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest mb-2 md:mb-3 ml-1">
                                        Alamat Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deepbrown-400" />
                                        <input 
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 md:py-4 bg-cream-50 dark:bg-deepbrown-900 border-none rounded-xl md:rounded-2xl text-sm font-bold text-deepbrown-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] md:text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest mb-2 md:mb-3 ml-1">
                                    Jabatan / Role
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deepbrown-400" />
                                    <input 
                                        type="text" 
                                        defaultValue="Super Admin"
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-cream-50/50 dark:bg-deepbrown-900/50 border-none rounded-xl md:rounded-2xl text-sm font-bold text-deepbrown-400 dark:text-cream-200/20 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 md:pt-4 flex justify-end">
                                <button 
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 md:py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl md:rounded-2xl font-black transition-all shadow-lg shadow-terracotta-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                >
                                    <Save className="w-5 h-5" />
                                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                                </button>
                            </div>
                        </div>
                    </section>


                </div>

                {/* Right Column: Preferences */}
                <div className="space-y-6 md:space-y-8">
                    <section className="bg-white dark:bg-deepbrown-800 rounded-2xl md:rounded-[2.5rem] border border-deepbrown-50 dark:border-deepbrown-700 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-deepbrown-50 dark:border-deepbrown-700 flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                                {theme === 'dark' ? <Moon className="w-5 h-5 md:w-6 md:h-6 text-purple-500" /> : <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />}
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-black text-deepbrown-900 dark:text-cream-50">Tampilan</h2>
                                <p className="text-[10px] md:text-xs text-deepbrown-400 dark:text-cream-200/40 font-bold uppercase tracking-widest">Kustomisasi Mode</p>
                            </div>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between p-1.5 md:p-2 bg-cream-50 dark:bg-deepbrown-900 rounded-2xl md:rounded-3xl gap-2">
                                <button 
                                    onClick={() => theme === 'dark' && toggleTheme()}
                                    className={`flex-1 flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all text-sm md:text-base ${theme === 'light' ? 'bg-white text-deepbrown-900 shadow-sm' : 'text-cream-200/40 hover:text-cream-100'}`}
                                >
                                    <Sun className="w-4 h-4 md:w-5 md:h-5" />
                                    <span>Light</span>
                                </button>
                                <button 
                                    onClick={() => theme === 'light' && toggleTheme()}
                                    className={`flex-1 flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all text-sm md:text-base ${theme === 'dark' ? 'bg-deepbrown-800 text-cream-50 shadow-sm' : 'text-deepbrown-400 hover:text-deepbrown-600'}`}
                                >
                                    <Moon className="w-4 h-4 md:w-5 md:h-5" />
                                    <span>Dark</span>
                                </button>
                            </div>

                            <div className="mt-6 p-4 bg-terracotta-50 dark:bg-terracotta-900/10 rounded-2xl border border-terracotta-100 dark:border-terracotta-900/20">
                                <p className="text-xs text-terracotta-600 dark:text-terracotta-400 font-medium leading-relaxed">
                                    Simpan mata Anda dengan beralih ke Dark Mode saat bekerja di malam hari.
                                </p>
                            </div>
                        </div>
                    </section>


                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
