import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cn, formatPrice } from '../../lib/utils';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    
    // Fallbacks for fields not in user schema
    const bgColor = product.color || "bg-terracotta-500";
    const textColor = product.textColor || "text-white";
    const flavorText = product.flavor || "Ubi Crunch";

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group relative bg-white dark:bg-deepbrown-800 rounded-[2.5rem] p-3 shadow-sm hover:shadow-2xl transition-all duration-500 border border-deepbrown-50 dark:border-deepbrown-700 overflow-hidden flex flex-col min-h-[500px]"
        >
            {/* Background Blob */}
            <div className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 transition-transform duration-700 group-hover:scale-150",
                bgColor
            )} />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full flex-1">
                {/* Image Container - Maximized & Centered */}
                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-cream-50 dark:bg-deepbrown-900/50 flex items-center justify-center group-hover:shadow-inner transition-all duration-500">
                    <motion.img
                        initial={{ scale: 0.95 }}
                        whileHover={product.stock > 0 ? { scale: 1.1, rotate: 2 } : {}}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        src={product.image_url || product.image || "https://placehold.co/400x400/png?text=No+Image"}
                        alt={product.name}
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://placehold.co/400x400/png?text=Image+Error";
                        }}
                        className={cn(
                            "w-56 h-56 object-cover drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                            (product.stock <= 0 || !product.is_available) && "grayscale opacity-50"
                        )}
                    />
                    
                    {/* Flavor Tag Overlay */}
                    <div className="absolute top-4 left-4">
                        <span className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg",
                            bgColor,
                            textColor
                        )}>
                            {flavorText}
                        </span>
                    </div>

                    {/* Sold Out Overlay */}
                    {(product.stock <= 0 || !product.is_available) && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <span className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                                {product.is_available === false ? 'Not Available' : 'Sold Out'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Info - Refined Padding */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-4 flex-1">
                        <h3 className="text-2xl font-black text-deepbrown-900 dark:text-cream-50 mb-2 tracking-tight">{product.name}</h3>
                        <p className="text-sm text-deepbrown-500 dark:text-cream-200/60 font-medium line-clamp-2 leading-relaxed">{product.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-2xl font-black text-deepbrown-900 dark:text-cream-50">
                            {formatPrice(product.price)}
                        </span>
                        
                        <button
                            onClick={() => product.stock > 0 && product.is_available && addToCart(product)}
                            disabled={product.stock <= 0 || !product.is_available}
                            className={cn(
                                "p-4 rounded-2xl transition-all shadow-xl active:scale-90 group-hover:rotate-6",
                                (product.stock <= 0 || !product.is_available) 
                                    ? "bg-deepbrown-200 dark:bg-deepbrown-700 text-deepbrown-400 cursor-not-allowed shadow-none" 
                                    : "bg-deepbrown-900 dark:bg-terracotta-500 text-white hover:bg-terracotta-500 dark:hover:bg-terracotta-400"
                            )}
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
