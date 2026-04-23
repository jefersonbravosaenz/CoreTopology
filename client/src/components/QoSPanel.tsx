// RedCalc Pro - QoS Panel (NEW)
// Design: Corporate Precision

import { useNetwork } from '@/contexts/NetworkContext';
import { QOS_QUEUES } from '@/lib/networkTypes';
import { Zap, Info, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const QUEUE_COLORS = ['#EF4444', '#F97316', '#3B82F6', '#8B5CF6', '#6B7280'];

export default function QoSPanel() {
  const { vlans } = useNetwork();

  const chartData = QOS_QUEUES.map((q, i) => ({
    name: q.name,
    bandwidth: q.bandwidth,
    fill: QUEUE_COLORS[i],
  }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Calidad de Servicio (QoS)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configuración de colas y prioridades de tráfico según modelo DiffServ
        </p>
      </div>

      {/* Model info */}
      <div className="rc-card p-4 bg-blue-50/50 border-blue-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <span className="font-semibold">Modelo DiffServ (RFC 2474)</span>
          <span className="mx-2">·</span>
          Clasificación por DSCP (Differentiated Services Code Point)
          <span className="mx-2">·</span>
          5 colas de prioridad diferenciada
        </div>
      </div>

      {/* Queue chart */}
      <div className="rc-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm">Distribución de Ancho de Banda por Cola</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 40, left: 100, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} unit="%" domain={[0, 35]} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={95} />
            <Tooltip formatter={(val: number) => [`${val}% del BW total`]} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
            <Bar dataKey="bandwidth" radius={[0, 3, 3, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Queue table */}
      <div className="rc-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm">Configuración de Colas DiffServ</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cola</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">DSCP</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">CoS</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">% BW</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prioridad</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {QOS_QUEUES.map((q, i) => (
              <tr key={q.name} className="rc-table-row">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: QUEUE_COLORS[i] }} />
                    <span className="font-medium">{q.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center font-mono font-semibold">{q.dscp}</td>
                <td className="py-3 px-4 text-center font-mono">{q.cos}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-12 bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${q.bandwidth * 3}%`, backgroundColor: QUEUE_COLORS[i] }}
                      />
                    </div>
                    <span className="font-mono font-semibold" style={{ color: QUEUE_COLORS[i] }}>{q.bandwidth}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  {q.priority ? (
                    <span className="rc-badge bg-red-100 text-red-700">Priority Queue</span>
                  ) : (
                    <span className="rc-badge bg-gray-100 text-gray-600">WFQ</span>
                  )}
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{q.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DSCP mapping */}
      <div className="rc-card p-5">
        <h3 className="font-semibold text-sm mb-3">Mapeo DSCP → CoS (IEEE 802.1p)</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {[
            { dscp: 46, cos: 5, name: 'EF', color: '#EF4444' },
            { dscp: 34, cos: 4, name: 'AF41', color: '#F97316' },
            { dscp: 26, cos: 3, name: 'AF31', color: '#3B82F6' },
            { dscp: 18, cos: 2, name: 'AF21', color: '#8B5CF6' },
            { dscp: 10, cos: 1, name: 'AF11', color: '#10B981' },
            { dscp: 0, cos: 0, name: 'BE', color: '#6B7280' },
          ].map(item => (
            <div key={item.dscp} className="text-center p-2 rounded-lg border border-border">
              <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: item.color }}>
                {item.cos}
              </div>
              <div className="text-xs font-mono font-semibold">{item.name}</div>
              <div className="text-xs text-muted-foreground">DSCP {item.dscp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cisco QoS commands */}
      <div className="rc-card p-5">
        <h3 className="font-semibold text-sm mb-3">Comandos QoS Cisco (Referencia)</h3>
        <pre className="rc-code-block text-xs overflow-x-auto">
{`! ── Clasificación de tráfico ──
class-map match-any VOIP
 match dscp ef
class-map match-any VIDEO
 match dscp af41
class-map match-any DATOS-CRITICOS
 match dscp af31

! ── Política de QoS ──
policy-map WAN-QOS
 class VOIP
  priority percent 30
 class VIDEO
  bandwidth percent 20
 class DATOS-CRITICOS
  bandwidth percent 25
 class class-default
  fair-queue

! ── Aplicar en interfaz WAN ──
interface GigabitEthernet0/0
 service-policy output WAN-QOS

! ── QoS en switch (MLS) ──
mls qos
mls qos map cos-dscp 0 8 16 24 32 40 46 56`}
        </pre>
      </div>
    </div>
  );
}
