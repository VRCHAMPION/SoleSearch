'use client';

import React from 'react';

type BadgeVariant = 'best' | 'drop' | 'new' | 'sold' | 'deadstock';

interface BadgeProps {
    variant: BadgeVariant;
    children: React.ReactNode;
    pulse?: boolean;
    className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
    best: 'badge-best',
    drop: 'badge-drop',
    new: 'badge-new',
    sold: 'badge-sold',
    deadstock: 'badge-ds',
};

export default function Badge({ variant, children, pulse = false, className = '' }: BadgeProps) {
    return (
        <span className={`badge ${variantMap[variant]} ${pulse ? 'badge-pulse' : ''} ${className}`}>
            {children}
        </span>
    );
}
