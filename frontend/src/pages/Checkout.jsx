import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import api from '../api/api';

const schema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(10, "Address is too short"),
    city: z.string().min(2, "City is required"),
    zipCode: z.string().min(5, "Invalid zip code"),
    paymentMethod: z.enum(["dana", "gopay", "ovo", "shopeepay"], {
        required_error: "Please select a payment method",
    }),
});

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = React.useState(false);
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        setIsProcessing(true);
        try {
            // Prepare order data
            const orderData = {
                customer_name: data.fullName,
                customer_email: data.email,
                customer_phone: data.phone,
                customer_address: `${data.address}, ${data.city}, ${data.zipCode}`,
                payment_method: data.paymentMethod,
                items: cartItems.map(item => ({
                    menu_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: cartTotal + 15000 // Include shipping
            };

            // Submit order to backend
            const response = await api.post('/order-buat', orderData);
            const { order_code, whatsapp_url } = response.data;

            // Clear cart and navigate to order status
            clearCart();
            
            // Open WhatsApp in new tab
            if (whatsapp_url) {
                window.open(whatsapp_url, '_blank');
            }
            
            navigate(`/order-status/${order_code}`, { state: { whatsapp_url } });
        } catch (error) {
            console.error('Order failed:', error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Gagal membuat pesanan. Silakan coba lagi.';
            alert(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <Layout>
                <div className="container mx-auto px-6 py-20 text-center">
                    <h2 className="text-2xl font-bold text-deepbrown-900 dark:text-cream-100 mb-4">Your cart is empty</h2>
                    <button 
                        onClick={() => navigate('/')}
                        className="text-terracotta-500 hover:underline dark:text-terracotta-400"
                    >
                        Return to Shop
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-deepbrown-900 dark:text-cream-50 mb-8">Checkout</h1>
                
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Shipping Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:w-2/3"
                    >
                        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="bg-white dark:bg-deepbrown-800 p-8 rounded-2xl shadow-sm border border-deepbrown-50 dark:border-deepbrown-700">
                                <h2 className="text-xl font-bold text-deepbrown-900 dark:text-cream-50 mb-6">Shipping Information</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">Full Name</label>
                                        <input 
                                            {...register("fullName")}
                                            className="w-full p-3 rounded-lg border border-deepbrown-200 dark:border-deepbrown-700 dark:bg-deepbrown-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-colors"
                                            placeholder="John Doe"
                                        />
                                        {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">Email</label>
                                        <input 
                                            {...register("email")}
                                            className="w-full p-3 rounded-lg border border-deepbrown-200 dark:border-deepbrown-700 dark:bg-deepbrown-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-colors"
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">Phone</label>
                                        <input 
                                            {...register("phone")}
                                            className="w-full p-3 rounded-lg border border-deepbrown-200 dark:border-deepbrown-700 dark:bg-deepbrown-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-colors"
                                            placeholder="08123456789"
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">City</label>
                                        <input 
                                            {...register("city")}
                                            className="w-full p-3 rounded-lg border border-deepbrown-200 dark:border-deepbrown-700 dark:bg-deepbrown-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-colors"
                                            placeholder="Jakarta Selatan"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                                    </div>
                                    
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">Address</label>
                                        <textarea 
                                            {...register("address")}
                                            className="w-full p-3 rounded-lg border border-deepbrown-200 dark:border-deepbrown-700 dark:bg-deepbrown-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-colors h-24"
                                            placeholder="Complete full address..."
                                        />
                                        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">Zip Code</label>
                                        <input 
                                            {...register("zipCode")}
                                            className="w-full p-3 rounded-lg border border-deepbrown-200 dark:border-deepbrown-700 dark:bg-deepbrown-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-colors"
                                            placeholder="12345"
                                        />
                                        {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white dark:bg-deepbrown-800 p-8 rounded-2xl shadow-sm border border-deepbrown-50 dark:border-deepbrown-700">
                                <h2 className="text-xl font-bold text-deepbrown-900 dark:text-cream-50 mb-6">Payment Method</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${errors.paymentMethod ? 'border-red-500' : 'border-deepbrown-100 dark:border-deepbrown-700'} hover:border-terracotta-500 hover:shadow-lg hover:scale-105 hover:-translate-y-1`}>
                                        <input 
                                            type="radio"
                                            {...register("paymentMethod")}
                                            value="dana"
                                            className="w-4 h-4 text-terracotta-500 border-gray-300 focus:ring-terracotta-500"
                                        />
                                        <div className="ml-4">
                                            <p className="font-bold text-deepbrown-900 dark:text-cream-50">Dana</p>
                                            <p className="text-xs text-deepbrown-500 dark:text-cream-200/60 text-wrap whitespace-normal">Bayar dengan Dana</p>
                                        </div>
                                    </label>

                                    <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${errors.paymentMethod ? 'border-red-500' : 'border-deepbrown-100 dark:border-deepbrown-700'} hover:border-terracotta-500 hover:shadow-lg hover:scale-105 hover:-translate-y-1`}>
                                        <input 
                                            type="radio"
                                            {...register("paymentMethod")}
                                            value="gopay"
                                            className="w-4 h-4 text-terracotta-500 border-gray-300 focus:ring-terracotta-500"
                                        />
                                        <div className="ml-4">
                                            <p className="font-bold text-deepbrown-900 dark:text-cream-50">GoPay</p>
                                            <p className="text-xs text-deepbrown-500 dark:text-cream-200/60 text-wrap whitespace-normal">Bayar dengan GoPay</p>
                                        </div>
                                    </label>

                                    <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${errors.paymentMethod ? 'border-red-500' : 'border-deepbrown-100 dark:border-deepbrown-700'} hover:border-terracotta-500 hover:shadow-lg hover:scale-105 hover:-translate-y-1`}>
                                        <input 
                                            type="radio"
                                            {...register("paymentMethod")}
                                            value="ovo"
                                            className="w-4 h-4 text-terracotta-500 border-gray-300 focus:ring-terracotta-500"
                                        />
                                        <div className="ml-4">
                                            <p className="font-bold text-deepbrown-900 dark:text-cream-50">OVO</p>
                                            <p className="text-xs text-deepbrown-500 dark:text-cream-200/60 text-wrap whitespace-normal">Bayar dengan OVO</p>
                                        </div>
                                    </label>

                                    <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${errors.paymentMethod ? 'border-red-500' : 'border-deepbrown-100 dark:border-deepbrown-700'} hover:border-terracotta-500 hover:shadow-lg hover:scale-105 hover:-translate-y-1`}>
                                        <input 
                                            type="radio"
                                            {...register("paymentMethod")}
                                            value="shopeepay"
                                            className="w-4 h-4 text-terracotta-500 border-gray-300 focus:ring-terracotta-500"
                                        />
                                        <div className="ml-4">
                                            <p className="font-bold text-deepbrown-900 dark:text-cream-50">ShopeePay</p>
                                            <p className="text-xs text-deepbrown-500 dark:text-cream-200/60 text-wrap whitespace-normal">Bayar dengan ShopeePay</p>
                                        </div>
                                    </label>
                                </div>
                                {errors.paymentMethod && <p className="text-red-500 text-xs mt-2">{errors.paymentMethod.message}</p>}
                            </div>
                        </form>
                    </motion.div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white dark:bg-deepbrown-800 p-6 rounded-2xl shadow-sm border border-deepbrown-50 dark:border-deepbrown-700 sticky top-24">
                            <h2 className="text-xl font-bold text-deepbrown-900 dark:text-cream-50 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-deepbrown-900 dark:text-cream-100">{item.name}</p>
                                            <p className="text-sm text-deepbrown-500 dark:text-cream-200/60">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-deepbrown-900 dark:text-cream-100">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-deepbrown-100 dark:border-deepbrown-700 pt-4 space-y-2">
                                <div className="flex justify-between text-deepbrown-600 dark:text-cream-200">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-deepbrown-600 dark:text-cream-200">
                                    <span>Shipping</span>
                                    <span>Rp 15.000</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-deepbrown-900 dark:text-cream-50 pt-2 border-t border-deepbrown-100 dark:border-deepbrown-700 mt-2">
                                    <span>Total</span>
                                    <span>{formatPrice(cartTotal + 15000)}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full mt-8 py-4 bg-terracotta-500 dark:bg-terracotta-600 text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-terracotta-600 dark:hover:bg-terracotta-500'}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Checkout;
