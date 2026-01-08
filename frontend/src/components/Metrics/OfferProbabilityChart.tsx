import React, { useEffect, useState } from 'react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip
} from 'recharts';
import { metricsApi, type SourcePerformance } from '../../api/metrics';

const COLORS = [
    'var(--primary-500)', 
    'var(--accent-500)', 
    'var(--success)', 
    'var(--warning)', 
    'var(--error)',
    'var(--info)',
    'var(--gray-500)'
];

const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, value, name } = props;
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    if (value === 0) return null;

    return (
        <g>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="var(--text-tertiary)" fill="none" />
            <circle cx={ex} cy={ey} r={2} fill="var(--text-tertiary)" stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="var(--text-primary)" fontSize={12} fontWeight={600}>
                {name}
            </text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="var(--success)" fontSize={11} fontWeight={700}>
                {`${value.toFixed(1)}% Offer Rate`}
            </text>
        </g>
    );
};

const OfferProbabilityChart: React.FC = () => {
    const [data, setData] = useState<SourcePerformance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await metricsApi.getSourcePerformance();
                // Filter out sources with 0 applications to make the chart cleaner
                setData(result.filter(item => item.totalApplications > 0));
            } catch (error) {
                console.error('Error fetching source performance:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-spinner">Loading chart...</div>;
    
    if (data.length === 0) {
        return (
            <div className="empty-chart-state">
                <p>No application data available by source yet.</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 80, bottom: 20, left: 80 }}>
                    <Pie
                        data={data as any[]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="offerProbability"
                        nameKey="source"
                        paddingAngle={5}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--bg-elevated)" strokeWidth={2} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            background: 'var(--bg-elevated)', 
                            border: '1px solid var(--border-primary)',
                            borderRadius: '8px',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                        formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Offer Probability']}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OfferProbabilityChart;
