import React, { useState, useEffect } from 'react';
import { Package, Search, Eye, CheckCircle, Clock, XCircle, Filter as FilterIcon, CheckCircle2, MapPin, Phone, User, ShoppingBag, X, Hash } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/api';
import { formatPrice } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async (page = 1) => {
        try {
            const response = await api.get(`/admin/order?page=${page}`);
            setOrders(response.data.orders.data);
            setPagination({
                current_page: response.data.orders.current_page,
                last_page: response.data.orders.last_page,
                total: response.data.orders.total
            });
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.post(`/admin/order-status/${orderId}`, { status: newStatus });
            // Refresh current page
            fetchOrders(pagination.current_page);
            alert('Status pesanan berhasil diupdate!');
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Gagal update status pesanan');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: 'PENDING', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
            confirmed: { label: 'CONFIRMED', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
            preparing: { label: 'PREPARING', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
            on_delivery: { label: 'ON DELIVERY', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
            completed: { label: 'COMPLETED', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
            cancelled: { label: 'CANCELLED', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' }
        };
        return badges[status] || badges.pending;
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-12 h-12 border-4 border-terracotta-500 border-t-transparent rounded-full"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-deepbrown-900 dark:text-cream-50">Manajemen Pesanan</h1>
                    <p className="text-sm md:text-base text-deepbrown-500 dark:text-cream-200/50 mt-1 font-medium">Kelola semua pesanan pelanggan</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-deepbrown-800 p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-sm border border-deepbrown-50 dark:border-deepbrown-700 flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deepbrown-400" />
                    <input 
                        type="text"
                        placeholder="Cari kode pesanan atau nama customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-cream-50 dark:bg-deepbrown-900 border-none rounded-xl md:rounded-2xl text-sm md:text-base text-deepbrown-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500/50 transition-all font-medium"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-6 py-3 md:py-4 bg-cream-50 dark:bg-deepbrown-900 text-deepbrown-600 dark:text-cream-200 rounded-xl md:rounded-2xl font-bold border-none focus:ring-2 focus:ring-terracotta-500/50 text-sm md:text-base"
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-deepbrown-800 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-deepbrown-50 dark:border-deepbrown-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        {/* ... table head matching index ... */}
                        <thead className="bg-cream-50 dark:bg-deepbrown-900/50 text-[10px] uppercase font-black tracking-[0.2em] text-deepbrown-400 dark:text-cream-200/40">
                            <tr>
                                <th className="px-4 md:px-8 py-4 md:py-6">Kode Pesanan</th>
                                <th className="px-4 md:px-8 py-4 md:py-6">Customer</th>
                                <th className="px-4 md:px-8 py-4 md:py-6">Total</th>
                                <th className="px-4 md:px-8 py-4 md:py-6">Status</th>
                                <th className="px-4 md:px-8 py-4 md:py-6">Tanggal</th>
                                <th className="px-4 md:px-8 py-4 md:py-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-deepbrown-50 dark:divide-deepbrown-700">
                            {filteredOrders.map((order, index) => {
                                const badge = getStatusBadge(order.status);
                                return (
                                    <motion.tr 
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group hover:bg-cream-50/50 dark:hover:bg-deepbrown-700/50 transition-colors"
                                    >
                                        <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                                            <div className="flex items-center px-3 py-1.5 bg-terracotta-500/5 dark:bg-terracotta-500/10 rounded-xl border border-terracotta-500/10 w-fit group-hover:scale-105 transition-all duration-300">
                                                <p className="font-black text-xs md:text-sm text-terracotta-600 dark:text-terracotta-400 tracking-widest font-mono">
                                                    #{order.order_code}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                                            <p className="font-bold text-sm md:text-base text-deepbrown-900 dark:text-cream-50 leading-tight">{order.customer_name}</p>
                                            <p className="text-[10px] md:text-xs text-deepbrown-500 dark:text-cream-200/60 mt-0.5 tracking-wide">{order.customer_email}</p>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <p className="font-black text-sm md:text-base text-deepbrown-900 dark:text-cream-50">{formatPrice(order.total_price)}</p>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold ${badge.bg} ${badge.text}`}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <p className="text-xs md:text-sm text-deepbrown-600 dark:text-cream-200/80">
                                                {new Date(order.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <div className="flex items-center justify-end gap-1.5 md:gap-2">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 md:p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <div className="w-px h-6 bg-deepbrown-50 dark:bg-deepbrown-700 mx-1 hidden sm:block"></div>
                                                <button 
                                                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                    className={`p-2 md:p-2.5 rounded-xl transition-all shadow-sm ${order.status === 'preparing' ? 'bg-yellow-500 text-white shadow-yellow-500/20' : 'bg-yellow-101 text-yellow-500 hover:bg-yellow-500 hover:text-white dark:bg-yellow-500/10'}`}
                                                    title="Set ke Proses"
                                                >
                                                    <Clock className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                                    className={`p-2 md:p-2.5 rounded-xl transition-all shadow-sm ${order.status === 'completed' ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-green-101 text-green-500 hover:bg-green-500 hover:text-white dark:bg-green-500/10'}`}
                                                    title="Set ke Selesai"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                    className={`p-2 md:p-2.5 rounded-xl transition-all shadow-sm ${order.status === 'cancelled' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-red-101 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-500/10'}`}
                                                    title="Set ke Batal"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {pagination.last_page > 1 && (
                    <div className="px-4 md:px-8 py-4 bg-cream-50/50 dark:bg-deepbrown-900/30 border-t border-deepbrown-50 dark:border-deepbrown-700 flex items-center justify-between">
                        <p className="text-[10px] md:text-xs font-bold text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">
                            Halaman {pagination.current_page} dari {pagination.last_page} ({pagination.total} Pesanan)
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => fetchOrders(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-4 py-2 bg-white dark:bg-deepbrown-800 text-deepbrown-900 dark:text-cream-50 rounded-xl text-xs font-black border border-deepbrown-50 dark:border-deepbrown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-terracotta-500 hover:text-white"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={() => fetchOrders(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-4 py-2 bg-white dark:bg-deepbrown-800 text-deepbrown-900 dark:text-cream-50 rounded-xl text-xs font-black border border-deepbrown-50 dark:border-deepbrown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-terracotta-500 hover:text-white"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-deepbrown-300 dark:text-deepbrown-600 mx-auto mb-4" />
                        <p className="text-deepbrown-500 dark:text-cream-200/50 font-medium">
                            {searchTerm || filterStatus !== 'all' ? 'Tidak ada pesanan yang cocok' : 'Belum ada pesanan'}
                        </p>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-deepbrown-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-deepbrown-100 dark:border-deepbrown-700 flex justify-between items-center bg-cream-50 dark:bg-deepbrown-900">
                                <div>
                                    <h2 className="text-xl font-black text-deepbrown-900 dark:text-cream-50">Detail Pesanan</h2>
                                    <p className="text-xs text-terracotta-500 font-bold uppercase tracking-widest mt-1">#{selectedOrder.order_code}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-deepbrown-100 dark:hover:bg-deepbrown-700 rounded-xl transition-colors">
                                    <X className="w-6 h-6 text-deepbrown-600 dark:text-cream-200" />
                                </button>
                            </div>

                            <div className="p-6 border-b border-deepbrown-100 dark:border-deepbrown-700 mt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase text-deepbrown-400 dark:text-cream-200/40 tracking-widest px-1">Informasi Customer</h3>
                                        <div className="bg-cream-50 dark:bg-deepbrown-900/50 p-4 rounded-3xl border border-deepbrown-50 dark:border-deepbrown-700/50 space-y-4 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white dark:bg-deepbrown-800 rounded-2xl flex items-center justify-center text-terracotta-500 shadow-sm">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-deepbrown-900 dark:text-cream-50 truncate leading-tight">{selectedOrder.customer_name}</p>
                                                    <p className="text-xs text-deepbrown-500 dark:text-cream-200/60 font-medium truncate mt-1">{selectedOrder.customer_email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 pt-2 border-t border-deepbrown-100 dark:border-deepbrown-700/50">
                                                <div className="w-12 h-12 bg-white dark:bg-deepbrown-800 rounded-2xl flex items-center justify-center text-green-500 shadow-sm">
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <p className="text-sm font-black text-deepbrown-900 dark:text-cream-50 tracking-wide">{selectedOrder.customer_phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase text-deepbrown-400 dark:text-cream-200/40 tracking-widest px-1">Alamat Pengiriman</h3>
                                        <div className="bg-cream-50 dark:bg-deepbrown-900/50 p-5 rounded-3xl border border-deepbrown-50 dark:border-deepbrown-700/50 h-[calc(100%-1rem)] shadow-sm">
                                            <div className="flex items-start gap-4 h-full">
                                                <div className="w-12 h-12 bg-white dark:bg-deepbrown-800 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
                                                    <MapPin className="w-6 h-6" />
                                                </div>
                                                <p className="text-sm text-deepbrown-700 dark:text-cream-50 leading-relaxed font-bold mt-1">
                                                    {selectedOrder.customer_address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Order Items */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase text-deepbrown-400 dark:text-cream-200/40 tracking-widest px-1">Produk Dipesan</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} className="p-4 bg-white dark:bg-deepbrown-800/40 rounded-3xl flex items-center gap-4 border border-deepbrown-50 dark:border-deepbrown-700/30 group hover:border-terracotta-500/30 transition-all shadow-sm">
                                                <div className="w-20 h-20 bg-cream-50 dark:bg-deepbrown-900 rounded-2xl flex items-center justify-center overflow-hidden border border-deepbrown-100 dark:border-deepbrown-700 group-hover:scale-105 transition-transform duration-500">
                                                    {item.menu?.image ? (
                                                        <img src={`/storage/${item.menu.image}`} alt={item.menu.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ShoppingBag className="w-8 h-8 text-deepbrown-200" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-deepbrown-900 dark:text-cream-50 truncate text-lg leading-tight uppercase tracking-tight">
                                                        {item.menu?.name || 'Produk Dihapus'}
                                                    </p>
                                                    <p className="text-xs text-deepbrown-500 dark:text-cream-200/60 font-black mt-2 bg-cream-50 dark:bg-deepbrown-900 inline-block px-3 py-1 rounded-full uppercase tracking-widest">
                                                        {item.qty} x {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                                <p className="font-black text-xl text-deepbrown-900 dark:text-cream-50 tracking-tight">{formatPrice((item.qty || 0) * (item.price || 0))}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-deepbrown-900 dark:bg-black text-white flex justify-between items-center bg-linear-to-r from-deepbrown-900 to-deepbrown-800 dark:from-black dark:to-deepbrown-900">
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-50 mb-1">Total Pembayaran</p>
                                    <p className="text-3xl font-black text-terracotta-400 tracking-tight">{formatPrice(selectedOrder.total_price)}</p>
                                </div>
                                <div className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg ${getStatusBadge(selectedOrder.status).bg} ${getStatusBadge(selectedOrder.status).text} ring-2 ring-white/10`}>
                                    {getStatusBadge(selectedOrder.status).label}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminOrders;
