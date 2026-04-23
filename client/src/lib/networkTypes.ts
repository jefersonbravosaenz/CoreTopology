// RedCalc Pro - Network Infrastructure Types
// Design: Corporate Precision - Bauhaus-inspired technical design

export interface Site {
  id: string;
  name: string;
  users: number;
  floors?: number;
  location?: string;
}

export interface VLAN {
  id: number;
  name: string;
  area: string;
  description: string;
  priority: 'Muy Alta' | 'Alta' | 'Media-Alta' | 'Media' | 'Baja';
  cos: number;
  color: string;
  userPercent: number; // % of total users in this VLAN
}

export interface SubnetResult {
  vlanId: number;
  area: string;
  users: number;
  subnet: string;
  mask: string;
  prefix: number;
  hosts: number;
  utilization: number;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  gateway: string;
}

export interface SiteIPResult {
  siteId: string;
  siteName: string;
  siteBlock: string;
  sitePrefix: number;
  subnets: SubnetResult[];
}

export interface BandwidthResult {
  siteId: string;
  siteName: string;
  users: number;
  bwRequired: number; // Gbps
  bwRecommended: number; // Gbps
  bwBackup: number; // Gbps
  linkRecommended: string;
  linkSpeed: number; // Gbps
}

export interface Equipment {
  type: string;
  quantity: number;
  model: string;
  specs: string;
  purpose: string;
  unitCost: number; // USD
  category: 'switching' | 'routing' | 'security' | 'wireless' | 'servers' | 'physical' | 'power';
}

export interface SiteEquipment {
  siteId: string;
  siteName: string;
  equipment: Equipment[];
  totalCost: number;
}

export interface ServiceConfig {
  dhcp: boolean;
  dns: boolean;
  ntp: boolean;
  radius: boolean;
  syslog: boolean;
  snmp: boolean;
  vpn: boolean;
  voip: boolean;
  videoconf: boolean;
  backup: boolean;
  monitoring: boolean;
}

export interface FloorConfig {
  siteId: string;
  floors: number;
  usersPerFloor: number[];
  switchesPerFloor: number[];
  apsPerFloor: number[];
}

export interface TopologyNode {
  id: string;
  label: string;
  type: 'internet' | 'firewall' | 'core' | 'distribution' | 'access' | 'server' | 'ap' | 'endpoint' | 'router';
  x: number;
  y: number;
  count?: number;
  details?: string;
}

export interface TopologyLink {
  from: string;
  to: string;
  label?: string;
  speed?: string;
  type: 'fiber' | 'copper' | 'wireless' | 'wan';
}

export interface TopologyDiagram {
  siteId: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
}

export interface CommandConfig {
  vendor: 'cisco' | 'hp' | 'juniper' | 'mikrotik' | 'fortinet';
  deviceType: 'switch' | 'router' | 'firewall';
  commands: string;
}

export interface QoSConfig {
  enabled: boolean;
  model: 'DiffServ' | 'IntServ';
  queues: QoSQueue[];
}

export interface QoSQueue {
  name: string;
  dscp: number;
  cos: number;
  bandwidth: number; // % of total
  priority: boolean;
  description: string;
}

export interface RedundancyAnalysis {
  siteId: string;
  haScore: number; // 0-100
  singlePointsOfFailure: string[];
  recommendations: string[];
  redundancyLevel: 'None' | 'Basic' | 'Enhanced' | 'Full';
}

export interface CostEstimate {
  siteId: string;
  siteName: string;
  equipment: number;
  installation: number;
  cabling: number;
  licenses: number;
  maintenance: number; // annual
  total: number;
}

export interface NetworkProposal {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sites: Site[];
  vlans: VLAN[];
  baseNetwork: string;
  services: ServiceConfig;
  vendor: 'cisco' | 'hp' | 'juniper' | 'mikrotik' | 'fortinet';
  notes?: string;
}

