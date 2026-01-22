import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ProductGrid from '../components/products/ProductGrid';
import Features from '../components/home/Features';
import About from '../components/home/About';
import Contact from '../components/home/Contact';

const Home = () => {
    return (
        <Layout>
            <Hero />
            <Features />
            <ProductGrid />
            <About />
            <Contact />
        </Layout>
    );
};

export default Home;
