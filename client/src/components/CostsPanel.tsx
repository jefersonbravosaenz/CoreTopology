// RedCalc Pro - Costs Panel (NEW)
// Design: Corporate Precision

import { useMemo } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { calculateEquipment, calculateCosts, formatCurrency } from '@/lib/networkCalc';
import { DollarSign, TrendingUp, Package, Wrench, FileText, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CostsPanel() {
  const { sites, vlans } = useNetwork();
  const equipment = useMemo(() => calculateEquipment(sites, vlans), [sites, vlans]);
  const costs = useMemo(() => calculateCosts(equipment), [equipment]);

  const totalEquipment = costs.reduce((s, c) => s + c.equipment, 0);
  const totalInstallation = costs.reduce((s, c) => s + c.installation, 0);
  const totalCabling = costs.reduce((s, c) => s + c.cabling, 0);
  const totalLicenses = costs.reduce((s, c) => s + c.licenses, 0);
  const totalMaintenance = costs.reduce((s, c) => s + c.maintenance, 0);
  const grandTotal = costs.reduce((s, c) => s + c.total, 0);

  const pieData = [
    { name: 'Equipamiento', value: totalEquipment, color: '#2563EB' },
    { name: 'Instalación', value: totalInstallation, color: '#7C3AED' },
    { name: 'Cableado', value: totalCabling, color: '#059669' },
    { name: 'Licencias', value: totalLicenses, color: '#D97706' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Estimación de Costos</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Presupuesto estimado para la implementación de la infraestructura
        </p>
      </div>

      {/* Total highlight */}
      <div className="rc-card p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-blue-200 text-sm mb-1">Inversión Total Estimada</div>
            <div className="text-4xl font-bold font-mono">{formatCurrency(grandTotal)}</div>
            <div className="text-blue-200 text-sm mt-2">
              Mantenimiento anual estimado: <span className="font-semibold text-white">{formatCurrency(totalMaintenance)}</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Cost breakdown cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Equipamiento', value: totalEquipment, icon: Package, color: 'text-blue-600', pct: Math.round(totalEquipment / grandTotal * 100) },
          { label: 'Instalación', value: totalInstallation, icon: Wrench, color: 'text-violet-600', pct: Math.round(totalInstallation / grandTotal * 100) },
          { label: 'Cableado', value: totalCabling, icon: TrendingUp, color: 'text-emerald-600', pct: Math.round(totalCabling / grandTotal * 100) },
          { label: 'Licencias', value: totalLicenses, icon: FileText, color: 'text-amber-600', pct: Math.round(totalLicenses / grandTotal * 100) },
        ].map(item => (
          <div key={item.label} className="rc-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <div className={`text-lg font-bold font-mono ${item.color}`}>{formatCurrency(item.value)}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.pct}% del total</div>
          </div>
        ))}
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie chart */}
        <div className="rc-card p-5">
          <h3 className="font-semibold text-sm mb-4">Distribución del Presupuesto</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => [formatCurrency(val)]} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Per-site table */}
        <div className="rc-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-sm">Desglose por Sede</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase">Sede</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase">Equipo</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {costs.map(c => (
                <tr key={c.siteId} className="rc-table-row">
                  <td className="py-2.5 px-4 font-medium">{c.siteName}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-sm">{formatCurrency(c.equipment)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-green-600">{formatCurrency(c.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td className="py-2.5 px-4 font-bold">Total</td>
                <td className="py-2.5 px-4 text-right font-bold font-mono">{formatCurrency(totalEquipment)}</td>
                <td className="py-2.5 px-4 text-right font-bold font-mono text-green-600">{formatCurrency(grandTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Annual maintenance */}
      <div className="rc-card p-4 rc-card-accent-orange flex items-center gap-4">
        <RefreshCw className="w-8 h-8 text-orange-500 flex-shrink-0" />
        <div>
          <div className="font-semibold text-sm">Mantenimiento Anual Estimado</div>
          <div className="text-2xl font-bold font-mono text-orange-600 mt-0.5">{formatCurrency(totalMaintenance)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Incluye soporte técnico, actualizaciones de firmware y contratos de garantía (18% del costo de equipamiento)
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground rc-card p-3 bg-amber-50/50 border-amber-200">
        <strong>Nota:</strong> Los costos son estimaciones referenciales basadas en precios de lista de fabricantes.
        Los precios reales pueden variar según negociación con distribuidores, volumen de compra y región geográfica.
        Se recomienda solicitar cotizaciones formales a distribuidores autorizados.
      </div>
    </div>
  );
}
