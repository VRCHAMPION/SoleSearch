'use client';

import { useUser, SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { LogOut, Save, Ruler, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [savedSize, setSavedSize] = useState<string>("10.5");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isSignedIn) {
                try {
                    const res = await fetch('/api/user');
                    if (res.ok) {
                        const data = await res.json();
                        if (data.shoeSize) {
                            setSavedSize(data.shoeSize);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                } finally {
                    setIsLoadingInitial(false);
                }
            }
        };
        fetchUserData();
    }, [isSignedIn]);

    if (!isLoaded || !isSignedIn) {
        return null; // Let middleware handle redirection
    }

    const sizes = ["4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "14", "15", "16"];

    const handleSaveSize = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shoeSize: savedSize }),
            });
            if (!res.ok) {
                toast.error("Failed to save size");
                console.error("Failed to save size");
            } else {
                toast.success(`Size US ${savedSize} saved!`);
            }
        } catch (error) {
            toast.error("Network error saving size");
            console.error("API error", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <div className="flex items-end gap-6 border-b border-gray-800 pb-8">
                    <img
                        src={user.imageUrl}
                        alt={user.fullName || "User"}
                        className="w-24 h-24 rounded-full border-2 border-gray-800"
                    />
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">
                            {user.fullName || "Sneakerhead"}
                        </h1>
                        <p className="text-gray-400 font-mono text-sm">
                            {user.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {/* Size Preferences */}
                    <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Ruler className="text-[#A8FF78]" size={24} />
                            <h2 className="text-xl font-display font-semibold text-white">Size Preferences</h2>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">
                            Save your sneaker size and we'll automatically filter prices across all marketplaces to find deals that fit you.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">US Men's Size</label>
                                <select
                                    value={savedSize}
                                    onChange={(e) => setSavedSize(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#A8FF78] focus:ring-1 focus:ring-[#A8FF78] transition-all"
                                >
                                    {sizes.map(size => (
                                        <option key={size} value={size}>US {size}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleSaveSize}
                                disabled={isSaving}
                                className="w-full mt-4 bg-gradient-to-r from-[#1A1A1A] to-[#222222] border border-gray-700 hover:border-gray-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                {isSaving ? (
                                    <span className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Size Preference
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <UserIcon className="text-[#A8FF78]" size={24} />
                            <h2 className="text-xl font-display font-semibold text-white">Account</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-[#1A1A1A] rounded-xl border border-gray-800">
                                <p className="text-sm text-gray-400 mb-1">Account Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-white font-medium">Active</span>
                                </div>
                            </div>

                            <SignOutButton>
                                <button className="w-full mt-8 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </SignOutButton>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
