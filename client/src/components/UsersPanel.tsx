// RedCalc Pro - Users Panel
// Design: Corporate Precision

import { useMemo } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { Users, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2'];

export default function UsersPanel() {
  const { sites, vlans, totalUsers } = useNetwork();

  const siteData = sites.map((s, i) => ({
    name: s.name,
    usuarios: s.users,
    fill: COLORS[i % COLORS.length],
  }));

  const vlanData = vlans
    .filter(v => v.userPercent > 0)
    .map((v, i) => ({
      name: v.area,
      usuarios: Math.ceil(totalUsers * v.userPercent / 100),
      pct: v.userPercent,
      fill: v.color,
    }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Distribución de Usuarios</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Análisis de usuarios por sede y por área funcional
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By site */}
        <div className="rc-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm">Usuarios por Sede</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={siteData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="usuarios" radius={[3, 3, 0, 0]}>
                {siteData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By VLAN */}
        <div className="rc-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm">Usuarios por Área (VLAN)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={vlanData} layout="vertical" margin={{ top: 0, right: 40, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={75} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="usuarios" radius={[0, 3, 3, 0]}>
                {vlanData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="rc-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm">Detalle por Sede y Área</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sede</th>
                {vlans.filter(v => v.userPercent > 0).map(v => (
                  <th key={v.id} className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                      {v.area}
                    </div>
                  </th>
                ))}
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr key={site.id} className="rc-table-row">
                  <td className="py-3 px-4 font-medium">{site.name}</td>
                  {vlans.filter(v => v.userPercent > 0).map(v => (
                    <td key={v.id} className="py-3 px-3 text-right font-mono text-sm">
                      {Math.ceil(site.users * v.userPercent / 100)}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold font-mono text-blue-600">{site.users.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td className="py-3 px-4 font-bold">Total</td>
                {vlans.filter(v => v.userPercent > 0).map(v => (
                  <td key={v.id} className="py-3 px-3 text-right font-bold font-mono">
                    {Math.ceil(totalUsers * v.userPercent / 100)}
                  </td>
                ))}
                <td className="py-3 px-4 text-right font-bold font-mono text-blue-600">{totalUsers.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
