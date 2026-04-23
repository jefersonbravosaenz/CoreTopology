// RedCalc Pro - IP Addressing (VLSM) Panel
// Design: Corporate Precision

import { useMemo } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { calculateVLSM, getUtilizationColor } from '@/lib/networkCalc';
import { Globe, Info, ChevronRight } from 'lucide-react';

export default function IPPanel() {
  const { sites, vlans, baseNetwork } = useNetwork();
  const results = useMemo(() => calculateVLSM(sites, vlans, baseNetwork), [sites, vlans, baseNetwork]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Direccionamiento IP (VLSM)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Cálculo automático de subredes con Variable Length Subnet Masking
        </p>
      </div>

      {/* Info banner */}
      <div className="rc-card p-3 bg-blue-50/50 border-blue-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <span className="font-semibold">Red base: </span>
          <span className="font-mono">{baseNetwork}/8</span>
          <span className="mx-2">·</span>
          Cada sede recibe un bloque <span className="font-mono">/16</span>
          <span className="mx-2">·</span>
          Las subredes se asignan por VLSM en orden descendente de usuarios
        </div>
      </div>

      {results.map(site => (
        <div key={site.siteId} className="rc-card overflow-hidden">
          {/* Site header */}
          <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="font-bold">{site.siteName}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="text-blue-200 text-sm">
                {site.subnets.reduce((s, n) => s + n.users, 0).toLocaleString()} usuarios
              </span>
            </div>
            <div className="font-mono text-sm bg-blue-800/50 px-3 py-1 rounded-full">
              Bloque: {site.siteBlock}
            </div>
          </div>

          {/* Subnets table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">VLAN / Área</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuarios</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subred</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Gateway</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">Rango</th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hosts</th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Utilización</th>
                </tr>
              </thead>
              <tbody>
                {site.subnets.map(subnet => {
                  const vlan = vlans.find(v => v.id === subnet.vlanId);
                  const color = getUtilizationColor(subnet.utilization);
                  return (
                    <tr key={subnet.vlanId} className="rc-table-row">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: vlan?.color || '#6B7280' }}
                          />
                          <div>
                            <span className="font-mono text-blue-600 font-semibold">{subnet.vlanId}</span>
                            <span className="text-muted-foreground mx-1">·</span>
                            <span className="font-medium">{subnet.area}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">{subnet.users}</td>
                      <td className="py-2.5 px-4 font-mono text-sm">
                        <div>{subnet.subnet}</div>
                        <div className="text-xs text-muted-foreground">{subnet.mask}</div>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-sm hidden lg:table-cell text-green-700">
                        {subnet.gateway}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs text-muted-foreground hidden xl:table-cell">
                        {subnet.firstHost} – {subnet.lastHost}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono">{subnet.hosts}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="utilization-bar w-16">
                            <div
                              className="utilization-fill"
                              style={{
                                width: `${Math.min(subnet.utilization, 100)}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                          <span
                            className="text-xs font-mono font-semibold w-8 text-right"
                            style={{ color }}
                          >
                            {subnet.utilization}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Site footer */}
          <div className="px-5 py-2.5 bg-muted/30 border-t border-border text-xs text-muted-foreground flex items-center gap-4">
            <span className="font-mono font-semibold text-foreground">Bloque: {site.siteBlock}</span>
            <span>Rango total: {site.siteBlock.split('/')[0].replace(/\d+$/, '0')} – {site.siteBlock.split('/')[0].replace(/\.\d+$/, '.255.255')}</span>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="rc-card p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Leyenda de Utilización</div>
        <div className="flex flex-wrap gap-4 text-sm">
          {[
            { color: '#10B981', label: '< 50% — Óptimo' },
            { color: '#3B82F6', label: '50-69% — Normal' },
            { color: '#F59E0B', label: '70-89% — Atención' },
            { color: '#EF4444', label: '≥ 90% — Crítico' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
