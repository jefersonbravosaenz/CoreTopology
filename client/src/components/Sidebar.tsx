// RedCalc Pro - Sidebar Navigation
// Design: Corporate Precision - Deep navy sidebar with white text

import { useState } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import {
  Network, Calculator, Save, Upload, Download, LayoutDashboard,
  Layers, Globe, Activity, Server, Map, Terminal, DollarSign,
  Shield, Wifi, ChevronLeft, ChevronRight, Settings, FileText,
  BarChart3, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabId =
  | 'overview'
  | 'vlans'
  | 'vlan-editor'
  | 'ip'
  | 'bandwidth'
  | 'services'
  | 'users'
  | 'floors'
  | 'equipment'
  | 'topology'
  | 'commands'
  | 'costs'
  | 'redundancy'
  | 'qos'
  | 'proposals'
  | 'import';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
  group: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard, group: 'Principal' },
  { id: 'vlans', label: 'VLANs', icon: Layers, group: 'Diseño de Red' },
  { id: 'vlan-editor', label: 'Editar VLANs', icon: Settings, group: 'Diseño de Red' },
  { id: 'ip', label: 'Direccionamiento IP', icon: Globe, group: 'Diseño de Red' },
  { id: 'bandwidth', label: 'Ancho de Banda', icon: Activity, group: 'Diseño de Red' },
  { id: 'qos', label: 'QoS', icon: Zap, group: 'Diseño de Red', badge: 'Nuevo' },
  { id: 'services', label: 'Servicios', icon: Server, group: 'Infraestructura' },
  { id: 'users', label: 'Usuarios', icon: BarChart3, group: 'Infraestructura' },
  { id: 'floors', label: 'Pisos', icon: LayoutDashboard, group: 'Infraestructura' },
  { id: 'equipment', label: 'Equipos', icon: Network, group: 'Infraestructura' },
  { id: 'topology', label: 'Topología', icon: Map, group: 'Infraestructura' },
  { id: 'commands', label: 'Comandos', icon: Terminal, group: 'Configuración' },
  { id: 'costs', label: 'Costos', icon: DollarSign, group: 'Análisis', badge: 'Nuevo' },
  { id: 'redundancy', label: 'Redundancia', icon: Shield, group: 'Análisis', badge: 'Nuevo' },
  { id: 'proposals', label: 'Propuestas', icon: FileText, group: 'Gestión' },
  { id: 'import', label: 'Importar', icon: Upload, group: 'Gestión' },
];

const GROUPS = ['Principal', 'Diseño de Red', 'Infraestructura', 'Configuración', 'Análisis', 'Gestión'];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onSave: () => void;
  onExport: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onSave, onExport }: SidebarProps) {
  const { proposalName, totalUsers, savedProposals } = useNetwork();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 relative',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{
        backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389557791/AzGkYhP8yN3ea6WaKvqgT4/sidebar-bg-93wEnkRmSCR7n3VfRJjPtg.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0F2744]/90 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo / Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-bold text-white text-sm leading-tight">RedCalc Pro</div>
              <div className="text-xs text-blue-300 truncate">Infraestructura de Red</div>
            </div>
          )}
        </div>

        {/* Proposal info */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <div className="text-xs text-blue-300 mb-1">Propuesta activa</div>
            <div className="text-sm font-medium text-white truncate">{proposalName}</div>
            <div className="text-xs text-blue-400 mt-1">
              {totalUsers.toLocaleString()} usuarios totales
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
          {GROUPS.map(group => {
            const items = NAV_ITEMS.filter(i => i.group === group);
            return (
              <div key={group} className="mb-3">
                {!collapsed && (
                  <div className="px-2 py-1 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {group}
                  </div>
                )}
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-all duration-150',
                      activeTab === item.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-blue-200 hover:bg-sidebar-accent hover:text-white'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-medium">
                            {item.badge}
                          </span>
                        )}
                        {item.id === 'proposals' && savedProposals.length > 0 && (
                          <span className="text-xs bg-blue-700 text-blue-200 px-1.5 py-0.5 rounded-full">
                            {savedProposals.length}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          <button
            onClick={onSave}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm text-blue-200 hover:bg-sidebar-accent hover:text-white transition-colors"
          >
            <Save className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Guardar Propuesta</span>}
          </button>
          <button
            onClick={onExport}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm text-blue-200 hover:bg-sidebar-accent hover:text-white transition-colors"
          >
            <Download className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Exportar JSON</span>}
          </button>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 bg-blue-600 border border-blue-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-500 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
