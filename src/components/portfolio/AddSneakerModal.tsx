import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useSneakerSearch } from '@/hooks/useSneakerSearch';
import { Sneaker } from '@/types';

interface AddSneakerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdded: () => void;
}

export default function AddSneakerModal({ isOpen, onClose, onAdded }: AddSneakerModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const { results, isSearching, searchSneakers } = useSneakerSearch();
    const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(null);

    // Form state
    const [size, setSize] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const searchTimeout = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (searchQuery.length >= 3) {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
            searchTimeout.current = setTimeout(() => {
                searchSneakers(searchQuery);
            }, 500);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (!isOpen) {
            // Reset when closed
            setStep(1);
            setSearchQuery('');
            setSelectedSneaker(null);
            setSize('');
            setPurchasePrice('');
            setPurchaseDate(new Date().toISOString().split('T')[0]);
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!selectedSneaker || !size || !purchasePrice || !purchaseDate) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sneakerId: selectedSneaker.styleID || selectedSneaker.shoeName,
                    sneakerName: selectedSneaker.shoeName,
                    sneakerImage: selectedSneaker.thumbnail,
                    sneakerBrand: selectedSneaker.brand,
                    colorway: selectedSneaker.colorway || '',
                    size,
                    purchasePrice: parseFloat(purchasePrice),
                    purchaseDate
                })
            });

            if (!res.ok) {
                throw new Error('Failed to add to portfolio');
            }

            onAdded();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-800">
                        <h2 className="text-2xl font-display font-bold text-white">
                            {step === 1 ? 'Find Sneaker' : 'Add Details'}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto flex-1">
                        {error && (
                            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {step === 1 ? (
                            <div className="space-y-6">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, brand, or SKU..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#78FFD6] focus:ring-1 focus:ring-[#78FFD6] transition-all"
                                    />
                                </div>

                                <div className="min-h-[300px]">
                                    {isSearching ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 mt-20">
                                            <Loader2 className="animate-spin" size={32} />
                                            <p>Searching sneakers...</p>
                                        </div>
                                    ) : results.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {results.map((sneaker) => (
                                                <div
                                                    key={sneaker.styleID || sneaker.shoeName}
                                                    onClick={() => {
                                                        setSelectedSneaker(sneaker);
                                                        setStep(2);
                                                    }}
                                                    className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 flex gap-4 cursor-pointer hover:border-[#78FFD6]/50 hover:bg-gray-800/50 transition-all group"
                                                >
                                                    <div className="relative w-20 h-20 bg-white rounded-lg p-2 flex-shrink-0">
                                                        <Image
                                                            src={sneaker.thumbnail || '/placeholder-shoe.png'}
                                                            alt={sneaker.shoeName}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-center overflow-hidden">
                                                        <p className="text-gray-400 text-xs mb-1 truncate">{sneaker.brand}</p>
                                                        <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-[#78FFD6] transition-colors">{sneaker.shoeName}</h4>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : searchQuery.length >= 3 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-20">
                                            <p>No sneakers found for "{searchQuery}"</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-20">
                                            <Search className="mb-4 opacity-50" size={48} />
                                            <p>Type at least 3 characters to search</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            selectedSneaker && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex gap-6 items-center bg-[#1A1A1A] p-4 rounded-2xl border border-gray-800">
                                        <div className="relative w-24 h-24 bg-white rounded-xl p-2 flex-shrink-0">
                                            <Image
                                                src={selectedSneaker.thumbnail || '/placeholder-shoe.png'}
                                                alt={selectedSneaker.shoeName}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm mb-1">{selectedSneaker.brand}</p>
                                            <h3 className="text-white font-display font-medium text-lg leading-tight">{selectedSneaker.shoeName}</h3>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-[#78FFD6] text-sm mt-2 hover:underline"
                                            >
                                                Change Sneaker
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Size (US)</label>
                                            <input
                                                type="text"
                                                required
                                                value={size}
                                                onChange={(e) => setSize(e.target.value)}
                                                placeholder="e.g. 10.5"
                                                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-[#78FFD6] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Purchase Price ($)</label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={purchasePrice}
                                                onChange={(e) => setPurchasePrice(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-[#78FFD6] transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Purchase Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={purchaseDate}
                                            onChange={(e) => setPurchaseDate(e.target.value)}
                                            className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-[#78FFD6] transition-colors"
                                        />
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 py-4 rounded-xl border border-gray-700 text-white font-medium hover:bg-gray-800 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 py-4 rounded-xl font-medium bg-gradient-to-r from-[#A8FF78] to-[#78FFD6] text-black hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Add to Portfolio'}
                                        </button>
                                    </div>
                                </form>
                            )
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
