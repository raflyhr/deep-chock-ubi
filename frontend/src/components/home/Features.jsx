import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
    const features = [
        {
            icon: "🌿",
            title: "100% Natural",
            description: "No preservatives, just pure sweet potato goodness.",
            bg: "bg-terracotta-50 dark:bg-terracotta-900/20",
            border: "border-transparent dark:border-terracotta-900/50"
        },
        {
            icon: "🔥",
            title: "Vacuum Fried",
            description: "Locked in nutrients and natural sweetness with less oil.",
            bg: "bg-cream-100 dark:bg-deepbrown-800/50",
            border: "border-transparent dark:border-deepbrown-700"
        },
        {
            icon: "✨",
            title: "Premium Quality",
            description: "Handpicked organic sweet potatoes from local farmers.",
            bg: "bg-deepbrown-50 dark:bg-deepbrown-900/50",
            border: "border-transparent dark:border-deepbrown-800"
        }
    ];

    return (
        <section className="py-24 bg-white dark:bg-deepbrown-900 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`p-8 rounded-2xl text-center border ${feature.bg} ${feature.border} hover:transform hover:scale-105 transition-all duration-300`}
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-deepbrown-900 dark:text-cream-50 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-deepbrown-600 dark:text-cream-200/70">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
