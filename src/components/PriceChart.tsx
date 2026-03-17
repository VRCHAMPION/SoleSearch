'use client';

import type { PricePoint } from '@/services/api/types';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

interface PriceChartProps {
    data: PricePoint[];
    height?: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
            >
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
                <div
                    className="font-mono"
                    style={{ fontSize: 16, fontWeight: 600, color: 'var(--success)' }}
                >
                    ${payload[0].value}
                </div>
            </div>
        );
    }
    return null;
};

export default function PriceChart({ data, height = 280 }: PriceChartProps) {
    const formatDate = (date: string) => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    };

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#32D74B" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#32D74B" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        stroke="var(--text-secondary)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--border)' }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        stroke="var(--text-secondary)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v: number) => `$${v}`}
                        width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#32D74B"
                        strokeWidth={2}
                        fill="url(#priceGradient)"
                        dot={false}
                        activeDot={{
                            r: 5,
                            stroke: '#32D74B',
                            strokeWidth: 2,
                            fill: 'var(--surface)',
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
