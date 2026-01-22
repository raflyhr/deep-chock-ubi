import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-cream-50 dark:bg-deepbrown-900 z-[70] shadow-2xl flex flex-col border-l border-deepbrown-50 dark:border-deepbrown-800"
                    >
                        {/* Header */}
                        <div className="p-5 flex items-center justify-between border-b border-deepbrown-100 dark:border-deepbrown-800 bg-white/50 dark:bg-deepbrown-900/50 backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                                <ShoppingBag className="w-6 h-6 text-terracotta-500" />
                                <h2 className="text-xl font-bold text-deepbrown-900 dark:text-cream-50">Your Cart</h2>
                                <span className="bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-600 dark:text-terracotta-400 px-2 py-1 rounded-full text-xs font-bold">
                                    {cartCount} items
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-deepbrown-700 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-deepbrown-400 space-y-4">
                                    <div className="p-6 bg-cream-100 dark:bg-deepbrown-800 rounded-full">
                                        <ShoppingBag className="w-16 h-16 opacity-20 dark:opacity-40 text-deepbrown-900 dark:text-cream-100" />
                                    </div>
                                    <p className="font-medium text-deepbrown-900 dark:text-cream-100">Your cart is empty</p>
                                    <button 
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-terracotta-500 font-bold hover:underline"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex gap-4 p-4 bg-white dark:bg-deepbrown-800 rounded-xl shadow-sm border border-deepbrown-50 dark:border-deepbrown-700"
                                    >
                                        <div className={`w-20 h-20 rounded-lg flex items-center justify-center ${item.color} bg-opacity-20 shrink-0`}>
                                            <img 
                                                src={item.image_url || item.image} 
                                                alt={item.name} 
                                                className="w-16 h-16 object-cover rounded-lg drop-shadow-md" 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://placehold.co/100x100/png?text=Error";
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-deepbrown-900 dark:text-cream-50">{item.name}</h3>
                                                <p className="text-sm text-deepbrown-500 dark:text-cream-200/60 mb-2">{formatPrice(item.price)}</p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3 bg-gray-50 dark:bg-deepbrown-700 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-white dark:hover:bg-deepbrown-600 hover:shadow-sm rounded transition-all text-deepbrown-700 dark:text-cream-100 disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center text-deepbrown-900 dark:text-cream-50">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-white dark:hover:bg-deepbrown-600 hover:shadow-sm rounded transition-all text-deepbrown-700 dark:text-cream-100"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 bg-white dark:bg-deepbrown-900 border-t border-deepbrown-100 dark:border-deepbrown-800 space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold text-deepbrown-900 dark:text-cream-50">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-gradient-to-r from-terracotta-500 to-terracotta-600 dark:from-terracotta-600 dark:to-terracotta-700 text-white font-bold rounded-xl shadow-lg shadow-terracotta-500/25 hover:shadow-terracotta-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
