'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export interface Sneaker {
    shoeName: string;
    brand: string;
    styleID?: string;
    retailPrice?: number;
    thumbnail?: string;
    colorway?: string;
    [key: string]: any;
}

interface HeartButtonProps {
    sneaker: Sneaker | any;
    className?: string;
    onToggle?: (isHearted: boolean) => void;
}

export default function HeartButton({ sneaker, className = '', onToggle }: HeartButtonProps) {
    const { isLoaded, isSignedIn } = useUser();
    const [isHearted, setIsHearted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial state
    useEffect(() => {
        const checkStatus = async () => {
            if (!isSignedIn) {
                setIsLoading(false);
                return;
            }

            try {
                // To avoid fetching the whole list, in a real app you might have an endpoint 
                // that checks a specific ID. For now, we'll just fetch the list.
                const res = await fetch('/api/watchlist');
                if (res.ok) {
                    const list = await res.json();
                    const found = list.some((item: any) => item.sneakerId === (sneaker.styleID || sneaker.shoeName));
                    setIsHearted(found);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus();
    }, [isSignedIn, sneaker.styleID, sneaker.shoeName]);

    const toggleHeart = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent linking if wrapped in a Link tag
        e.stopPropagation();

        if (!isSignedIn) {
            // Ideally, open sign-in modal or redirect here
            alert("Please sign in to add to your watchlist.");
            return;
        }

        const sneakerId = sneaker.styleID || sneaker.shoeName;
        const newState = !isHearted;

        // Optimistic UI
        setIsHearted(newState);
        if (onToggle) onToggle(newState);

        try {
            if (newState) {
                // Add
                const res = await fetch('/api/watchlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sneakerId,
                        sneakerName: sneaker.shoeName,
                        sneakerImage: sneaker.thumbnail,
                        sneakerBrand: sneaker.brand,
                        colorway: sneaker.colorway || ''
                    })
                });
                if (res.ok) {
                    toast.success('Added to watchlist');
                } else {
                    toast.error('Failed to add to watchlist');
                    setIsHearted(!newState);
                    if (onToggle) onToggle(!newState);
                }
            } else {
                // Remove (we updated our DELETE to allow deleting by sneakerId)
                const res = await fetch(`/api/watchlist/${sneakerId}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success('Removed from watchlist');
                } else {
                    toast.error('Failed to remove from watchlist');
                    setIsHearted(!newState);
                    if (onToggle) onToggle(!newState);
                }
            }
        } catch (error) {
            console.error('Failed to toggle heart', error);
            toast.error('Network error');
            // Revert on failure
            setIsHearted(!newState);
            if (onToggle) onToggle(!newState);
        }
    };

    if (!isLoaded || isLoading) {
        return (
            <div className={`p-2 rounded-full bg-gray-900/50 backdrop-blur-md border border-gray-800 animate-pulse ${className}`}>
                <Heart size={20} className="text-gray-600" />
            </div>
        );
    }

    return (
        <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={toggleHeart}
            className={`p-2 rounded-full backdrop-blur-md border transition-colors relative group overflow-hidden ${isHearted
                ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                : 'bg-black/40 border-gray-700 hover:border-gray-500 hover:bg-black/60'
                } ${className}`}
        >
            <AnimatePresence>
                {isHearted && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 bg-red-500/20 rounded-full"
                    />
                )}
            </AnimatePresence>
            <Heart
                size={20}
                className={`transition-colors relative z-10 ${isHearted ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
            />
        </motion.button>
    );
}
