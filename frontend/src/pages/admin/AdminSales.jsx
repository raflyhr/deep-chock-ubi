import React, { useState, useEffect } from 'react';
import { 
    ShoppingCart, 
    TrendingUp, 
    Calendar, 
    Search, 
    Filter, 
    Download,
    CheckCircle2,
    Clock,
    XCircle,
    User,
    Phone,
    MapPin
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatPrice } from '../../lib/utils';
import { motion } from 'framer-motion';
import api from '../../api/api';

const AdminSales = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        total_revenue: 0,
        completed_count: 0,
        processing_count: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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
            setStats(response.data.stats);
            setPagination({
                current_page: response.data.orders.current_page,
                last_page: response.data.orders.last_page,
                total: response.data.orders.total
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/order/export', {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `rekap-penjualan-${new Date().toLocaleDateString('id-ID')}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setLoading(false);
        } catch (error) {
            console.error('Download error:', error);
            setLoading(false);
            alert('Gagal mendownload rekap. Silakan coba lagi.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            case 'pending':
            case 'confirmed':
            case 'on_delivery': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'cancelled': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getStatusLabel = (status) => {
        return status.toUpperCase();
    };

    const filteredOrders = orders.filter(order => 
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-deepbrown-900 dark:text-cream-50">Laporan Penjualan</h1>
                    <p className="text-deepbrown-500 dark:text-cream-200/50 mt-1 font-medium">Rekapitulasi dan manajemen status pesanan.</p>
                </div>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-4 bg-deepbrown-900 dark:bg-deepbrown-800 text-white rounded-2xl font-black transition-all hover:bg-terracotta-500 shadow-xl active:scale-95"
                >
                    <Download className="w-5 h-5" />
                    <span>Download Rekap</span>
                </button>
            </div>

            {/* Sales Recap Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-deepbrown-800 p-6 rounded-4xl border border-deepbrown-50 dark:border-deepbrown-700 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <p className="text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">Total Pendapatan</p>
                    <p className="text-3xl font-black text-deepbrown-900 dark:text-cream-50 mt-2">{formatPrice(stats.total_revenue)}</p>
                    <div className="mt-4 flex items-center gap-2 text-green-500 text-xs font-bold">
                        <TrendingUp className="w-4 h-4" />
                        <span>Realized Revenue</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-deepbrown-800 p-6 rounded-4xl border border-deepbrown-50 dark:border-deepbrown-700 shadow-sm">
                    <p className="text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">Pesanan Selesai</p>
                    <p className="text-3xl font-black text-deepbrown-900 dark:text-cream-50 mt-2">{stats.completed_count}</p>
                    <div className="mt-4 flex items-center gap-2 text-deepbrown-500 dark:text-cream-200/40 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Transaksi Berhasil</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-deepbrown-800 p-6 rounded-4xl border border-deepbrown-50 dark:border-deepbrown-700 shadow-sm">
                    <p className="text-xs font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">Dalam Proses</p>
                    <p className="text-3xl font-black text-deepbrown-900 dark:text-cream-50 mt-2">{stats.processing_count}</p>
                    <div className="mt-4 flex items-center gap-2 text-deepbrown-500 dark:text-cream-200/40 text-xs font-bold">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span>Butuh Tindakan</span>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-deepbrown-800 rounded-[2.5rem] shadow-sm border border-deepbrown-50 dark:border-deepbrown-700 overflow-hidden">
                <div className="p-8 border-b border-deepbrown-50 dark:border-deepbrown-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-black text-deepbrown-900 dark:text-cream-50">Daftar Transaksi</h2>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deepbrown-400" />
                            <input 
                                type="text"
                                placeholder="Cari pelanggan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 bg-cream-50 dark:bg-deepbrown-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-terracotta-500 transition-all w-full dark:text-cream-50"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        {/* ... table content remains matching index ... */}
                        <thead className="bg-cream-50 dark:bg-deepbrown-900/50 text-[10px] uppercase font-black tracking-[0.2em] text-deepbrown-400 dark:text-cream-200/40">
                            <tr>
                                <th className="px-6 py-5 whitespace-nowrap">Pelanggan</th>
                                <th className="px-6 py-5 whitespace-nowrap">Info Kontak</th>
                                <th className="px-6 py-5 whitespace-nowrap">Alamat Pengiriman</th>
                                <th className="px-6 py-5 whitespace-nowrap">Total</th>
                                <th className="px-6 py-5 whitespace-nowrap text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-deepbrown-50 dark:divide-deepbrown-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="animate-spin w-8 h-8 border-4 border-terracotta-500 border-t-transparent rounded-full mx-auto"></div>
                                        <p className="mt-4 text-deepbrown-500 font-bold">Memuat data transaksi...</p>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        Tidak ada transaksi ditemukan.
                                    </td>
                                </tr>
                            ) : filteredOrders.map((order, index) => (
                                <motion.tr 
                                    key={order.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group hover:bg-cream-50/50 dark:hover:bg-deepbrown-700/70 transition-colors"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4 min-w-[200px]">
                                            <div className="w-12 h-12 bg-cream-100 dark:bg-deepbrown-900 rounded-2xl flex items-center justify-center text-terracotta-500 shadow-inner group-hover:scale-110 transition-transform">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-deepbrown-900 dark:text-cream-50 leading-tight text-base">{order.customer_name}</p>
                                                <p className="text-[10px] text-terracotta-500 uppercase font-black mt-1.5 tracking-wider">Order #{order.order_code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-deepbrown-600 dark:text-cream-200/60 font-black text-sm">
                                            <div className="p-1.5 bg-terracotta-500/10 rounded-lg">
                                                <Phone className="w-3.5 h-3.5 text-terracotta-500" />
                                            </div>
                                            <span>{order.customer_phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-start gap-2 min-w-[300px] max-w-[400px]">
                                            <div className="p-1.5 bg-terracotta-500/10 rounded-lg shrink-0">
                                                <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                                            </div>
                                            <span className="text-sm text-deepbrown-600 dark:text-cream-200/60 leading-relaxed font-medium">
                                                {order.customer_address}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="font-black text-lg text-deepbrown-900 dark:text-cream-50">{formatPrice(order.total_price)}</p>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className={`inline-block px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transform transition-transform group-hover:scale-105 ${getStatusStyle(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {pagination.last_page > 1 && (
                    <div className="px-6 py-6 bg-cream-50/50 dark:bg-deepbrown-900/30 border-t border-deepbrown-50 dark:border-deepbrown-700 flex items-center justify-between">
                        <p className="text-[10px] md:text-sm font-black text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-[0.1em]">
                            Halaman {pagination.current_page} dari {pagination.last_page} ({pagination.total} Pelanggan)
                        </p>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => fetchOrders(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-6 py-2.5 bg-white dark:bg-deepbrown-900 text-deepbrown-900 dark:text-cream-50 rounded-xl text-xs font-black border border-deepbrown-100 dark:border-deepbrown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-terracotta-500 hover:text-white shadow-sm"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={() => fetchOrders(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-6 py-2.5 bg-white dark:bg-deepbrown-900 text-deepbrown-900 dark:text-cream-50 rounded-xl text-xs font-black border border-deepbrown-100 dark:border-deepbrown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-terracotta-500 hover:text-white shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminSales;
