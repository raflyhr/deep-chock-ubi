import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Wallet } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handlePayment = async () => {
        if (!selectedMethod) return;
        
        setIsProcessing(true);
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsProcessing(false);
        clearCart();
        alert("Payment Successful! Thank you for your order.");
        navigate('/');
    };

    const paymentMethods = [
        { id: 'dana', name: 'Dana', icon: Wallet, description: 'Bayar dengan Dana' },
        { id: 'gopay', name: 'GoPay', icon: Wallet, description: 'Bayar dengan GoPay' },
        { id: 'ovo', name: 'OVO', icon: Wallet, description: 'Bayar dengan OVO' },
        { id: 'shopeepay', name: 'ShopeePay', icon: Wallet, description: 'Bayar dengan ShopeePay' },
    ];

    return (
        <Layout>
            <div className="container mx-auto px-6 py-10">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-deepbrown-900 dark:text-cream-50 mb-8 text-center">Payment Method</h1>

                    <div className="bg-white dark:bg-deepbrown-800 p-8 rounded-3xl shadow-lg border border-deepbrown-50 dark:border-deepbrown-700">
                        <div className="text-center mb-8">
                            <p className="text-deepbrown-500 dark:text-cream-200/60 mb-2">Total Amount to Pay</p>
                            <p className="text-4xl font-bold text-terracotta-600 dark:text-terracotta-400">{formatPrice(cartTotal + 15000)}</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                const isSelected = selectedMethod === method.id;
                                
                                return (
                                    <div 
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-4 hover:shadow-xl hover:scale-105 hover:-translate-y-1 ${
                                            isSelected 
                                            ? 'border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-900/20' 
                                            : 'border-transparent bg-gray-50 dark:bg-deepbrown-900/50 hover:bg-gray-100 dark:hover:bg-deepbrown-700'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-full ${isSelected ? 'bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-600 dark:text-terracotta-400' : 'bg-white dark:bg-deepbrown-700 text-gray-500 dark:text-gray-400'}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-bold ${isSelected ? 'text-deepbrown-900 dark:text-cream-50' : 'text-gray-700 dark:text-cream-200/70'}`}>{method.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-cream-400">{method.description}</p>
                                        </div>
                                        {isSelected && (
                                            <motion.div 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="bg-terracotta-500 text-white p-1 rounded-full"
                                            >
                                                <Check className="w-4 h-4" />
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={!selectedMethod || isProcessing}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                                !selectedMethod || isProcessing
                                ? 'bg-gray-300 dark:bg-deepbrown-700 cursor-not-allowed opacity-50'
                                : 'bg-deepbrown-900 dark:bg-terracotta-600 hover:bg-terracotta-500 shadow-lg'
                            }`}
                        >
                            {isProcessing ? 'Processing...' : `Pay ${formatPrice(cartTotal + 15000)}`}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Payment;
