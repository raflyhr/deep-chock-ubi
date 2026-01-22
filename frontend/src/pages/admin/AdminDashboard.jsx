import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import CustomerTable from '../../components/admin/CustomerTable';
import api from '../../api/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalProduk: 0,
        frekuensiPenjualan: 0,
        totalPenjualan: 0
    });

    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/stats?page=${page}`);
            const { stats, recent_orders } = response.data;
            
            setStats({
                totalProduk: stats.total_products,
                frekuensiPenjualan: stats.total_orders,
                totalPenjualan: stats.total_sales
            });

            // Map backend orders to frontend customer structure
            const mappedCustomers = recent_orders.data.map(order => ({
                nama: order.customer_name,
                telepon: order.customer_phone,
                alamat: order.customer_address,
                status: order.status
            }));

            setCustomers(mappedCustomers);
            setPagination({
                current_page: recent_orders.current_page,
                last_page: recent_orders.last_page,
                total: recent_orders.total
            });
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <AdminLayout>
            <div className="mb-6 md:mb-10">
                <h1 className="text-2xl md:text-3xl font-black text-deepbrown-900 dark:text-cream-50">Dashboard Overview</h1>
                <p className="text-sm md:text-base text-deepbrown-500 dark:text-cream-200/50 mt-1 font-medium">Monitoring performa toko Anda hari ini.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
                <StatCard 
                    title="Total Produk" 
                    value={`${stats.totalProduk} Produk`} 
                    icon={Package} 
                    bgClass="bg-blue-50 dark:bg-blue-900/20"
                    colorClass="text-blue-500"
                    index={0}
                />
                <StatCard 
                    title="Frekuensi Penjualan" 
                    value={`${stats.frekuensiPenjualan} Transaksi`} 
                    icon={ShoppingCart} 
                    bgClass="bg-purple-50 dark:bg-purple-900/20"
                    colorClass="text-purple-500"
                    index={1}
                />
                <StatCard 
                    title="Total Penjualan" 
                    value={formatRupiah(stats.totalPenjualan)} 
                    icon={DollarSign} 
                    bgClass="bg-terracotta-50 dark:bg-terracotta-900/20"
                    colorClass="text-terracotta-500"
                    index={2}
                />
            </div>

            {/* Customer Table Section */}
            <div className="bg-white dark:bg-deepbrown-800 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-deepbrown-50 dark:border-deepbrown-700 overflow-hidden">
                <div className="p-4 md:p-8 border-b border-deepbrown-50 dark:border-deepbrown-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-cream-50 dark:bg-deepbrown-900 rounded-xl md:rounded-2xl flex items-center justify-center">
                            <Users className="w-5 h-5 md:w-6 md:h-6 text-terracotta-500" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-deepbrown-900 dark:text-cream-50">Data Pelanggan</h2>
                            <p className="text-[10px] md:text-xs text-deepbrown-400 dark:text-cream-200/40 font-bold uppercase tracking-widest mt-0.5">Transaksi Terbaru</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/admin/sales')}
                        className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl md:rounded-2xl text-sm font-black transition-all shadow-lg shadow-terracotta-500/20"
                    >
                        Lihat Semua
                    </button>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center text-deepbrown-500 dark:text-cream-200/50 font-medium">
                        Memuat data overview...
                    </div>
                ) : (
                    <>
                        <CustomerTable data={customers} />
                        
                        {/* Pagination Controls */}
                        {pagination.last_page > 1 && (
                            <div className="p-4 md:p-8 bg-cream-50/50 dark:bg-deepbrown-900/30 border-t border-deepbrown-50 dark:border-deepbrown-700 flex items-center justify-between">
                                <p className="text-xs font-bold text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">
                                    Page {pagination.current_page} of {pagination.last_page} ({pagination.total} Pelanggan)
                                </p>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => fetchStats(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                        className="px-4 py-2 bg-white dark:bg-deepbrown-800 text-deepbrown-900 dark:text-cream-50 rounded-xl text-xs font-black border border-deepbrown-50 dark:border-deepbrown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-terracotta-500 hover:text-white"
                                    >
                                        Prev
                                    </button>
                                    <button 
                                        onClick={() => fetchStats(pagination.current_page + 1)}
                                        disabled={pagination.current_page === pagination.last_page}
                                        className="px-4 py-2 bg-white dark:bg-deepbrown-800 text-deepbrown-900 dark:text-cream-50 rounded-xl text-xs font-black border border-deepbrown-50 dark:border-deepbrown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-terracotta-500 hover:text-white"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
