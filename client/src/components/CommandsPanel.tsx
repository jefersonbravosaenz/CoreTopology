// RedCalc Pro - Commands Panel
// Design: Corporate Precision - Generador de comandos con comentarios

import { useMemo, useState } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { calculateVLSM, generateCommands } from '@/lib/networkCalc';
import { Terminal, Copy, Check, Info, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const VENDORS = [
  { value: 'cisco', label: 'Cisco IOS' },
  { value: 'hp', label: 'HP/Aruba ProCurve' },
  { value: 'juniper', label: 'Juniper JunOS' },
  { value: 'mikrotik', label: 'MikroTik RouterOS' },
  { value: 'fortinet', label: 'Fortinet FortiGate' },
];

const DEVICE_TYPES = [
  { value: 'switch', label: 'Switch L2/L3' },
  { value: 'router', label: 'Router' },
  { value: 'firewall', label: 'Firewall' },
];

export default function CommandsPanel() {
  const { sites, vlans, baseNetwork, vendor, setVendor } = useNetwork();
  const [deviceType, setDeviceType] = useState<string>('switch');
  const [siteIndex, setSiteIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const ipResults = useMemo(() => calculateVLSM(sites, vlans, baseNetwork), [sites, vlans, baseNetwork]);

  const commands = useMemo(
    () => generateCommands(vlans, ipResults, vendor, deviceType, siteIndex),
    [vlans, ipResults, vendor, deviceType, siteIndex]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(commands).then(() => {
      setCopied(true);
      toast.success('Comandos copiados al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Generador de Comandos</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configuración lista para copiar y pegar en tus equipos de red (incluye comentarios explicativos)
        </p>
      </div>

      {/* Config selectors */}
      <div className="rc-card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Fabricante</Label>
            <Select value={vendor} onValueChange={v => setVendor(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENDORS.map(v => (
                  <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Tipo de Dispositivo</Label>
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_TYPES.map(d => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Sede</Label>
            <Select value={String(siteIndex)} onValueChange={v => setSiteIndex(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sites.map((s, i) => (
                  <SelectItem key={s.id} value={String(i)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Commands output */}
      <div className="rc-card overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 text-white">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-sm font-mono">
              {VENDORS.find(v => v.value === vendor)?.label} — {DEVICE_TYPES.find(d => d.value === deviceType)?.label} — {sites[siteIndex]?.name}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </>
            )}
          </button>
        </div>
        <pre className="rc-code-block rounded-none text-xs overflow-x-auto max-h-[600px] bg-slate-900 text-slate-100">
          <code>{commands}</code>
        </pre>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rc-card p-4 bg-blue-50 border border-blue-200 animate-fade-up">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 space-y-1">
              <p className="font-semibold">Sobre los Comentarios</p>
              <p>Los comandos incluyen comentarios explicativos que describen cada sección de configuración.</p>
              <p className="text-xs text-blue-700">Líneas que comienzan con <code className="bg-blue-100 px-1 rounded font-mono">#</code> o <code className="bg-blue-100 px-1 rounded font-mono">!</code> son comentarios y NO se ejecutan.</p>
            </div>
          </div>
        </div>
        <div className="rc-card p-4 bg-amber-50 border border-amber-200 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 space-y-1">
              <p className="font-semibold">Notas de Seguridad</p>
              <p>• Reemplaza <code className="bg-amber-100 px-1 rounded font-mono text-xs">contraseñas</code> antes de aplicar</p>
              <p>• Prueba en laboratorio antes de producción</p>
              <p>• Guarda respaldo de configuración actual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor-specific notes */}
      {vendor === 'fortinet' && (
        <div className="rc-card p-4 bg-purple-50 border border-purple-200 animate-bounce-in">
          <div className="text-sm text-purple-900 space-y-2">
            <p className="font-semibold">Fortinet FortiGate - Notas Importantes</p>
            <ul className="space-y-1 text-xs">
              <li>✓ Configuración completa con Interfaces, VLANs, Zonas de Seguridad, Políticas de Firewall</li>
              <li>✓ Incluye QoS, DHCP, DNS, Logging, HA (Alta Disponibilidad) y Antivirus</li>
              <li>✓ Todos los comandos incluyen comentarios explicativos en español</li>
              <li>⚠ Reemplaza <code className="bg-purple-100 px-1 rounded font-mono text-xs">puerto1/puerto2</code> con interfaces reales</li>
              <li>⚠ Configura <code className="bg-purple-100 px-1 rounded font-mono text-xs">contraseña_ha_segura</code> para redundancia</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
