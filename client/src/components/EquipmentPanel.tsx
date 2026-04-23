// RedCalc Pro - Equipment Panel
// Design: Corporate Precision

import { useMemo } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { calculateEquipment, formatCurrency } from '@/lib/networkCalc';
import { Network, Shield, Wifi, Server, Zap, Package, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  switching: Network,
  routing: Zap,
  security: Shield,
  wireless: Wifi,
  servers: Server,
  physical: Package,
  power: Zap,
};

const CATEGORY_COLORS: Record<string, string> = {
  switching: 'text-blue-600 bg-blue-50',
  routing: 'text-indigo-600 bg-indigo-50',
  security: 'text-red-600 bg-red-50',
  wireless: 'text-sky-600 bg-sky-50',
  servers: 'text-emerald-600 bg-emerald-50',
  physical: 'text-gray-600 bg-gray-50',
  power: 'text-yellow-600 bg-yellow-50',
};

export default function EquipmentPanel() {
  const { sites, vlans } = useNetwork();
  const results = useMemo(() => calculateEquipment(sites, vlans), [sites, vlans]);

  const totalEquipment = results.reduce((s, r) => s + r.equipment.reduce((es, e) => es + e.quantity, 0), 0);
  const totalCost = results.reduce((s, r) => s + r.totalCost, 0);

  // Aggregate by type across all sites
  const aggregated = new Map<string, { quantity: number; model: string; specs: string; purpose: string; unitCost: number; category: string }>();
  for (const site of results) {
    for (const eq of site.equipment) {
      const existing = aggregated.get(eq.type);
      if (existing) {
        existing.quantity += eq.quantity;
      } else {
        aggregated.set(eq.type, { ...eq });
      }
    }
  }

  // Summary stats
  const switches = results.reduce((s, r) => s + (r.equipment.find(e => e.type.includes('Acceso'))?.quantity || 0), 0);
  const firewalls = results.reduce((s, r) => s + (r.equipment.find(e => e.type === 'Firewalls')?.quantity || 0), 0);
  const routers = results.reduce((s, r) => s + (r.equipment.find(e => e.type === 'Routers')?.quantity || 0), 0);
  const cameras = results.reduce((s, r) => s + (r.equipment.find(e => e.type === 'Cámaras de Seguridad')?.quantity || 0), 0);
  const aps = results.reduce((s, r) => s + (r.equipment.find(e => e.type.includes('WiFi'))?.quantity || 0), 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Equipos de Infraestructura</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Equipamiento necesario para la infraestructura de red completa
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Switches Acceso', value: switches, icon: Network, color: 'text-blue-600 bg-blue-50' },
          { label: 'Firewalls', value: firewalls, icon: Shield, color: 'text-red-600 bg-red-50' },
          { label: 'Routers', value: routers, icon: Zap, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Cámaras', value: cameras, icon: Package, color: 'text-gray-600 bg-gray-50' },
          { label: 'APs WiFi', value: aps, icon: Wifi, color: 'text-sky-600 bg-sky-50' },
        ].map(stat => (
          <div key={stat.label} className="rc-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.color.split(' ')[1])}>
                <stat.icon className={cn('w-4 h-4', stat.color.split(' ')[0])} />
              </div>
            </div>
            <div className={cn('text-2xl font-bold font-mono', stat.color.split(' ')[0])}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Aggregated equipment table */}
      <div className="rc-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Lista Consolidada de Equipos</h3>
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{totalEquipment} unidades</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Equipo</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cant.</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Modelo Recomendado</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Especificaciones</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Costo Unit.</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(aggregated.entries()).map(([type, eq]) => {
                const Icon = CATEGORY_ICONS[eq.category] || Package;
                const colorClass = CATEGORY_COLORS[eq.category] || 'text-gray-600 bg-gray-50';
                return (
                  <tr key={type} className="rc-table-row">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-6 h-6 rounded flex items-center justify-center flex-shrink-0', colorClass.split(' ')[1])}>
                          <Icon className={cn('w-3.5 h-3.5', colorClass.split(' ')[0])} />
                        </div>
                        <span className="font-medium">{type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-6 bg-blue-100 text-blue-700 rounded font-mono font-bold text-sm">
                        {eq.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{eq.model}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs hidden lg:table-cell">{eq.specs}</td>
                    <td className="py-3 px-4 text-right font-mono text-sm">{formatCurrency(eq.unitCost)}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-green-600">
                      {formatCurrency(eq.quantity * eq.unitCost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td className="py-3 px-4 font-bold" colSpan={5}>Total Equipamiento</td>
                <td className="py-3 px-4 text-right font-bold font-mono text-green-600 text-base">
                  {formatCurrency(totalCost)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Per-site breakdown */}
      <div className="rc-card p-5">
        <h3 className="font-semibold text-sm mb-4">Distribución por Sede</h3>
        <div className="space-y-3">
          {results.map(site => (
            <div key={site.siteId} className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium truncate">{site.siteName}</div>
              <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                  style={{ width: `${Math.round((site.totalCost / totalCost) * 100)}%` }}
                >
                  <span className="text-xs text-white font-mono font-semibold">
                    {Math.round((site.totalCost / totalCost) * 100)}%
                  </span>
                </div>
              </div>
              <div className="w-28 text-right font-mono text-sm text-green-600 font-semibold">
                {formatCurrency(site.totalCost)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