export const DEFAULT_VLANS: VLAN[] = [
  { id: 10, name: 'TI', area: 'TI', description: 'Gestión de red y administración', priority: 'Alta', cos: 5, color: '#3B82F6', userPercent: 5 },
  { id: 20, name: 'Administrativo', area: 'Administrativo', description: 'Personal administrativo y finanzas', priority: 'Media', cos: 3, color: '#8B5CF6', userPercent: 25 },
  { id: 30, name: 'Operaciones', area: 'Operaciones', description: 'Operaciones core de la empresa', priority: 'Media-Alta', cos: 4, color: '#10B981', userPercent: 45 },
  { id: 40, name: 'RRHH', area: 'RRHH', description: 'Gestión de talento humano', priority: 'Media', cos: 3, color: '#F59E0B', userPercent: 8 },
  { id: 50, name: 'Invitados', area: 'Invitados', description: 'Visitantes y externos', priority: 'Baja', cos: 1, color: '#6B7280', userPercent: 10 },
  { id: 60, name: 'VIP', area: 'VIP', description: 'Directivos y ejecutivos', priority: 'Muy Alta', cos: 6, color: '#EF4444', userPercent: 3 },
  { id: 70, name: 'Servicios', area: 'Servicios', description: 'Telefonía IP, videoconferencia', priority: 'Alta', cos: 5, color: '#EC4899', userPercent: 0 },
  { id: 80, name: 'Servidores', area: 'Servidores', description: 'Servidores y almacenamiento', priority: 'Muy Alta', cos: 6, color: '#14B8A6', userPercent: 0 },
  { id: 90, name: 'Control Acceso', area: 'Control Acceso', description: 'Sistemas de seguridad física', priority: 'Alta', cos: 5, color: '#F97316', userPercent: 0 },
];

export const DEFAULT_SERVICES: ServiceConfig = {
  dhcp: true,
  dns: true,
  ntp: true,
  radius: true,
  syslog: true,
  snmp: true,
  vpn: true,
  voip: true,
  videoconf: true,
  backup: true,
  monitoring: true,
};

export const EQUIPMENT_CATALOG: Record<string, Partial<Equipment>> = {
  'access_switch_small': { model: 'Cisco Catalyst 2960X-24TS-L', specs: '24 puertos Gigabit + 4 SFP', unitCost: 1800 },
  'access_switch_medium': { model: 'Cisco Catalyst 2960X-48TS-L', specs: '48 puertos Gigabit + 2 SFP, PoE+', unitCost: 2800 },
  'distribution_switch': { model: 'Cisco Catalyst 3650-24TS', specs: '24 puertos Gigabit + 4 SFP, Routing', unitCost: 5500 },
  'core_switch': { model: 'Cisco Catalyst 6500 VSS', specs: '10 Gbps, Redundancia VSS', unitCost: 28000 },
  'firewall': { model: 'Cisco ASA 5515-X', specs: 'Throughput 1.2 Gbps, IPS/IDS', unitCost: 4500 },
  'router': { model: 'Cisco ISR 4321', specs: '2 puertos Gigabit, VPN, QoS', unitCost: 3200 },
  'ap_wifi6': { model: 'Cisco Aironet 2800', specs: 'WiFi 6 (802.11ax), PoE+', unitCost: 650 },
  'camera': { model: 'Hikvision DS-2CD2143G0-I', specs: '4MP, PoE, IR 30m', unitCost: 180 },
  'server': { model: 'Dell PowerEdge R750', specs: '2x Xeon, 256GB RAM, SSD NVMe', unitCost: 12000 },
  'ups': { model: 'APC Smart-UPS 10000VA', specs: '10kVA, 8 min autonomía', unitCost: 3800 },
  'patch_panel': { model: 'Patch Panel 24p Cat6A', specs: '24 puertos Cat6A', unitCost: 120 },
};

export const QOS_QUEUES: QoSQueue[] = [
  { name: 'VoIP/Video', dscp: 46, cos: 5, bandwidth: 30, priority: true, description: 'Tráfico de voz y video en tiempo real' },
  { name: 'VIP/Ejecutivos', dscp: 34, cos: 4, bandwidth: 15, priority: false, description: 'Tráfico de usuarios VIP' },
  { name: 'Datos Críticos', dscp: 26, cos: 3, bandwidth: 25, priority: false, description: 'Aplicaciones de negocio críticas' },
  { name: 'Datos Normales', dscp: 18, cos: 2, bandwidth: 20, priority: false, description: 'Tráfico de datos estándar' },
  { name: 'Invitados/Best Effort', dscp: 0, cos: 0, bandwidth: 10, priority: false, description: 'Tráfico de baja prioridad' },
];
