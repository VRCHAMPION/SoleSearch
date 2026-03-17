'use client';

export default function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`card p-0 ${className}`} style={{ overflow: 'hidden' }}>
            <div className="skeleton" style={{ width: '100%', height: 220 }} />
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="skeleton" style={{ width: '60%', height: 14 }} />
                <div className="skeleton" style={{ width: '85%', height: 18 }} />
                <div className="skeleton" style={{ width: '40%', height: 14 }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <div className="skeleton" style={{ width: 60, height: 24, borderRadius: 20 }} />
                    <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 20 }} />
                </div>
            </div>
        </div>
    );
}
