'use client';

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Plus, TrendingUp, TrendingDown, LayoutGrid, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import AddSneakerModal from "@/components/portfolio/AddSneakerModal";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import { SneakerAPI } from "@/services/api/sneakerAPI";

interface PortfolioStats {
    totalItems: number;
    totalSpent: number;
    estValue: number | null;
    profitLoss: number | null;
}

export default function PortfolioPage() {
    const { isLoaded, isSignedIn } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [items, setItems] = useState<any[]>([]);
    const [stats, setStats] = useState<PortfolioStats>({ totalItems: 0, totalSpent: 0, estValue: null, profitLoss: null });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [itemsRes, statsRes] = await Promise.all([
                fetch('/api/portfolio'),
                fetch('/api/portfolio/stats')
            ]);

            if (itemsRes.ok) {
                const data = await itemsRes.json();
                setItems(data);

                if (statsRes.ok) {
                    const statsData = await statsRes.json();

                    if (data.length > 0) {
                        const pricePromises = data.map(async (item: any) => {
                            try {
                                const res = await SneakerAPI.getBestDeal(item.sneakerId);
                                return res.bestDeal?.price || item.purchasePrice;
                            } catch (e) {
                                return item.purchasePrice; // Fallback if API fails
                            }
                        });
                        const livePrices = await Promise.all(pricePromises);
                        const currentEstValue = livePrices.reduce((a, b) => a + b, 0);

                        setStats({
                            ...statsData,
                            estValue: currentEstValue,
                            profitLoss: currentEstValue - statsData.totalSpent
                        });
                    } else {
                        setStats({ ...statsData, estValue: 0, profitLoss: 0 });
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch portfolio data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isSignedIn) {
            fetchData();
        }
    }, [isSignedIn, fetchData]);

    const handleDelete = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
        fetchData(); // Refresh stats 
    };

    if (!isLoaded || !isSignedIn) return null;

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Your Portfolio</h1>
                    <p className="text-gray-400">Track the market value of your sneaker collection.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-[#A8FF78] to-[#78FFD6] text-black font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(168,255,120,0.2)]"
                >
                    <Plus size={20} />
                    Add Sneaker
                </button>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                    <h3 className="text-3xl font-display font-bold text-white mb-2">
                        {isLoading ? <Loader2 className="animate-spin text-gray-600" size={24} /> : `$${stats.totalSpent.toFixed(2)}`}
                    </h3>
                </div>
                <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Items</p>
                    <h3 className="text-3xl font-display font-bold text-white">
                        {isLoading ? <Loader2 className="animate-spin text-gray-600" size={24} /> : stats.totalItems}
                    </h3>
                </div>
                <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Est. Value (Live)</p>
                    <h3 className="text-3xl font-display font-bold text-white mb-2">
                        {isLoading || stats.estValue === null ? <Loader2 className="animate-spin text-gray-600" size={24} /> : `$${stats.estValue.toFixed(2)}`}
                    </h3>
                </div>
                <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Profit/Loss</p>
                    <h3 className={`text-3xl font-display font-bold mb-2 ${stats.profitLoss && stats.profitLoss > 0 ? 'text-green-500' : stats.profitLoss && stats.profitLoss < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        {isLoading || stats.profitLoss === null ? <Loader2 className="animate-spin text-gray-600" size={24} /> : `${stats.profitLoss >= 0 ? '+' : '-'}$${Math.abs(stats.profitLoss).toFixed(2)}`}
                    </h3>
                </div>
            </div>

            {/* Grid or Empty State */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-[#78FFD6]" size={48} />
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map(item => (
                        <PortfolioCard key={item.id} item={item} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <div className="bg-[#121212] border border-gray-800 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mb-6">
                        <LayoutGrid className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">Your collection is empty</h3>
                    <p className="text-gray-400 max-w-md mb-8">
                        Start tracking your sneakers to see real-time market values, price charts, and performance analytics.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#1A1A1A] border border-gray-700 hover:border-gray-500 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                    >
                        Search for a Sneaker to Add
                    </button>
                </div>
            )}

            <AddSneakerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdded={fetchData}
            />
        </div>
    );
}
