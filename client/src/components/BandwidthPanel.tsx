// RedCalc Pro - Bandwidth Panel
// Design: Corporate Precision

import { useMemo } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { calculateBandwidth } from '@/lib/networkCalc';
import { Activity, Info } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';

export default function BandwidthPanel() {
  const { sites } = useNetwork();
  const results = useMemo(() => calculateBandwidth(sites), [sites]);

  const chartData = results.map(r => ({
    name: r.siteName,
    'Requerido': r.bwRequired,
    'Recomendado': r.bwRecommended,
    'Respaldo': r.bwBackup,
  }));

  const totalRequired = results.reduce((s, r) => s + r.bwRequired, 0);
  const totalRecommended = results.reduce((s, r) => s + r.bwRecommended, 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Ancho de Banda</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Estimación de requerimientos de ancho de banda por sede
        </p>
      </div>

      {/* Formula info */}
      <div className="rc-card p-3 bg-blue-50/50 border-blue-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <span className="font-semibold">Fórmula: </span>
          <span className="font-mono">BW = (Usuarios × 5 Mbps × 0.7) × 1.3 (crecimiento)</span>
          <span className="mx-2">·</span>
          Respaldo = 50% del BW recomendado
        </div>
      </div>

      {/* Chart */}
      <div className="rc-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold">Visualización de Ancho de Banda</h3>
          <span className="text-sm text-muted-foreground">— Comparación de requerimientos por sede</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit=" G" />
            <Tooltip
              formatter={(val: number) => [`${val} Gbps`]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Requerido" fill="#93C5FD" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Recomendado" fill="#2563EB" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Respaldo" fill="#F97316" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed table */}
      <div className="rc-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm">Cálculo Detallado por Sede</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sede</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuarios</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">BW Requerido</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">BW Recomendado</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">BW Respaldo</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enlace Recomendado</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.siteId} className="rc-table-row">
                  <td className="py-3 px-4 font-medium">{r.siteName}</td>
                  <td className="py-3 px-4 text-right font-mono">{r.users.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">{r.bwRequired} Gbps</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-blue-600">{r.bwRecommended} Gbps</td>
                  <td className="py-3 px-4 text-right font-mono text-orange-600">{r.bwBackup} Gbps</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {r.linkRecommended}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td className="py-3 px-4 font-bold">Total</td>
                <td className="py-3 px-4 text-right font-bold font-mono">
                  {results.reduce((s, r) => s + r.users, 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-bold font-mono text-muted-foreground">
                  {totalRequired.toFixed(2)} Gbps
                </td>
                <td className="py-3 px-4 text-right font-bold font-mono text-blue-600">
                  {totalRecommended.toFixed(2)} Gbps
                </td>
                <td className="py-3 px-4 text-right font-bold font-mono text-orange-600">
                  {results.reduce((s, r) => s + r.bwBackup, 0).toFixed(2)} Gbps
                </td>
                <td className="py-3 px-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rc-card p-4 rc-card-accent-blue">
          <div className="text-xs text-muted-foreground mb-1">BW Total Requerido</div>
          <div className="text-2xl font-bold font-mono text-blue-600">{totalRequired.toFixed(2)} Gbps</div>
          <div className="text-xs text-muted-foreground mt-1">Carga promedio estimada</div>
        </div>
        <div className="rc-card p-4 rc-card-accent-green">
          <div className="text-xs text-muted-foreground mb-1">BW Total Recomendado</div>
          <div className="text-2xl font-bold font-mono text-green-600">{totalRecommended.toFixed(2)} Gbps</div>
          <div className="text-xs text-muted-foreground mt-1">Con factor de crecimiento 30%</div>
        </div>
        <div className="rc-card p-4 rc-card-accent-orange">
          <div className="text-xs text-muted-foreground mb-1">BW Total Respaldo</div>
          <div className="text-2xl font-bold font-mono text-orange-600">
            {results.reduce((s, r) => s + r.bwBackup, 0).toFixed(2)} Gbps
          </div>
          <div className="text-xs text-muted-foreground mt-1">Enlace secundario recomendado</div>
        </div>
      </div>
    </div>
  );
}
