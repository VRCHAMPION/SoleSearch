import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface PortfolioItem {
    id: string;
    sneakerId: string;
    sneakerName: string;
    sneakerImage: string;
    sneakerBrand: string;
    colorway: string | null;
    size: string;
    purchasePrice: number;
    purchaseDate: string;
}

interface PortfolioCardProps {
    item: PortfolioItem;
    onDelete: (id: string) => void;
}

export default function PortfolioCard({ item, onDelete }: PortfolioCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    // In a fully featured version, we'd fetch the LIVE price here.
    // For now, we mock the current market price as a random fluctuation from purchase price 
    // to demonstrate the UI (as the aggregation API check per-item might be slow/rate-limited).
    const mockCurrentPrice = item.purchasePrice * (1 + (Math.random() * 0.4 - 0.1)); // -10% to +30%
    const profitLoss = mockCurrentPrice - item.purchasePrice;
    const isProfit = profitLoss >= 0;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to remove this from your portfolio?')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/portfolio/${item.id}`, { method: 'DELETE' });
            if (res.ok) {
                onDelete(item.id);
                toast.success('Removed from portfolio');
            } else {
                toast.error('Failed to remove');
            }
        } catch (error) {
            console.error('Failed to delete', error);
            toast.error('Network error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden group hover:border-gray-700 transition-colors"
        >
            <div className="relative h-48 bg-white p-4">
                <Image
                    src={item.sneakerImage || '/placeholder-shoe.png'}
                    alt={item.sneakerName}
                    fill
                    className="object-contain p-4 mix-blend-multiply"
                />
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 bg-red-500/10 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 disabled:opacity-50"
                >
                    <Trash2 size={18} />
                </button>
            </div>
            <div className="p-5">
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">{item.sneakerBrand}</p>
                <h3 className="text-white font-medium line-clamp-1 mb-1">{item.sneakerName}</h3>
                <p className="text-gray-500 text-sm mb-4">Size: {item.size} {item.colorway ? ` • ${item.colorway}` : ''}</p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                    <div>
                        <p className="text-gray-500 text-xs mb-1">Purchase Price</p>
                        <p className="text-white font-medium">${item.purchasePrice.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs mb-1">Est. Value (Mock)</p>
                        <div className="flex items-center gap-2">
                            <p className="text-white font-medium">${mockCurrentPrice.toFixed(2)}</p>
                            <span className={`flex items-center text-xs font-medium ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                {isProfit ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                                {Math.abs(profitLoss).toFixed(0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
