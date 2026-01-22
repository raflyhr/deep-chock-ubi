import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';
import api from '../../api/api';
import { formatPrice } from '../../lib/utils';
import { motion } from 'framer-motion';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (page = 1) => {
        try {
            const response = await api.get(`/admin/menu?page=${page}`);
            setProducts(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            });
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setLoading(false);
        }
    };

    const handleAddProduct = async (formData) => {
        try {
            await api.post('/admin/menu-tambah', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchProducts(pagination.current_page);
            alert('Produk berhasil ditambahkan!');
        } catch (error) {
            console.error('Failed to add product:', error);
            alert('Gagal menambahkan produk');
        }
    };

    const handleEditProduct = async (formData) => {
        try {
            await api.post(`/admin/menu-update/${editingProduct.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchProducts(pagination.current_page);
            alert('Produk berhasil diupdate!');
        } catch (error) {
            console.error('Failed to update product:', error);
            alert('Gagal mengupdate produk');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Yakin ingin menghapus produk ini?')) return;

        try {
            await api.delete(`/admin/menu-hapus/${id}`);
            fetchProducts(pagination.current_page);
            alert('Produk berhasil dihapus!');
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Gagal menghapus produk');
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const [statusFilter, setStatusFilter] = useState('all');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'available' && product.is_available && product.stock > 0) ||
            (statusFilter === 'out_of_stock' && product.is_available && product.stock <= 0) ||
            (statusFilter === 'disabled' && !product.is_available);
        return matchesSearch && matchesStatus;
    });

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
                    <h1 className="text-2xl md:text-3xl font-black text-deepbrown-900 dark:text-cream-50">Manajemen Produk</h1>
                    <p className="text-sm md:text-base text-deepbrown-500 dark:text-cream-200/50 mt-1 font-medium">Kelola katalog produk, harga, dan deskripsi Anda.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 md:py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl md:rounded-2xl font-black transition-all shadow-lg shadow-terracotta-500/20 active:scale-95 text-sm md:text-base"
                >
                    <Plus className="w-5 h-5" />
                    <span>Tambah Produk</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-deepbrown-800 p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-sm border border-deepbrown-50 dark:border-deepbrown-700 flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deepbrown-400" />
                    <input 
                        type="text"
                        placeholder="Cari nama produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-cream-50 dark:bg-deepbrown-900 border-none rounded-xl md:rounded-2xl text-sm md:text-base text-deepbrown-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500/50 transition-all font-medium"
                    />
                </div>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 md:py-4 bg-cream-50 dark:bg-deepbrown-900 border-none rounded-xl md:rounded-2xl text-sm md:text-base text-deepbrown-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500/50 transition-all font-bold"
                >
                    <option value="all">Semua Status</option>
                    <option value="available">Available</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="disabled">Disabled</option>
                </select>
            </div>

            {/* Product Table */}
            <div className="bg-white dark:bg-deepbrown-800 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-deepbrown-50 dark:border-deepbrown-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-cream-50 dark:bg-deepbrown-900/50 text-[10px] uppercase font-black tracking-[0.2em] text-deepbrown-400 dark:text-cream-200/40">
                            <tr>
                                <th className="px-4 md:px-8 py-4 md:py-6">Produk</th>
                                <th className="px-4 md:px-8 py-4 md:py-6">Deskripsi</th>
                                <th className="px-4 md:px-8 py-4 md:py-6">Harga</th>
                                <th className="px-4 md:px-8 py-4 md:py-6">Stok</th>
                                <th className="px-4 md:px-8 py-4 md:py-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-deepbrown-50 dark:divide-deepbrown-700">
                            {filteredProducts.map((product, index) => (
                                <motion.tr 
                                    key={product.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group hover:bg-cream-50/50 dark:hover:bg-deepbrown-700/50 transition-colors"
                                >
                                    <td className="px-4 md:px-8 py-4 md:py-6">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden bg-cream-100 dark:bg-deepbrown-900 shrink-0 border border-deepbrown-50 dark:border-white/5">
                                                <img 
                                                    src={product.image_url || product.image} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/400x400/png?text=Product';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm md:text-base text-deepbrown-900 dark:text-cream-50">{product.name}</p>
                                                {product.is_available ? (
                                                    product.stock > 0 ? (
                                                        <span className="text-[10px] md:text-xs font-bold text-green-600">● Available</span>
                                                    ) : (
                                                        <span className="text-[10px] md:text-xs font-bold text-orange-600">● Out of Stock</span>
                                                    )
                                                ) : (
                                                    <span className="text-[10px] md:text-xs font-bold text-red-600">● Disabled</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-8 py-4 md:py-6">
                                        <p className="text-xs md:text-sm text-deepbrown-500 dark:text-cream-200/60 line-clamp-2 max-w-[200px] md:max-w-[300px] leading-relaxed">
                                            {product.description || '-'}
                                        </p>
                                    </td>
                                    <td className="px-4 md:px-8 py-4 md:py-6">
                                        <p className="font-black text-sm md:text-base text-deepbrown-900 dark:text-cream-50">{formatPrice(product.price)}</p>
                                    </td>
                                    <td className="px-4 md:px-8 py-4 md:py-6">
                                        <p className="font-bold text-sm md:text-base text-deepbrown-900 dark:text-cream-50">{product.stock}</p>
                                    </td>
                                    <td className="px-4 md:px-8 py-4 md:py-6">
                                        <div className="flex items-center justify-end gap-1 md:gap-2">
                                            <button 
                                                onClick={() => openEditModal(product)}
                                                className="p-2 md:p-3 bg-blue-500/10 text-blue-500 rounded-lg md:rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-2 md:p-3 bg-red-500/10 text-red-500 rounded-lg md:rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-deepbrown-300 dark:text-deepbrown-600 mx-auto mb-4" />
                        <p className="text-deepbrown-500 dark:text-cream-200/50 font-medium">
                            {searchTerm ? 'Tidak ada produk yang cocok' : 'Belum ada produk'}
                        </p>
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination.last_page > 1 && (
                    <div className="px-4 md:px-8 py-4 bg-cream-50/50 dark:bg-deepbrown-900/30 border-t border-deepbrown-50 dark:border-deepbrown-700 flex items-center justify-between">
                        <p className="text-[10px] md:text-xs font-bold text-deepbrown-400 dark:text-cream-200/40 uppercase tracking-widest">
                            Page {pagination.current_page} of {pagination.last_page} ({pagination.total} Produk)
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => fetchProducts(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-4 py-2 bg-white dark:bg-deepbrown-800 text-deepbrown-900 dark:text-cream-50 rounded-xl text-xs font-black border border-deepbrown-50 dark:border-deepbrown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-terracotta-500 hover:text-white"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={() => fetchProducts(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-4 py-2 bg-white dark:bg-deepbrown-800 text-deepbrown-900 dark:text-cream-50 rounded-xl text-xs font-black border border-deepbrown-50 dark:border-deepbrown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-terracotta-500 hover:text-white"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Form Modal */}
            <ProductForm
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
                initialData={editingProduct}
            />
        </AdminLayout>
    );
};

export default AdminProducts;
