import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Send, ShoppingBag } from 'lucide-react';
import api from '../../api/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: false });

        try {
            await api.post('/contact', formData);
            setStatus({ loading: false, error: null, success: true });
            setFormData({ name: '', email: '', whatsapp: '', subject: 'General Inquiry', message: '' });
            alert('Pesan berhasil dikirim!'); 
        } catch (error) {
            setStatus({ loading: false, error: 'Gagal mengirim pesan. Silakan coba lagi.', success: false });
            console.error('Contact error:', error);
            alert('Gagal mengirim pesan.');
        }
    };

    return (
        <section id="contact" className="py-24 bg-white dark:bg-deepbrown-900 transition-colors duration-300 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-terracotta-500 font-bold tracking-wider uppercase text-sm">Get in Touch</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-deepbrown-900 dark:text-cream-50 mt-2">
                        We'd Love to <span className="text-gradient">Hear From You</span>
                    </h2>
                    <p className="text-lg text-deepbrown-600 dark:text-cream-200/80 mt-4">
                        Have a question about our flavors? Want to partner with us? Or just want to say hi? Drop us a message!
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/3 space-y-8 bg-cream-50 dark:bg-deepbrown-800 p-8 rounded-3xl h-fit border border-deepbrown-50 dark:border-deepbrown-700"
                    >
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white dark:bg-deepbrown-700 rounded-xl shadow-sm text-terracotta-500">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-deepbrown-900 dark:text-cream-50 text-lg">Our HQ</h3>
                                    <p className="text-deepbrown-600 dark:text-cream-200/80">J5C8G+23F, Jl. Kemasan<br/>Salakan, Potorono, Kec. Banguntapan, Kabupaten Bantul, Daerah Istimewa Yogyakarta</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white dark:bg-deepbrown-700 rounded-xl shadow-sm text-terracotta-500">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-deepbrown-900 dark:text-cream-50 text-lg">Email Us</h3>
                                    <p className="text-deepbrown-600 dark:text-cream-200/80">deepchocubi@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white dark:bg-deepbrown-700 rounded-xl shadow-sm text-terracotta-500">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-deepbrown-900 dark:text-cream-50 text-lg">Call Us</h3>
                                    <p className="text-deepbrown-600 dark:text-cream-200/80"> +6282327009116</p>
                                    <p className="text-deepbrown-600 dark:text-cream-200/80 text-sm opacity-70">order 24 jam  estimasi pengiriman dari jam 8 pagi sampai 10 malam</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-deepbrown-200 dark:border-deepbrown-700">
                            <h3 className="font-bold text-deepbrown-900 dark:text-cream-50 mb-4">Follow Us</h3>
                            <div className="flex space-x-4">
                                <a href="https://www.instagram.com/deepchocubi?igsh=OGliaGliemZmNmt1" target="_blank" rel="noopener noreferrer" className="p-3 bg-deepbrown-900 dark:bg-terracotta-500 text-white rounded-full hover:bg-terracotta-500 dark:hover:bg-terracotta-400 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="https://id.shp.ee/XrrZd8f" target="_blank" rel="noopener noreferrer" className="p-3 bg-deepbrown-900 dark:bg-terracotta-500 text-white rounded-full hover:bg-terracotta-500 dark:hover:bg-terracotta-400 transition-colors group relative" title="Shop on Shopee">
                                    <ShoppingBag className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:w-2/3"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-deepbrown-800 p-8 md:p-10 rounded-[2rem] shadow-xl border border-gray-100 dark:border-deepbrown-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name" 
                                        required
                                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-deepbrown-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-gray-50/50 dark:bg-deepbrown-900 dark:text-cream-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">Email</label>
                                    <input 
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange} 
                                        placeholder="your@email.com"
                                        required 
                                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-deepbrown-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-gray-50/50 dark:bg-deepbrown-900 dark:text-cream-50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">WhatsApp Number</label>
                                    <input 
                                        type="text" 
                                        name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    placeholder="e.g. 08123456789" 
                                    required
                                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-deepbrown-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-gray-50/50 dark:bg-deepbrown-900 dark:text-cream-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">Subject</label>
                                <select 
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-deepbrown-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-gray-50/50 dark:bg-deepbrown-900 text-deepbrown-600 dark:text-cream-50"
                                >
                                    <option>General Inquiry</option>
                                    <option>Wholesale / Partnership</option>
                                    <option>Feedback</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-deepbrown-700 dark:text-cream-200">Message</label>
                                <textarea 
                                    rows="5" 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tell us what's on your mind..." 
                                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-deepbrown-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-gray-50/50 dark:bg-deepbrown-900 dark:text-cream-50 resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={status.loading}
                                className="w-full py-4 bg-gradient-to-r from-deepbrown-900 to-deepbrown-800 dark:from-terracotta-600 dark:to-terracotta-500 text-white font-bold rounded-xl hover:from-terracotta-600 hover:to-terracotta-500 transition-all shadow-lg hover:shadow-terracotta-500/30 flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                <span>{status.loading ? 'Sending...' : 'Send Message'}</span>
                                {!status.loading && <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
