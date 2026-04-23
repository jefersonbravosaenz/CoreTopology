// RedCalc Pro - Overview Dashboard Panel
// Design: Corporate Precision - Stats cards with animated counters

import { useMemo } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { calculateEquipment, calculateBandwidth, calculateCosts, formatCurrency } from '@/lib/networkCalc';
import { DEFAULT_VLANS } from '@/lib/networkTypes';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import {
  Network, Users, Building2, Server, Shield, Wifi,
  Activity, DollarSign, AlertTriangle, CheckCircle2,
  Globe, Layers, Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function OverviewPanel() {
  const { sites, vlans, totalUsers, vendor } = useNetwork();
  const equipment = useMemo(() => calculateEquipment(sites, vlans), [sites, vlans]);
  const bandwidth = useMemo(() => calculateBandwidth(sites), [sites]);
  const costs = useMemo(() => calculateCosts(equipment), [equipment]);

  const proposalName = `Propuesta de Red Empresarial`;
  const totalSites = sites.length;
  const totalServers = equipment.reduce((s, e) => s + e.equipment.filter(eq => eq.category === 'servers').reduce((sq, eq) => sq + eq.quantity, 0), 0);
  const totalCost = costs.reduce((s, c) => s + c.total, 0);

  const statCards = [
    { label: 'Sedes', value: totalSites, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Usuarios', value: totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'VLANs', value: vlans.length, icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Switches', value: equipment.reduce((s, e) => s + e.equipment.filter(eq => eq.category === 'switching').reduce((sq, eq) => sq + eq.quantity, 0), 0), icon: Network, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'APs WiFi', value: equipment.reduce((s, e) => s + e.equipment.filter(eq => eq.category === 'wireless').reduce((sq, eq) => sq + eq.quantity, 0), 0), icon: Wifi, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Firewalls', value: equipment.reduce((s, e) => s + e.equipment.filter(eq => eq.category === 'security').reduce((sq, eq) => sq + eq.quantity, 0), 0), icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Servidores', value: totalServers, icon: Server, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Costo Estimado', value: formatCurrency(totalCost), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const bandwidthData = bandwidth.map(b => ({
    name: b.siteName,
    bwRequired: parseFloat(b.bwRequired.toFixed(1)),
    bwRecommended: parseFloat(b.bwRecommended.toFixed(1)),
  }));

  const costData = costs.map((c, idx) => ({
    name: sites[idx]?.name || c.siteName,
    costo: c.total,
  }));

  const vlanDistribution = vlans.map(v => ({
    name: v.area,
    value: v.userPercent,
    fill: v.color,
  }));

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{proposalName}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Dashboard ejecutivo de la infraestructura de red
          </p>
        </div>
        <div className="rc-badge bg-green-100 text-green-700 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Propuesta Activa
        </div>
      </div>

      {/* Hero banner */}
      <div
        className="relative rounded-xl overflow-hidden h-44 animate-scale-in"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389557791/AzGkYhP8yN3ea6WaKvqgT4/hero-network-ktaxMBBomWWHnLRoSHxFva.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2744]/90 via-[#0F2744]/60 to-transparent" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-center">
          <div className="text-white text-2xl font-bold">{proposalName}</div>
          <div className="flex items-center gap-4 mt-3 text-sm text-blue-100">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{totalSites} sedes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{totalUsers.toLocaleString()} usuarios</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>{bandwidth.reduce((s, b) => s + b.bwRecommended, 0).toFixed(1)} Gbps total</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-300 text-xs">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span className="capitalize">{vendor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-up">
        {statCards.map((card, idx) => (
          <div key={card.label} className="rc-card p-4 animate-bounce-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground mb-1">{card.label}</div>
                <div className={`text-xl font-bold font-mono ${card.color}`}>
                  {typeof card.value === 'number' ? (
                    <AnimatedCounter value={card.value} />
                  ) : (
                    card.value
                  )}
                </div>
              </div>
              <div className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center animate-float`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {/* Bandwidth Chart */}
        <div className="rc-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm">Ancho de Banda por Sede</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bandwidthData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="bwRequired" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="bwRecommended" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* VLAN Distribution */}
        <div className="rc-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-sm">Distribución de Usuarios por VLAN</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={vlanDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {vlanDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => `${val}%`} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="rc-card p-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <h3 className="font-semibold text-sm">Estimación de Costos por Sede</h3>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Costo Total Estimado</div>
            <div className="text-lg font-bold text-green-600 animate-neon">{formatCurrency(totalCost)}</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={costData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="costo" fill="#3b82f6" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sites Summary Table */}
      <div className="rc-card p-5 animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="font-semibold text-sm mb-4">Resumen por Sede</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sede</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuarios</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Switches</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">APs</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">BW Recomendado</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Costo</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site, idx) => (
                <tr key={site.id} className="rc-table-row animate-slide-in-right" style={{ animationDelay: `${idx * 30}ms` }}>
                  <td className="py-2 px-3 font-medium">{site.name}</td>
                  <td className="py-2 px-3 text-right font-mono">{site.users.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-mono">{equipment[idx]?.equipment.filter(e => e.category === 'switching').reduce((s, e) => s + e.quantity, 0) || 0}</td>
                  <td className="py-2 px-3 text-right font-mono">{equipment[idx]?.equipment.filter(e => e.category === 'wireless').reduce((s, e) => s + e.quantity, 0) || 0}</td>
                  <td className="py-2 px-3 text-right font-mono text-blue-600">{bandwidth[idx]?.bwRecommended.toFixed(1)} Gbps</td>
                  <td className="py-2 px-3 text-right font-bold text-green-600">{costs[idx] ? formatCurrency(costs[idx].total) : '$0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
