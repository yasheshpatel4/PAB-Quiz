import React from 'react';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ArrowUp,
    Globe,
    Heart
} from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Top Wave SVG */}
            <div className="w-full">
                <svg className="w-full h-12 fill-current text-gray-100" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0l48 8.9C96 17.8 192 35.6 288 48.9 384 62.2 480 71.1 576 71.1s192-8.9 288-22.2C960 35.6 1056 17.8 1152 8.9 1248 0 1344 0 1392 0h48v120H0V0z" />
                </svg>
            </div>

            <div className="container mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold mb-6 text-blue-400">Company Name</h3>
                        <p className="text-gray-300">
                            Creating innovative solutions for tomorrow's challenges. Join us in building the future.
                        </p>
                        <div className="flex space-x-4">
                            <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-300" />
                            <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-300" />
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-300" />
                            <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-300" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-blue-400">Quick Links</h3>
                        <ul className="space-y-3">
                            {['About Us', 'Services', 'Products', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                                            {item}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-blue-400">Contact Us</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-300">
                                <MapPin className="w-5 h-5 text-blue-400" />
                                <span>123 Innovation Street, Tech City, 12345</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Phone className="w-5 h-5 text-blue-400" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Mail className="w-5 h-5 text-blue-400" />
                                <span>contact@company.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Globe className="w-5 h-5 text-blue-400" />
                                <span>www.company.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-blue-400">Newsletter</h3>
                        <p className="text-gray-300 mb-4">Subscribe to our newsletter for updates and insights.</p>
                        <div className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scroll to Top Button */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={scrollToTop}
                        className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-colors duration-300 group"
                    >
                        <ArrowUp className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300" />
                    </button>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Company Name. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm text-gray-400">
                            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</a>
                            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Cookie Policy</a>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> by Our Team
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;