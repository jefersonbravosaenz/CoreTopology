// RedCalc Pro - Topology Panel with SVG Diagram
// Design: Corporate Precision

import { useMemo, useState } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { calculateEquipment, generateTopology } from '@/lib/networkCalc';
import { Map, Network, Shield, Server, Wifi, Globe, Zap, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TopologyNode } from '@/lib/networkTypes';

const NODE_ICONS: Record<string, string> = {
  internet: '🌐',
  firewall: '🛡',
  core: '⚡',
  distribution: '🔀',
  access: '🔌',
  server: '🖥',
  ap: '📡',
  endpoint: '💻',
  router: '🔁',
};

const NODE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  internet: { fill: '#EFF6FF', stroke: '#2563EB', text: '#1D4ED8' },
  firewall: { fill: '#FEF2F2', stroke: '#DC2626', text: '#B91C1C' },
  core: { fill: '#FFF7ED', stroke: '#EA580C', text: '#C2410C' },
  distribution: { fill: '#F0FDF4', stroke: '#16A34A', text: '#15803D' },
  access: { fill: '#EFF6FF', stroke: '#3B82F6', text: '#2563EB' },
  server: { fill: '#F5F3FF', stroke: '#7C3AED', text: '#6D28D9' },
  ap: { fill: '#F0F9FF', stroke: '#0EA5E9', text: '#0284C7' },
  endpoint: { fill: '#F9FAFB', stroke: '#9CA3AF', text: '#6B7280' },
  router: { fill: '#FEFCE8', stroke: '#CA8A04', text: '#A16207' },
};

const LINK_COLORS: Record<string, string> = {
  fiber: '#2563EB',
  copper: '#6B7280',
  wireless: '#0EA5E9',
  wan: '#DC2626',
};

function TopologyDiagramSVG({ siteIndex }: { siteIndex: number }) {
  const { sites, vlans } = useNetwork();
  const equipment = useMemo(() => calculateEquipment(sites, vlans), [sites, vlans]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const site = sites[siteIndex];
  const eq = equipment[siteIndex];
  if (!site || !eq) return null;

  const diagram = useMemo(() => generateTopology(site, eq), [site, eq]);

  const NODE_W = 90;
  const NODE_H = 50;

  return (
    <div className="overflow-auto">
      <svg
        viewBox="0 0 800 700"
        className="w-full max-w-3xl mx-auto"
        style={{ minHeight: 400 }}
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f4f8" strokeWidth="1" />
          </pattern>
          <marker id="arrow-fiber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#2563EB" />
          </marker>
          <marker id="arrow-copper" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#6B7280" />
          </marker>
          <marker id="arrow-wireless" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#0EA5E9" />
          </marker>
          <marker id="arrow-wan" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#DC2626" />
          </marker>
        </defs>
        <rect width="800" height="700" fill="url(#grid)" />

        {/* Links */}
        {diagram.links.map((link, i) => {
          const fromNode = diagram.nodes.find(n => n.id === link.from);
          const toNode = diagram.nodes.find(n => n.id === link.to);
          if (!fromNode || !toNode) return null;

          const x1 = fromNode.x;
          const y1 = fromNode.y + NODE_H / 2;
          const x2 = toNode.x;
          const y2 = toNode.y - NODE_H / 2;
          const color = LINK_COLORS[link.type] || '#9CA3AF';
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <g key={i}>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color}
                strokeWidth={link.type === 'fiber' ? 2.5 : link.type === 'wan' ? 2 : 1.5}
                strokeDasharray={link.type === 'wireless' ? '5,3' : link.type === 'wan' ? '8,4' : undefined}
                markerEnd={`url(#arrow-${link.type})`}
                opacity={0.7}
              />
              {link.speed && (
                <text x={midX + 4} y={midY} fontSize="9" fill={color} fontFamily="monospace" opacity={0.9}>
                  {link.speed}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {diagram.nodes.map(node => {
          const colors = NODE_COLORS[node.type] || NODE_COLORS.endpoint;
          const isHovered = hoveredNode === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x - NODE_W / 2}, ${node.y - NODE_H / 2})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                width={NODE_W} height={NODE_H}
                rx="8" ry="8"
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={isHovered ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' : undefined}
              />
              <text
                x={NODE_W / 2} y={18}
                textAnchor="middle"
                fontSize="14"
              >
                {NODE_ICONS[node.type] || '📦'}
              </text>
              <text
                x={NODE_W / 2} y={32}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill={colors.text}
                fontFamily="system-ui, sans-serif"
              >
                {node.label}
              </text>
              {node.count && node.count > 1 && (
                <text
                  x={NODE_W / 2} y={43}
                  textAnchor="middle"
                  fontSize="8"
                  fill={colors.text}
                  opacity={0.7}
                  fontFamily="monospace"
                >
                  ×{node.count}
                </text>
              )}
              {node.details && isHovered && (
                <text
                  x={NODE_W / 2} y={43}
                  textAnchor="middle"
                  fontSize="8"
                  fill={colors.text}
                  opacity={0.8}
                >
                  {node.details}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function TopologyPanel() {
  const { sites } = useNetwork();
  const [siteIndex, setSiteIndex] = useState(0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Diagrama de Topología</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Diagrama lógico de la infraestructura de red por sede
        </p>
      </div>

      {/* Site selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Sede:</span>
        <Select value={String(siteIndex)} onValueChange={v => setSiteIndex(parseInt(v))}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sites.map((s, i) => (
              <SelectItem key={s.id} value={String(i)}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Diagram */}
      <div className="rc-card p-4">
        <TopologyDiagramSVG siteIndex={siteIndex} />
      </div>

      {/* Legend */}
      <div className="rc-card p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Leyenda</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div className="text-xs font-semibold mb-2">Nodos</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              {Object.entries(NODE_ICONS).map(([type, icon]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span>{icon}</span>
                  <span className="capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2">Tipos de Enlace</div>
            <div className="space-y-1 text-xs">
              {Object.entries(LINK_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5" style={{ backgroundColor: color }} />
                  <span className="text-muted-foreground capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hierarchy description */}
      <div className="rc-card p-5 rc-card-accent-blue">
        <h3 className="font-semibold text-sm mb-3">Arquitectura de Tres Capas (Cisco)</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-orange-600 w-24 flex-shrink-0">Core:</span>
            <span>Switches de alta velocidad (10 Gbps) con redundancia VSS. Enrutamiento rápido entre distribución y acceso a Internet.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-green-600 w-24 flex-shrink-0">Distribución:</span>
            <span>Switches L3 con routing inter-VLAN, políticas de seguridad y QoS. Conectan switches de acceso al core.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-blue-600 w-24 flex-shrink-0">Acceso:</span>
            <span>Switches L2 con PoE+ para dispositivos finales. Configurados con port-security, DHCP snooping y spanning-tree portfast.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
