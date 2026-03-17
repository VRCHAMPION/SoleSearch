'use client';

import { useUser } from "@clerk/nextjs";
import { Heart, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import WatchlistCard from "@/components/watchlist/WatchlistCard";
import SetAlertModal from "@/components/alerts/SetAlertModal";
import { Sneaker } from "@/types";
import toast from "react-hot-toast";

export default function WatchlistPage() {
    const { isLoaded, isSignedIn } = useUser();

    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [alertItem, setAlertItem] = useState<Sneaker | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/watchlist');
            if (res.ok) {
                setItems(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch watchlist data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isSignedIn) {
            fetchData();
        }
    }, [isSignedIn, fetchData]);

    const handleRemove = async (id: string) => {
        try {
            const res = await fetch(`/api/watchlist/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setItems(prev => prev.filter(item => item.id !== id));
                toast.success('Removed from watchlist');
            } else {
                toast.error('Failed to remove');
            }
        } catch (e) {
            toast.error('Network error');
            console.error(e);
        }
    };

    const handleSetAlert = (item: any) => {
        // Map the WatchlistItem minimal shape to the Sneaker shape expected by modal
        setAlertItem({
            shoeName: item.sneakerName,
            brand: item.sneakerBrand,
            thumbnail: item.sneakerImage,
            styleID: item.sneakerId,
            colorway: item.colorway
        });
    }

    if (!isLoaded || !isSignedIn) return null;

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-display font-bold text-white mb-2">Your Watchlist</h1>
                <p className="text-gray-400">Keep an eye on prices for sneakers you want to buy.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-red-500" size={48} />
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map(item => (
                        <WatchlistCard
                            key={item.id}
                            item={item}
                            onRemove={handleRemove}
                            onSetAlert={() => handleSetAlert(item)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-[#121212] border border-gray-800 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <Heart className="text-red-500" size={32} fill="currentColor" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">No sneakers saved</h3>
                    <p className="text-gray-400 max-w-md mb-8">
                        Click the heart icon on any sneaker across the site to add it to your watchlist and track its price.
                    </p>
                    <Link href="/">
                        <button className="bg-[#1A1A1A] border border-gray-700 hover:border-gray-500 text-white font-medium px-6 py-3 rounded-xl transition-colors">
                            Explore Trending Sneakers
                        </button>
                    </Link>
                </div>
            )}

            {alertItem && (
                <SetAlertModal
                    isOpen={!!alertItem}
                    onClose={() => setAlertItem(null)}
                    sneaker={alertItem}
                />
            )}
        </div>
    );
}
