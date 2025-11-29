'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SplineRobot from './SplineRobot';

export default function HeroSection() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const y = useTransform(scrollY, [0, 300], [0, 50]);

    return (
        <section className="relative w-full h-screen overflow-hidden bg-[#e2e2e2]">
            {/* 3D Robot Background */}
            <div className="absolute inset-0 z-0">
                <SplineRobot />
            </div>

            {/* Overlay Content */}
            <motion.div
                style={{ opacity, y }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
            >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl text-center max-w-2xl mx-4 pointer-events-auto">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">
                        Future OS
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8">
                        Interactive 3D Dashboard - Move your cursor to interact
                    </p>
                    <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Enter System
                    </button>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
                <div className="flex flex-col items-center gap-2 text-gray-500">
                    <span className="text-sm uppercase tracking-widest">Scroll</span>
                    <ChevronDown className="w-6 h-6" />
                </div>
            </motion.div>
        </section>
    );
}
