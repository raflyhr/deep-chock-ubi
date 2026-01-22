import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

import ubiCoklat from '../../assets/images/ubi-coklat.jpg';

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-cream-50 dark:bg-deepbrown-900 transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-terracotta-50 dark:bg-deepbrown-800/50 rounded-l-[100px] z-0 transition-colors duration-300" />
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-yellow-200 dark:bg-terracotta-900/30 rounded-full blur-3xl opacity-30 animate-pulse" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center">
                    {/* Text Content */}
                    <div className="md:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-2 rounded-full bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-600 dark:text-terracotta-400 font-bold tracking-wider text-sm mb-4 border border-transparent dark:border-terracotta-800">
                                PREMIUM SNACK
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-deepbrown-900 dark:text-cream-50 leading-tight">
                                Crispy <br />
                                Healthy <br />
                                <span className="text-gradient">Addictive</span>
                            </h1>
                        </motion.div>
 
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg text-deepbrown-600 dark:text-cream-200/80 max-w-md"
                        >
                            Made from 100% organic sweet potatoes, vacuum fried to perfection for that ultimate crunch without the guilt.
                        </motion.p>
 
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center space-x-4"
                        >
                            <a 
                                href="#shop"
                                className="group bg-deepbrown-900 dark:bg-terracotta-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-2 hover:bg-terracotta-500 dark:hover:bg-terracotta-500 transition-all shadow-xl hover:shadow-terracotta-500/30"
                            >
                                <span>Order Now</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </motion.div>
                    </div>
 
                    {/* Hero Image */}
                    <div className="md:w-1/2 mt-12 md:mt-0 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                delay: 0.2 
                            }}
                            className="relative z-10"
                        >
                            {/* Placeholder for Hero Image - In real app, this would be a high-res transparent PNG */}
                            <div className="w-full aspect-square relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-linear-to-tr from-terracotta-400 to-yellow-400 dark:from-terracotta-800 dark:to-yellow-700/50 rounded-full blur-[100px] opacity-20" />
                                <img 
                                    src={ubiCoklat} 
                                    alt="Deep Chock Ubi Premium" 
                                    className="w-[80%] rounded-3xl object-cover aspect-square drop-shadow-2xl z-20 hover:scale-105 transition-transform duration-500 cursor-pointer"
                                />
                                
                                {/* Floating Elements */}
                                <motion.div 
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="absolute top-10 right-10 bg-white dark:bg-deepbrown-800 p-4 rounded-2xl shadow-lg z-30 border border-transparent dark:border-deepbrown-700"
                                >
                                    <span className="text-2xl">🍠</span>
                                </motion.div>
                                <motion.div 
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-20 left-10 bg-white dark:bg-deepbrown-800 p-4 rounded-2xl shadow-lg z-30 border border-transparent dark:border-deepbrown-700"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                                        <span className="font-bold text-xs dark:text-cream-100">100% Organic</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
