import React, { useState, useEffect } from 'react';
import { Mail, Search, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/api';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/messages?page=${page}`);
            setMessages(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            });
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = messages.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.whatsapp && msg.whatsapp.includes(searchTerm))
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <div className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-deepbrown-900 dark:text-cream-50">Pesan Masuk</h1>
                    <p className="text-sm md:text-base text-deepbrown-500 dark:text-cream-200/50 mt-1 font-medium">
                        Kelola pesan dari formulir kontak.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deepbrown-400" />
                <input 
                    type="text" 
                    placeholder="Cari pesan..." 
                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-deepbrown-50 dark:border-deepbrown-700 bg-white dark:bg-deepbrown-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all shadow-sm text-sm md:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Messages Table */}
            <div className="bg-white dark:bg-deepbrown-800 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-deepbrown-50 dark:border-deepbrown-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-cream-50 dark:bg-deepbrown-900 border-b border-deepbrown-50 dark:border-deepbrown-700">
                            <tr>
                                <th className="px-4 md:px-8 py-4 md:py-6 text-left text-[10px] md:text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">Pengirim</th>
                                <th className="px-4 md:px-8 py-4 md:py-6 text-left text-[10px] md:text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">Subjek</th>
                                <th className="px-4 md:px-8 py-4 md:py-6 text-left text-[10px] md:text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">Pesan</th>
                                <th className="px-4 md:px-8 py-4 md:py-6 text-left text-[10px] md:text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">Tanggal</th>
                                <th className="px-4 md:px-8 py-4 md:py-6 text-right text-[10px] md:text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-deepbrown-50 dark:divide-deepbrown-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-8 text-center text-deepbrown-500">Memuat pesan...</td>
                                </tr>
                            ) : filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-8 text-center text-deepbrown-500">Tidak ada pesan ditemukan.</td>
                                </tr>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <tr key={msg.id} className="hover:bg-cream-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-terracotta-100 dark:bg-terracotta-900/30 rounded-full flex items-center justify-center text-terracotta-600 dark:text-terracotta-400 font-bold text-xs md:text-sm">
                                                    {msg.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm md:text-base text-deepbrown-900 dark:text-cream-50">{msg.name}</div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] md:text-xs text-deepbrown-500 dark:text-cream-200/60 truncate max-w-[120px] md:max-w-none">{msg.email}</span>
                                                        {msg.whatsapp && <span className="text-[10px] md:text-xs text-terracotta-500 font-bold">{msg.whatsapp}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <span className="font-medium text-sm md:text-base text-deepbrown-900 dark:text-cream-50 truncate max-w-[150px] block">{msg.subject}</span>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <p className="text-xs md:text-sm text-deepbrown-600 dark:text-cream-200/80 max-w-[150px] md:max-w-xs truncate" title={msg.message}>
                                                {msg.message}
                                            </p>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-sm text-deepbrown-500 dark:text-cream-200/60 font-medium">
                                            {formatDate(msg.created_at)}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => setSelectedMessage(msg)}
                                                    className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {pagination.last_page > 1 && (
                    <div className="px-4 md:px-8 py-4 bg-cream-50/50 dark:bg-deepbrown-900/30 border-t border-deepbrown-50 dark:border-deepbrown-700 flex items-center justify-between">
                        <p className="text-[10px] md:text-sm font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">
                            Halaman {pagination.current_page} dari {pagination.last_page} ({pagination.total} Pesan)
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => fetchMessages(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-4 py-2 bg-white dark:bg-deepbrown-800 text-deepbrown-900 dark:text-cream-50 rounded-xl text-xs font-black border border-deepbrown-50 dark:border-deepbrown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-terracotta-500 hover:text-white"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={() => fetchMessages(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-4 py-2 bg-white dark:bg-deepbrown-800 text-deepbrown-900 dark:text-cream-50 rounded-xl text-xs font-black border border-deepbrown-50 dark:border-deepbrown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-terracotta-500 hover:text-white"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedMessage(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-deepbrown-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 md:p-6 border-b border-deepbrown-100 dark:border-deepbrown-700">
                                <h2 className="text-xl md:text-2xl font-black text-deepbrown-900 dark:text-cream-50">Detail Pesan</h2>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-2 hover:bg-deepbrown-100 dark:hover:bg-deepbrown-700 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 md:w-6 md:h-6 text-deepbrown-600 dark:text-cream-200" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                                {/* Sender Info */}
                                <div>
                                    <label className="block text-sm font-bold text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest mb-2">
                                        Dari
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-terracotta-100 dark:bg-terracotta-900/30 rounded-full flex items-center justify-center text-terracotta-600 dark:text-terracotta-400 font-bold">
                                            {selectedMessage.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-deepbrown-900 dark:text-cream-50">{selectedMessage.name}</p>
                                            <p className="text-sm text-deepbrown-600 dark:text-cream-200/80">{selectedMessage.email}</p>
                                            {selectedMessage.whatsapp && (
                                                <p className="text-sm text-terracotta-500 font-bold mt-1">WA: {selectedMessage.whatsapp}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-bold text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest mb-2">
                                        Subjek
                                    </label>
                                    <p className="text-lg font-bold text-deepbrown-900 dark:text-cream-50">{selectedMessage.subject}</p>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-bold text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest mb-2">
                                        Pesan
                                    </label>
                                    <div className="bg-cream-50 dark:bg-deepbrown-900 rounded-xl p-4">
                                        <p className="text-deepbrown-900 dark:text-cream-50 leading-relaxed whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-bold text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest mb-2">
                                        Diterima Pada
                                    </label>
                                    <p className="text-deepbrown-600 dark:text-cream-200/80">
                                        {formatDate(selectedMessage.created_at)}
                                    </p>
                                </div>

                                {/* Reply Buttons */}
                                <div className="pt-4 flex flex-wrap justify-end gap-3">
                                    {selectedMessage.whatsapp && (
                                        <a
                                            href={`https://wa.me/${selectedMessage.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62').replace(/^(?!62)/, '62')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all flex items-center gap-2"
                                        >
                                            Chat via WhatsApp
                                        </a>
                                    )}
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="px-6 py-3 bg-terracotta-500 text-white rounded-xl font-bold hover:bg-terracotta-600 transition-all"
                                    >
                                        Balas via Email
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminMessages;
