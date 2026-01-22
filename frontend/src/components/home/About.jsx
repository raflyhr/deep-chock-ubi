import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const About = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section id="about" className="py-24 bg-white dark:bg-deepbrown-900 transition-colors duration-300 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Image Side - Premium Card Style */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2 relative group"
                    >
                        <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-deepbrown-900/10 dark:shadow-none bg-cream-50 dark:bg-deepbrown-800">
                            <div className="absolute inset-0 bg-gradient-to-tr from-terracotta-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <img 
                                src="/images/about-logo.png" 
                                alt="Deep Choc Ubi Logo" 
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                        
                        {/* Floating Glass Stats */}
                        <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-white/80 dark:bg-deepbrown-800/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 dark:border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-terracotta-100 dark:bg-terracotta-900/50 rounded-full text-terracotta-600 dark:text-terracotta-400">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-deepbrown-900 dark:text-cream-50">100%</p>
                                    <p className="text-sm font-bold text-deepbrown-500 dark:text-cream-200/50 uppercase tracking-wider">Organic</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <div className="md:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className="h-px w-8 bg-terracotta-500"></span>
                                <span className="text-terracotta-500 font-bold tracking-widest uppercase text-xs">Our Story</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-deepbrown-900 dark:text-cream-50 leading-tight">
                                Redefining the <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-500 to-yellow-500">Snacking Ritual</span>
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-lg text-deepbrown-600 dark:text-cream-200/80 leading-relaxed font-medium"
                        >
                            <p className="mb-6">
                                Deep Chock Ubi isn't just a snack it's a statement. We believe that indulgence shouldn't cost your health. That's why we've perfected the art of vacuum frying to bring you the crunchiest, sweetest, guilt-free sweet potato chips you've ever tasted.
                            </p>
                            
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-6 pb-2">
                                            <p>
                                                Sourced directly from the lush, volcanic soils of Cisarua, our organic sweet potatoes are hand-picked at peak ripeness. Our proprietary process locks in 90% of the nutrients and 100% of the flavor, using minimal oil and zero artificial additives.
                                            </p>
                                            <p>
                                                Every bag supports local farmers and sustainable agriculture, ensuring that our impact on the community is as positive as our impact on your taste buds.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-deepbrown-200 dark:border-white/10 rounded-full font-bold text-deepbrown-900 dark:text-cream-50 hover:bg-deepbrown-900 hover:text-white dark:hover:bg-terracotta-500 transition-all shadow-lg hover:shadow-xl"
                            >
                                <span>{isExpanded ? 'Read Less' : 'Read Full Story'}</span>
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
