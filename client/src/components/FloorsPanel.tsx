// RedCalc Pro - Floors Panel
// Design: Corporate Precision

import { useMemo } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { MapPin, Network, Wifi, Users } from 'lucide-react';

export default function FloorsPanel() {
  const { sites } = useNetwork();

  const floorData = useMemo(() => {
    return sites.map(site => {
      const floors = site.floors || Math.max(1, Math.ceil(site.users / 100));
      const usersPerFloor = Math.ceil(site.users / floors);
      const switchesPerFloor = Math.ceil(usersPerFloor / 48);
      const apsPerFloor = Math.ceil(usersPerFloor / 30);
      const camerasPerFloor = Math.ceil(usersPerFloor * 0.04);

      return {
        site,
        floors,
        usersPerFloor,
        switchesPerFloor,
        apsPerFloor,
        camerasPerFloor,
        floorList: Array.from({ length: floors }, (_, i) => ({
          floor: i + 1,
          users: i < floors - 1 ? usersPerFloor : site.users - usersPerFloor * (floors - 1),
          switches: switchesPerFloor,
          aps: apsPerFloor,
          cameras: camerasPerFloor,
        })),
      };
    });
  }, [sites]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Distribución por Pisos</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Planificación de equipos por piso en cada sede
        </p>
      </div>

      {floorData.map(({ site, floors, usersPerFloor, switchesPerFloor, apsPerFloor, camerasPerFloor, floorList }) => (
        <div key={site.id} className="rc-card overflow-hidden">
          {/* Site header */}
          <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="font-bold">{site.name}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-blue-200">
              <span>{floors} pisos</span>
              <span>~{usersPerFloor} usuarios/piso</span>
            </div>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
            {[
              { label: 'Pisos', value: floors, icon: MapPin, color: 'text-blue-600' },
              { label: 'Usuarios/Piso', value: usersPerFloor, icon: Users, color: 'text-indigo-600' },
              { label: 'Switches/Piso', value: switchesPerFloor, icon: Network, color: 'text-cyan-600' },
              { label: 'APs/Piso', value: apsPerFloor, icon: Wifi, color: 'text-sky-600' },
            ].map(stat => (
              <div key={stat.label} className="p-4 text-center">
                <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Floor list */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Piso</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuarios</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Switches</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">APs WiFi</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cámaras</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Distribución</th>
                </tr>
              </thead>
              <tbody>
                {floorList.map(f => (
                  <tr key={f.floor} className="rc-table-row">
                    <td className="py-2.5 px-4">
                      <span className="font-mono font-semibold text-blue-600">Piso {f.floor}</span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">{f.users}</td>
                    <td className="py-2.5 px-4 text-right font-mono">{f.switches}</td>
                    <td className="py-2.5 px-4 text-right font-mono">{f.aps}</td>
                    <td className="py-2.5 px-4 text-right font-mono">{f.cameras}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(f.switches, 5) }).map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-blue-100 border border-blue-300 rounded-sm flex items-center justify-center">
                            <Network className="w-2.5 h-2.5 text-blue-600" />
                          </div>
                        ))}
                        {f.switches > 5 && <span className="text-xs text-muted-foreground">+{f.switches - 5}</span>}
                        <span className="mx-1 text-muted-foreground">·</span>
                        {Array.from({ length: Math.min(f.aps, 4) }).map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-sky-100 border border-sky-300 rounded-full flex items-center justify-center">
                            <Wifi className="w-2.5 h-2.5 text-sky-600" />
                          </div>
                        ))}
                        {f.aps > 4 && <span className="text-xs text-muted-foreground">+{f.aps - 4}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30">
                  <td className="py-2.5 px-4 font-bold">Total</td>
                  <td className="py-2.5 px-4 text-right font-bold font-mono text-blue-600">{site.users}</td>
                  <td className="py-2.5 px-4 text-right font-bold font-mono">{floorList.reduce((s, f) => s + f.switches, 0)}</td>
                  <td className="py-2.5 px-4 text-right font-bold font-mono">{floorList.reduce((s, f) => s + f.aps, 0)}</td>
                  <td className="py-2.5 px-4 text-right font-bold font-mono">{floorList.reduce((s, f) => s + f.cameras, 0)}</td>
                  <td className="py-2.5 px-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
