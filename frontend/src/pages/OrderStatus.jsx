import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock, XCircle, ArrowLeft, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import Layout from '../components/layout/Layout';
import api from '../api/api';
import { formatPrice } from '../lib/utils';

const OrderStatus = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, [code]);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/order/${code}`);
            setOrder(response.data);
            setLoading(false);
        } catch (err) {
            setError('Pesanan tidak ditemukan');
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Menunggu Konfirmasi', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
            processing: { label: 'Sedang Diproses', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            completed: { label: 'Selesai', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
            cancelled: { label: 'Dibatalkan', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' }
        };
        return statusMap[status] || statusMap.pending;
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-6 py-20 text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-terracotta-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-deepbrown-600 dark:text-cream-200">Memuat pesanan...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container mx-auto px-6 py-20 text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-deepbrown-900 dark:text-cream-50 mb-2">{error}</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-3 bg-terracotta-500 text-white rounded-xl font-bold hover:bg-terracotta-600 transition-all"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </Layout>
        );
    }

    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    return (
        <Layout>
            <div className="container mx-auto px-6 py-10">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-deepbrown-600 dark:text-cream-200 hover:text-terracotta-500 transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Kembali ke Beranda</span>
                </button>

                <div className="max-w-4xl mx-auto">
                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-8 text-center"
                    >
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-deepbrown-900 dark:text-cream-50 mb-2">
                            Pesanan Berhasil Dibuat!
                        </h1>
                        <p className="text-deepbrown-600 dark:text-cream-200/80 mb-6">
                            Kode Pesanan: <span className="font-bold text-terracotta-600 dark:text-terracotta-400">{order.order_code}</span>
                        </p>
                        
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm text-deepbrown-500 dark:text-cream-200/60 italic">
                                Kami sedang membuka WhatsApp untuk konfirmasi pesanan Anda...
                            </p>
                            <a 
                                href={order.whatsapp_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-black shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                KONFIRMASI VIA WHATSAPP
                            </a>
                        </div>
                    </motion.div>

                    {/* Order Status */}
                    <div className="bg-white dark:bg-deepbrown-800 rounded-2xl p-6 shadow-sm border border-deepbrown-50 dark:border-deepbrown-700 mb-8">
                        <h2 className="text-xl font-bold text-deepbrown-900 dark:text-cream-50 mb-4">Status Pesanan</h2>
                        <div className={`flex items-center gap-4 p-4 ${statusInfo.bg} rounded-xl`}>
                            <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
                            <div>
                                <p className={`font-bold ${statusInfo.color}`}>{statusInfo.label}</p>
                                <p className="text-sm text-deepbrown-500 dark:text-cream-200/60">
                                    {new Date(order.created_at).toLocaleDateString('id-ID', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white dark:bg-deepbrown-800 rounded-2xl p-6 shadow-sm border border-deepbrown-50 dark:border-deepbrown-700 mb-8">
                        <h2 className="text-xl font-bold text-deepbrown-900 dark:text-cream-50 mb-4">Detail Pesanan</h2>
                        <div className="space-y-4">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center border-b border-deepbrown-100 dark:border-deepbrown-700 pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-bold text-deepbrown-900 dark:text-cream-50">{item.menu?.name}</p>
                                        <p className="text-sm text-deepbrown-500 dark:text-cream-200/60">Qty: {item.qty}</p>
                                    </div>
                                    <p className="font-bold text-deepbrown-900 dark:text-cream-50">{formatPrice(item.price * item.qty)}</p>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-deepbrown-200 dark:border-deepbrown-700">
                                <div className="flex justify-between text-deepbrown-600 dark:text-cream-200 mb-2">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.total_price - 15000)}</span>
                                </div>
                                <div className="flex justify-between text-deepbrown-600 dark:text-cream-200 mb-2">
                                    <span>Ongkir</span>
                                    <span>Rp 15.000</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-deepbrown-900 dark:text-cream-50 pt-2 border-t border-deepbrown-100 dark:border-deepbrown-700">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total_price)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-deepbrown-800 rounded-2xl p-6 shadow-sm border border-deepbrown-50 dark:border-deepbrown-700">
                            <h3 className="text-lg font-bold text-deepbrown-900 dark:text-cream-50 mb-4">Informasi Pengiriman</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-terracotta-500 mt-1" />
                                    <div>
                                        <p className="font-medium text-deepbrown-900 dark:text-cream-50">{order.customer_name}</p>
                                        <p className="text-sm text-deepbrown-600 dark:text-cream-200/80">{order.customer_address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-terracotta-500" />
                                    <p className="text-sm text-deepbrown-600 dark:text-cream-200/80">{order.customer_phone}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-terracotta-500" />
                                    <p className="text-sm text-deepbrown-600 dark:text-cream-200/80">{order.customer_email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-deepbrown-800 rounded-2xl p-6 shadow-sm border border-deepbrown-50 dark:border-deepbrown-700">
                            <h3 className="text-lg font-bold text-deepbrown-900 dark:text-cream-50 mb-4">Metode Pembayaran</h3>
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-terracotta-500" />
                                <p className="font-medium text-deepbrown-900 dark:text-cream-50 capitalize">{order.payment_method}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OrderStatus;
