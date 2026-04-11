import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const MOOD_COLORS: Record<string, string> = {
  happy: '#68BDA1',
  neutral: '#75BFFF',
  sad: '#85AFFF',
  anxious: '#FFD746',
  mad: '#EA7B7B',
};

interface MoodBarChartProps {
  data: { value: number; label: string }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs">
        <p className="text-white font-semibold capitalize">{label}</p>
        <p className="text-gray-400">{payload[0].value} days</p>
      </div>
    );
  }
  return null;
};

export const MoodBarChart = ({ data }: MoodBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barCategoryGap="20%">
        <XAxis
          dataKey="label"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          style={{ textTransform: 'capitalize' }}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="value" radius={[6, 6, 6, 6]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.label] || '#C2AEBF'} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
