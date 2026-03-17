import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

interface WatchlistItem {
    id: string;
    sneakerId: string;
    sneakerName: string;
    sneakerImage: string;
    sneakerBrand: string;
    colorway: string | null;
}

interface WatchlistCardProps {
    item: WatchlistItem;
    onRemove: (id: string) => void;
    onSetAlert?: () => void;
}

export default function WatchlistCard({ item, onRemove, onSetAlert }: WatchlistCardProps) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to the link
        e.stopPropagation();

        setIsRemoving(true);
        try {
            const res = await fetch(`/api/watchlist/${item.id}`, { method: 'DELETE' });
            if (res.ok) {
                onRemove(item.id);
            }
        } catch (error) {
            console.error('Failed to remove', error);
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative"
        >
            <Link href={`/product/${item.sneakerId}`} className="block">
                <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors h-full flex flex-col">
                    <div className="relative h-48 bg-white p-4">
                        <Image
                            src={item.sneakerImage || '/placeholder-shoe.png'}
                            alt={item.sneakerName}
                            fill
                            className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                        />
                        <button
                            onClick={handleRemove}
                            disabled={isRemoving}
                            title="Remove"
                            className="absolute top-4 right-4 bg-red-500/10 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 disabled:opacity-50 z-10"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">{item.sneakerBrand}</p>
                                <h3 className="text-white font-medium line-clamp-2 mb-2">{item.sneakerName}</h3>
                            </div>
                            {onSetAlert && (
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSetAlert(); }}
                                    className="text-gray-400 hover:text-[#A8FF78] transition-colors p-1"
                                    title="Set Price Alert"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                </button>
                            )}
                        </div>
                        {item.colorway && (
                            <p className="text-gray-500 text-sm mt-auto">{item.colorway}</p>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
