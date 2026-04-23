// RedCalc Pro - Services Panel
// Design: Corporate Precision

import { useNetwork } from '@/contexts/NetworkContext';
import { Server, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { ServiceConfig } from '@/lib/networkTypes';

const SERVICE_ITEMS: { key: keyof ServiceConfig; label: string; description: string; critical: boolean }[] = [
  { key: 'dhcp', label: 'DHCP', description: 'Asignación automática de direcciones IP', critical: true },
  { key: 'dns', label: 'DNS', description: 'Resolución de nombres de dominio', critical: true },
  { key: 'ntp', label: 'NTP', description: 'Sincronización de tiempo de red', critical: true },
  { key: 'radius', label: 'RADIUS/802.1X', description: 'Autenticación de usuarios en la red', critical: true },
  { key: 'syslog', label: 'Syslog', description: 'Registro centralizado de eventos', critical: false },
  { key: 'snmp', label: 'SNMP', description: 'Monitoreo y gestión de dispositivos', critical: false },
  { key: 'vpn', label: 'VPN', description: 'Red privada virtual para acceso remoto', critical: false },
  { key: 'voip', label: 'VoIP', description: 'Telefonía IP sobre la red', critical: false },
  { key: 'videoconf', label: 'Videoconferencia', description: 'Sistemas de videoconferencia empresarial', critical: false },
  { key: 'backup', label: 'Backup', description: 'Respaldo automático de datos', critical: false },
  { key: 'monitoring', label: 'Monitoreo', description: 'Monitoreo proactivo de la infraestructura', critical: false },
];

export default function ServicesPanel() {
  const { services, setServices } = useNetwork();

  const toggle = (key: keyof ServiceConfig) => {
    setServices({ ...services, [key]: !services[key] });
  };

  const activeCount = Object.values(services).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Servicios de Red</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Activa los servicios que formarán parte de la infraestructura
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rc-card px-4 py-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold">{activeCount} servicios activos</span>
        </div>
        <div className="rc-card px-4 py-2 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{SERVICE_ITEMS.length - activeCount} inactivos</span>
        </div>
      </div>

      <div className="rc-card divide-y divide-border">
        {SERVICE_ITEMS.map(item => (
          <div key={item.key} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-3">
              <Server className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`svc-${item.key}`} className="font-semibold text-sm cursor-pointer">
                    {item.label}
                  </Label>
                  {item.critical && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                      Crítico
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </div>
            <Switch
              id={`svc-${item.key}`}
              checked={services[item.key]}
              onCheckedChange={() => toggle(item.key)}
            />
          </div>
        ))}
      </div>

      <div className="rc-card p-4 bg-blue-50/50 border-blue-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          Los servicios marcados como <strong>Críticos</strong> son esenciales para el funcionamiento básico de la red.
          Se recomienda mantenerlos activos en todas las implementaciones.
        </div>
      </div>
    </div>
  );
}
