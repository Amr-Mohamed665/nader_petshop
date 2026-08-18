'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Build monthly revenue data from real orders
function buildMonthlyRevenue(orders) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  // Show last 6 months
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIdx = d.getMonth();
    const year = d.getFullYear();
    const revenue = orders
      .filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === monthIdx && od.getFullYear() === year && o.status === 'completed';
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);
    result.push({ month: months[monthIdx], revenue: Math.round(revenue) });
  }
  return result;
}

// Build order status distribution
function buildStatusData(orders) {
  const counts = {};
  orders.forEach((o) => {
    counts[o.status] = (counts[o.status] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name: capitalize(name), value }));
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

const STATUS_COLORS = {
  Pending: '#F59E0B',
  Confirmed: '#3B82F6',
  Processing: '#8B5CF6',
  Shipped: '#06B6D4',
  Completed: '#10B981',
  Cancelled: '#EF4444',
};

const DEFAULT_COLOR = '#94A3B8';

// Custom tooltip for bar chart
function RevenueTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg text-xs">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-teal-600 font-extrabold">
          AED {payload[0].value.toLocaleString('en-AE')}
        </p>
      </div>
    );
  }
  return null;
}

// Custom tooltip for pie chart
function StatusTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg text-xs">
        <p className="font-bold text-slate-700">{payload[0].name}</p>
        <p className="text-slate-500 font-semibold">{payload[0].value} order{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
}

export default function DashboardCharts({ orders = [] }) {
  const monthlyRevenue = buildMonthlyRevenue(orders);
  const statusData = buildStatusData(orders);
  const hasOrders = orders.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* Revenue Bar Chart — takes up 3/5 columns */}
      <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Revenue Overview</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Completed orders revenue — last 6 months</p>
          </div>
          <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-chart-bar text-teal-500 text-[14px]"></i>
          </div>
        </div>

        {!hasOrders ? (
          <div className="h-52 flex flex-col items-center justify-center text-slate-400">
            <i className="fa-solid fa-chart-bar text-3xl mb-2 text-slate-200"></i>
            <p className="text-xs font-semibold">No order data yet</p>
            <p className="text-[10px] text-slate-300 mt-1">Charts will populate as orders come in</p>
          </div>
        ) : (
          <div className="h-52 sm:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenue}
                margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                />
                <Tooltip content={<RevenueTooltip />} cursor={{ fill: '#F8FAFC' }} />
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#20B2A4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#20B2A4" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Order Status Pie Chart — takes up 2/5 columns */}
      <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Order Status</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Distribution of all orders</p>
          </div>
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-chart-pie text-purple-500 text-[14px]"></i>
          </div>
        </div>

        {!hasOrders || statusData.length === 0 ? (
          <div className="h-52 flex flex-col items-center justify-center text-slate-400">
            <i className="fa-solid fa-chart-pie text-3xl mb-2 text-slate-200"></i>
            <p className="text-xs font-semibold">No orders yet</p>
            <p className="text-[10px] text-slate-300 mt-1">Status breakdown appears here</p>
          </div>
        ) : (
          <div className="h-52 sm:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius="40%"
                  outerRadius="65%"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || DEFAULT_COLOR}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<StatusTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
