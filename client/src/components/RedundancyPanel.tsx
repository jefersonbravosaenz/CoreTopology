// RedCalc Pro - Redundancy Analysis Panel (NEW)
// Design: Corporate Precision

import { useMemo } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { calculateEquipment, analyzeRedundancy } from '@/lib/networkCalc';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const LEVEL_CONFIG = {
  Full: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2 },
  Enhanced: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: CheckCircle2 },
  Basic: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
  None: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
};

export default function RedundancyPanel() {
  const { sites, vlans } = useNetwork();
  const equipment = useMemo(() => calculateEquipment(sites, vlans), [sites, vlans]);
  const analysis = useMemo(() => analyzeRedundancy(sites, equipment), [sites, equipment]);

  const avgScore = Math.round(analysis.reduce((s, a) => s + a.haScore, 0) / analysis.length);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Análisis de Redundancia</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Evaluación de alta disponibilidad y puntos únicos de falla (SPOF)
        </p>
      </div>

      {/* Overall score */}
      <div className="rc-card p-5 flex items-center gap-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke={avgScore >= 80 ? '#16a34a' : avgScore >= 60 ? '#2563eb' : avgScore >= 40 ? '#d97706' : '#dc2626'}
              strokeWidth="10"
              strokeDasharray={`${avgScore * 2.51} 251`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono">{avgScore}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div>
          <div className="text-lg font-bold">Puntuación de Alta Disponibilidad</div>
          <div className="text-sm text-muted-foreground mt-1">
            Promedio de todas las sedes
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Shield className={cn('w-4 h-4', avgScore >= 80 ? 'text-green-600' : avgScore >= 60 ? 'text-blue-600' : 'text-amber-600')} />
            <span className={cn('font-semibold', avgScore >= 80 ? 'text-green-600' : avgScore >= 60 ? 'text-blue-600' : 'text-amber-600')}>
              {avgScore >= 80 ? 'Alta Disponibilidad Completa' : avgScore >= 60 ? 'Disponibilidad Mejorada' : avgScore >= 40 ? 'Disponibilidad Básica' : 'Sin Redundancia'}
            </span>
          </div>
        </div>
      </div>

      {/* Per-site analysis */}
      <div className="space-y-4">
        {analysis.map((a, i) => {
          const site = sites[i];
          const config = LEVEL_CONFIG[a.redundancyLevel];
          const Icon = config.icon;

          return (
            <div key={a.siteId} className={cn('rc-card overflow-hidden border', config.border)}>
              {/* Site header */}
              <div className={cn('px-5 py-3 flex items-center justify-between', config.bg)}>
                <div className="flex items-center gap-2">
                  <Icon className={cn('w-4 h-4', config.color)} />
                  <span className="font-bold">{site.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-24 bg-white/60 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${a.haScore}%`,
                          backgroundColor: a.haScore >= 80 ? '#16a34a' : a.haScore >= 60 ? '#2563eb' : a.haScore >= 40 ? '#d97706' : '#dc2626',
                        }}
                      />
                    </div>
                    <span className={cn('font-mono font-bold text-sm', config.color)}>{a.haScore}/100</span>
                  </div>
                  <span className={cn('rc-badge', config.bg, config.color, 'border', config.border)}>
                    {a.redundancyLevel}
                  </span>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SPOFs */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-sm font-semibold text-red-600">
                    <XCircle className="w-3.5 h-3.5" />
                    Puntos Únicos de Falla (SPOF)
                  </div>
                  {a.singlePointsOfFailure.length === 0 ? (
                    <div className="flex items-center gap-1.5 text-sm text-green-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      No se detectaron SPOFs
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {a.singlePointsOfFailure.map((spof, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-sm text-red-700">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          {spof}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Recommendations */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-sm font-semibold text-blue-600">
                    <Info className="w-3.5 h-3.5" />
                    Recomendaciones
                  </div>
                  <ul className="space-y-1">
                    {a.recommendations.slice(0, 4).map((rec, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                        <span className="text-blue-400 mt-0.5">→</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Best practices */}
      <div className="rc-card p-5 rc-card-accent-blue">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm">Mejores Prácticas de Alta Disponibilidad</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
          {[
            'Implementar pares de firewalls en modo Active/Standby con failover automático',
            'Usar VSS (Virtual Switching System) o StackWise en switches core',
            'Configurar HSRP/VRRP en routers para redundancia de gateway',
            'Contratar dos ISPs diferentes para redundancia WAN',
            'Implementar STP Rapid-PVST+ con BPDU Guard en puertos de acceso',
            'Usar EtherChannel (LACP) en enlaces de distribución y core',
            'Configurar monitoreo proactivo con SNMP y alertas automáticas',
            'Mantener UPS con autonomía mínima de 30 minutos para equipos críticos',
          ].map((practice, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>{practice}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
