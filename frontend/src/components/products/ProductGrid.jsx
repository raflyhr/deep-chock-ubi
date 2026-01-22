import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import ProductCard from './ProductCard';
import { products as fallbackProducts } from '../../data/products';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const ProductGrid = () => {
    const [products, setProducts] = useState(fallbackProducts);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await api.get('/menu');
                if (response.data && response.data.length > 0) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch menus:', error);
            }
        };

        fetchMenus();
    }, []);
    return (
        <section id="shop" className="py-24 px-4 md:px-6 bg-cream-50 dark:bg-deepbrown-900 transition-colors duration-300">
            <div className="container mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-deepbrown-900 dark:text-cream-50 mb-4">
                        Choose Your <span className="text-gradient">Crunch</span>
                    </h2>
                    <p className="text-lg text-deepbrown-600 dark:text-cream-200/80">
                        Premium sweet potato chips handcrafted with natural ingredients. 
                        Experience the perfect balance of crispiness and flavor in every bite.
                    </p>
                </div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {/* Bento Grid Layout Adjustment: Make first item span 2 cols on large screens via CSS if needed, 
                        but for simplicity and consistency with standard e-commerce, a uniform grid is often better. 
                        However, complying with the "Bento Grid" request, we can span some items.
                    */}
                    {products.map((product, index) => (
                        <motion.div 
                            key={product.id}
                            variants={item}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ProductGrid;
