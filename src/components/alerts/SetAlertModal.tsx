import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, DollarSign, Loader2 } from 'lucide-react';
import { Sneaker } from '@/types';
import Image from 'next/image';

interface SetAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    sneaker: Sneaker;
    onSuccess?: () => void;
}

export default function SetAlertModal({ isOpen, onClose, sneaker, onSuccess }: SetAlertModalProps) {
    const [targetPrice, setTargetPrice] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const price = parseFloat(targetPrice);
        if (isNaN(price) || price <= 0) {
            setError("Please enter a valid price");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sneakerId: sneaker.styleID || sneaker.shoeName,
                    sneakerName: sneaker.shoeName,
                    sneakerImage: sneaker.thumbnail,
                    targetPrice: price,
                    currentPrice: sneaker.retailPrice // We'll store what we think the current price is
                }),
            });

            if (!res.ok) {
                const data = await res.text();
                throw new Error(data || "Failed to set alert");
            }

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setTargetPrice('');
                onClose();
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-8"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-8"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-[#121212] border border-gray-800 p-6 text-left align-middle shadow-2xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title as="h3" className="text-xl font-display font-bold text-white flex items-center gap-2">
                                        <Bell className="text-[#A8FF78]" size={20} />
                                        Set Price Alert
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {isSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 flex flex-col items-center justify-center text-center"
                                    >
                                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-400">
                                            <Bell size={32} />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">Alert Saved!</h4>
                                        <p className="text-gray-400">We'll email you if the price drops below ${targetPrice}.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="flex bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 gap-4 items-center">
                                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2 relative shrink-0">
                                                {sneaker.thumbnail ? (
                                                    <Image src={sneaker.thumbnail} alt={sneaker.shoeName} fill className="object-contain p-2" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">{sneaker.brand}</p>
                                                <p className="text-white font-medium line-clamp-2 text-sm">{sneaker.shoeName}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Target Drop Price
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <DollarSign className="text-gray-500" size={20} />
                                                </div>
                                                <input
                                                    type="number"
                                                    value={targetPrice}
                                                    onChange={(e) => setTargetPrice(e.target.value)}
                                                    placeholder="E.g. 150"
                                                    disabled={isLoading}
                                                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A8FF78]/50 focus:border-[#A8FF78] transition-all"
                                                    required
                                                    min="1"
                                                    step="any"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                You will receive an email when any size drops below this price.
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg">
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading || !targetPrice}
                                            className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Set Alert'}
                                        </button>
                                    </form>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
