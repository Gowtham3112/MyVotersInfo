import { useEffect, useState } from "react";
import { Users, Building2, FileText, LandPlot, Warehouse } from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  // LineChart,
  // Line,
  Legend,
} from "recharts";

import { useNavigate } from "react-router-dom";

import { getAllCategoriesAPI } from "../../../services/service_page/category";
import { getAllPartsAPI } from "../../../services/service_page/part";
import { getAllWardsAPI } from "../../../services/service_page/ward";
import { getAllVotersAPI } from "../../../services/service_page/voter";
import { getAllAreasAPI } from "../../../services/service_page/area";

import LoadingOverlay from "../../../component/others/LoadingOverlay";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [partList, setPartList] = useState<any[]>([]);
  const [wardList, setWardList] = useState<any[]>([]);
  const [areaList, setAreaList] = useState<any[]>([]);
  const [votersList, setVotersList] = useState<any[]>([]);

  const [_wardChart, setWardChart] = useState<any[]>([]);
  const [categoryChart, setCategoryChart] = useState<any[]>([]);
  const [areaChart, setAreaChart] = useState<any[]>([]);
  const [_trendChart, setTrendChart] = useState<any[]>([]);
  const [categoryPartChart, setCategoryPartChart] = useState<any[]>([]);
  const [_categoryWardChart, setCategoryWardChart] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [categories, parts, wards, areas, voters] = await Promise.all([
        getAllCategoriesAPI(),
        getAllPartsAPI(),
        getAllWardsAPI(),
        getAllAreasAPI(),
        getAllVotersAPI(),
      ]);

      setCategoryList(categories);
      setPartList(parts);
      setWardList(wards);
      setAreaList(areas);
      setVotersList(voters);

      prepareCharts(categories, wards, areas, voters, parts);
    } finally {
      setLoading(false);
    }
  };

  const prepareCharts = (
    categories: any[],
    wards: any[],
    areas: any[],
    voters: any[],
    parts: any[],
  ) => {
    // Ward Chart
    const wardData = wards.map((ward) => ({
      name: ward.name,
      voters: voters.filter((v) => v.wardId === ward.id).length,
    }));
    setWardChart(wardData);

    // Category Chart
    const categoryData = categories.map((cat) => ({
      name: cat.name,
      value: voters.filter((v) => v.categoryId === cat.id).length,
    }));
    setCategoryChart(categoryData);

    // Area Chart
    const areaData = areas.map((area) => ({
      name: area.name,
      voters: voters.filter((v) => v.areaId === area.id).length,
    }));
    setAreaChart(areaData);

    // Voter Trend
    const trend: any = {};

    voters.forEach((v) => {
      const date = new Date(v.createdAt).toLocaleDateString();
      if (!trend[date]) trend[date] = 0;
      trend[date]++;
    });

    const trendData = Object.keys(trend).map((date) => ({
      name: date,
      voters: trend[date],
    }));

    setTrendChart(trendData);

    // Category vs Part Chart
    const catPartData = categories.map((cat) => {
      const obj: any = { name: cat.name };

      parts.forEach((part) => {
        obj[part.name] = voters.filter(
          (v) => v.categoryId === cat.id && v.partId === part.id,
        ).length;
      });

      return obj;
    });

    setCategoryPartChart(catPartData);

    // Category vs Ward Chart
    const catWardData = categories.map((cat) => {
      const obj: any = { name: cat.name };

      wards.forEach((ward) => {
        obj[ward.name] = voters.filter(
          (v) => v.categoryId === cat.id && v.wardId === ward.id,
        ).length;
      });

      return obj;
    });

    setCategoryWardChart(catWardData);
  };

  const cards = [
    {
      label: "Category (உள்ளாட்சி அமைப்பு)",
      value: categoryList.length,
      icon: Building2,
      path: "/admin/category",
      accent: "#6366f1",
      bg: "from-indigo-50 to-indigo-100",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      border: "border-indigo-200",
    },
    {
      label: "Part No (பாகம் எண்)",
      value: partList.length,
      icon: FileText,
      path: "/admin/part",
      accent: "#0ea5e9",
      bg: "from-sky-50 to-sky-100",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      border: "border-sky-200",
    },
    {
      label: "Ward No (வார்டு எண்)",
      value: wardList.length,
      icon: Warehouse,
      path: "/admin/ward",
      accent: "#10b981",
      bg: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      border: "border-emerald-200",
    },
    {
      label: "Area (நகர்)",
      value: areaList.length,
      icon: LandPlot,
      path: "/admin/area",
      accent: "#f59e0b",
      bg: "from-amber-50 to-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      border: "border-amber-200",
    },
    {
      label: "Voter (வாக்காளர்)",
      value: votersList.length,
      icon: Users,
      path: "/admin/voter",
      accent: "#ef4444",
      bg: "from-rose-50 to-rose-100",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      border: "border-rose-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <LoadingOverlay />}

      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Electoral Management Overview
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(card.path)}
                className={`group relative bg-gradient-to-br ${card.bg} border ${card.border} rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none w-full`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.iconBg} ${card.iconColor} transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon size={20} />
                  </span>
                  <svg
                    className={`w-4 h-4 ${card.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>

                <p className="text-3xl font-extrabold text-gray-900 tabular-nums leading-none mb-1">
                  {card.value}
                </p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  {card.label}
                </p>

                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: card.accent }}
                />
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <span className="w-2 h-6 rounded-full bg-indigo-500 inline-block"></span>
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest">
                Category Wise Voters
              </h3>
            </div>

            <div className="p-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryChart} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />

                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {categoryChart.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Donut */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <span className="w-2 h-6 rounded-full bg-amber-400 inline-block"></span>
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest">
                Category Split
              </h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryChart}
                    dataKey="value"
                    innerRadius={72}
                    outerRadius={105}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {categoryChart.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: "#64748b" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <span className="w-2 h-6 rounded-full bg-emerald-500 inline-block"></span>
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest">
                Area Wise Voters
              </h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={areaChart} barSize={22}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="voters" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <span className="w-2 h-6 rounded-full bg-purple-500 inline-block"></span>
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest">
              Category vs Part Wise Voters
            </h3>
          </div>

          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPartChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Legend />

                {partList.map((part, index) => (
                  <Bar
                    key={part.id}
                    dataKey={part.name}
                    fill={COLORS[index % COLORS.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <span className="w-2 h-6 rounded-full bg-rose-500 inline-block"></span>
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest">
              Category vs Ward Wise Voters
            </h3>
          </div>

          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryWardChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Legend />

                {wardList.map((ward, index) => (
                  <Bar
                    key={ward.id}
                    dataKey={ward.name}
                    fill={COLORS[index % COLORS.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <span className="w-2 h-6 rounded-full bg-sky-500 inline-block"></span>
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest">
                Voter Registration Trend
              </h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="voters"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                    activeDot={{
                      r: 6,
                      fill: "#6366f1",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
