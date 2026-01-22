import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
        is_available: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || '',
                stock: initialData.stock || '',
                description: initialData.description || '',
                is_available: initialData.is_available ?? true
            });
            if (initialData.image_url || initialData.image) {
                setImagePreview(initialData.image_url || initialData.image);
            }
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            stock: '',
            description: '',
            is_available: true
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('price', formData.price);
        submitData.append('stock', formData.stock);
        submitData.append('description', formData.description);
        submitData.append('is_available', formData.is_available ? '1' : '0');
        
        if (imageFile) {
            submitData.append('image', imageFile);
        }

        try {
            await onSubmit(submitData);
            resetForm();
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-deepbrown-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 md:p-6 border-b border-deepbrown-100 dark:border-deepbrown-700">
                        <h2 className="text-xl md:text-2xl font-black text-deepbrown-900 dark:text-cream-50">
                            {initialData ? 'Edit Produk' : 'Tambah Produk Baru'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-deepbrown-100 dark:hover:bg-deepbrown-700 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6 text-deepbrown-600 dark:text-cream-200" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs md:text-sm font-bold text-deepbrown-700 dark:text-cream-200 mb-1.5 md:mb-2">
                                Nama Produk *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-cream-50 dark:bg-deepbrown-900 border-none rounded-xl text-sm md:text-base text-deepbrown-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500 transition-all"
                                placeholder="Contoh: Ubi Coklat Original"
                            />
                        </div>

                        {/* Price and Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs md:text-sm font-bold text-deepbrown-700 dark:text-cream-200 mb-1.5 md:mb-2">
                                    Harga (Rp) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-cream-50 dark:bg-deepbrown-900 border-none rounded-xl text-sm md:text-base text-deepbrown-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500 transition-all"
                                    placeholder="15000"
                                />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-bold text-deepbrown-700 dark:text-cream-200 mb-1.5 md:mb-2">
                                    Stok *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-cream-50 dark:bg-deepbrown-900 border-none rounded-xl text-sm md:text-base text-deepbrown-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500 transition-all"
                                    placeholder="100"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-deepbrown-700 dark:text-cream-200 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 bg-cream-50 dark:bg-deepbrown-900 border-none rounded-xl text-deepbrown-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500 transition-all resize-none"
                                placeholder="Deskripsi produk..."
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs md:text-sm font-bold text-deepbrown-700 dark:text-cream-200 mb-1.5 md:mb-2">
                                Gambar Produk
                            </label>
                            <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
                                {imagePreview && (
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-deepbrown-100 dark:border-deepbrown-700 shrink-0">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <label className="w-full flex-1 flex flex-col items-center justify-center p-4 md:p-6 border-2 border-dashed border-deepbrown-200 dark:border-deepbrown-700 rounded-xl cursor-pointer hover:border-terracotta-500 transition-colors">
                                    <Upload className="w-6 h-6 md:w-8 md:h-8 text-deepbrown-400 dark:text-cream-400 mb-2" />
                                    <span className="text-xs md:text-sm text-deepbrown-600 dark:text-cream-200 text-center">
                                        {imageFile ? imageFile.name : 'Upload gambar'}
                                    </span>
                                    <span className="text-[10px] md:text-xs text-deepbrown-400 dark:text-cream-400 mt-1">
                                        JPG, PNG (Max 2MB)
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Availability Toggle */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_available"
                                name="is_available"
                                checked={formData.is_available}
                                onChange={handleChange}
                                className="w-5 h-5 text-terracotta-500 rounded focus:ring-2 focus:ring-terracotta-500"
                            />
                            <label htmlFor="is_available" className="text-sm font-bold text-deepbrown-700 dark:text-cream-200">
                                Produk tersedia untuk dijual
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto px-6 py-2.5 md:py-3 bg-deepbrown-100 dark:bg-deepbrown-700 text-deepbrown-700 dark:text-cream-200 rounded-xl font-bold hover:bg-deepbrown-200 dark:hover:bg-deepbrown-600 transition-all text-sm md:text-base"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto px-6 py-2.5 md:py-3 bg-terracotta-500 text-white rounded-xl font-bold hover:bg-terracotta-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                            >
                                {isSubmitting ? 'Menyimpan...' : (initialData ? 'Update' : 'Tambah')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProductForm;
