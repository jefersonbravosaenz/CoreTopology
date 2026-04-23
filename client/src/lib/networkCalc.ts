// RedCalc Pro - Network Calculation Engine
// Handles VLSM, bandwidth, equipment, costs, redundancy, QoS

import type {
  Site, VLAN, SubnetResult, SiteIPResult, BandwidthResult,
  Equipment, SiteEquipment, TopologyDiagram, TopologyNode, TopologyLink,
  RedundancyAnalysis, CostEstimate, ServiceConfig
} from './networkTypes';

// ─── IP / VLSM Calculations ───────────────────────────────────────────────────

function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

function nextPowerOf2(n: number): number {
  let p = 2;
  while (p < n + 2) p <<= 1; // +2 for network and broadcast
  return p;
}

function prefixFromHosts(hosts: number): number {
  const size = nextPowerOf2(hosts);
  return 32 - Math.log2(size);
}

export function calculateVLSM(
  sites: Site[],
  vlans: VLAN[],
  baseNetwork = '10.0.0.0'
): SiteIPResult[] {
  const results: SiteIPResult[] = [];
  let currentBase = ipToInt(baseNetwork);

  // Assign /16 block per site
  for (const site of sites) {
    const siteBlock = intToIp(currentBase);
    const sitePrefix = 16;
    let subnetBase = currentBase;
    const subnets: SubnetResult[] = [];

    // Sort VLANs by user count descending (VLSM best practice)
    const vlansSorted = [...vlans].sort((a, b) => {
      const usersA = Math.ceil(site.users * a.userPercent / 100);
      const usersB = Math.ceil(site.users * b.userPercent / 100);
      return usersB - usersA;
    });

    for (const vlan of vlansSorted) {
      let users = Math.ceil(site.users * vlan.userPercent / 100);
      if (users === 0) users = 6; // minimum for infrastructure VLANs

      const prefix = prefixFromHosts(users);
      const size = Math.pow(2, 32 - prefix);

      // Align to block boundary
      if (subnetBase % size !== 0) {
        subnetBase = Math.ceil(subnetBase / size) * size;
      }

      const networkAddr = intToIp(subnetBase);
      const broadcastAddr = intToIp(subnetBase + size - 1);
      const firstHost = intToIp(subnetBase + 1);
      const lastHost = intToIp(subnetBase + size - 2);
      const gateway = firstHost;
      const hosts = size - 2;
      const utilization = Math.round((users / hosts) * 100);

      subnets.push({
        vlanId: vlan.id,
        area: vlan.area,
        users,
        subnet: `${networkAddr}/${prefix}`,
        mask: prefixToMask(prefix),
        prefix,
        hosts,
        utilization,
        networkAddress: networkAddr,
        broadcastAddress: broadcastAddr,
        firstHost,
        lastHost,
        gateway,
      });

      subnetBase += size;
    }

    results.push({
      siteId: site.id,
      siteName: site.name,
      siteBlock: `${siteBlock}/${sitePrefix}`,
      sitePrefix,
      subnets,
    });

    // Move to next /16 block
    currentBase += Math.pow(2, 32 - sitePrefix);
  }

  return results;
}

function prefixToMask(prefix: number): string {
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  return intToIp(mask);
}

// ─── Bandwidth Calculations ───────────────────────────────────────────────────

export function calculateBandwidth(sites: Site[]): BandwidthResult[] {
  return sites.map(site => {
    const bwRequired = parseFloat(((site.users * 5 * 0.7) / 1000).toFixed(2)); // Gbps
    const bwRecommended = parseFloat((bwRequired * 1.3).toFixed(2));
    const bwBackup = parseFloat((bwRecommended * 0.5).toFixed(2));

    let linkRecommended: string;
    let linkSpeed: number;

    if (bwRecommended <= 1) {
      linkRecommended = '1 Gbps Fibra';
      linkSpeed = 1;
    } else if (bwRecommended <= 2.5) {
      linkRecommended = '2-3 Gbps Fibra';
      linkSpeed = 2.5;
    } else if (bwRecommended <= 5) {
      linkRecommended = '5 Gbps Fibra';
      linkSpeed = 5;
    } else if (bwRecommended <= 10) {
      linkRecommended = '10 Gbps Fibra';
      linkSpeed = 10;
    } else {
      linkRecommended = '40 Gbps Fibra';
      linkSpeed = 40;
    }

    return {
      siteId: site.id,
      siteName: site.name,
      users: site.users,
      bwRequired,
      bwRecommended,
      bwBackup,
      linkRecommended,
      linkSpeed,
    };
  });
}

// ─── Equipment Calculations ───────────────────────────────────────────────────

export function calculateEquipment(sites: Site[], vlans: VLAN[]): SiteEquipment[] {
  return sites.map(site => {
    const floors = site.floors || Math.ceil(site.users / 100);
    const accessSwitches = Math.ceil(site.users / 48);
    const distSwitches = Math.max(2, Math.ceil(accessSwitches / 6));
    const coreSwitches = 2; // Always redundant pair
    const firewalls = 2; // HA pair
    const routers = 2; // Redundant
    const cameras = Math.ceil(site.users * 0.04 * 10) / 10;
    const aps = Math.ceil(site.users / 30);
    const servers = Math.max(2, Math.ceil(site.users / 300));
    const ups = Math.max(2, Math.ceil(site.users / 500));
    const patchPanels = accessSwitches * 2;

    const equipment: Equipment[] = [
      {
        type: 'Switches de Acceso (L2)',
        quantity: accessSwitches,
        model: 'Cisco Catalyst 2960X-48TS-L',
        specs: '48 puertos Gigabit + 2 SFP, PoE+',
        purpose: 'Conectar dispositivos finales (PCs, impresoras, cámaras)',
        unitCost: 2800,
        category: 'switching',
      },
      {
        type: 'Switches de Distribución (L3)',
        quantity: distSwitches,
        model: 'Cisco Catalyst 3650-24TS',
        specs: '24 puertos Gigabit + 4 SFP, Routing',
        purpose: 'Agregación y routing inter-VLAN',
        unitCost: 5500,
        category: 'switching',
      },
      {
        type: 'Switches Core (L3)',
        quantity: coreSwitches,
        model: 'Cisco Catalyst 6500 VSS',
        specs: '10 Gbps, Redundancia VSS',
        purpose: 'Núcleo de la red con alta disponibilidad',
        unitCost: 28000,
        category: 'switching',
      },
      {
        type: 'Firewalls',
        quantity: firewalls,
        model: 'Cisco ASA 5515-X',
        specs: 'Throughput 1.3 Gbps, IPS/IDS',
        purpose: 'Seguridad perimetral y control de tráfico',
        unitCost: 4500,
        category: 'security',
      },
      {
        type: 'Routers',
        quantity: routers,
        model: 'Cisco ISR 4321',
        specs: '2 puertos Gigabit, VPN, QoS',
        purpose: 'Interconexión de sedes y acceso a internet',
        unitCost: 3200,
        category: 'routing',
      },
      {
        type: 'Cámaras de Seguridad',
        quantity: Math.round(cameras),
        model: 'Hikvision DS-2CD2143G0-I',
        specs: '4MP, PoE, IR 30m',
        purpose: 'Vigilancia y seguridad física',
        unitCost: 180,
        category: 'physical',
      },
      {
        type: 'Puntos de Acceso WiFi (APs)',
        quantity: aps,
        model: 'Cisco Aironet 2800',
        specs: 'WiFi 6 (802.11ax), PoE+',
        purpose: 'Cobertura inalámbrica para dispositivos móviles',
        unitCost: 650,
        category: 'wireless',
      },
      {
        type: 'Servidores',
        quantity: servers,
        model: 'Dell PowerEdge R750',
        specs: '2x Xeon, 256GB RAM, SSD NVMe',
        purpose: 'Almacenamiento, aplicaciones, base de datos',
        unitCost: 12000,
        category: 'servers',
      },
      {
        type: 'UPS (Sistemas de Respaldo)',
        quantity: ups,
        model: 'APC Smart-UPS 10000VA',
        specs: '10kVA, 8 min autonomía',
        purpose: 'Respaldo de energía para equipos críticos',
        unitCost: 3800,
        category: 'power',
      },
      {
        type: 'Patch Panel',
        quantity: patchPanels,
        model: '24 puertos Cat6A',
        specs: '24 puertos Cat6A',
        purpose: 'Gestión del cableado estructurado',
        unitCost: 120,
        category: 'physical',
      },
    ];

    const totalCost = equipment.reduce((sum, eq) => sum + eq.quantity * eq.unitCost, 0);

    return {
      siteId: site.id,
      siteName: site.name,
      equipment,
      totalCost,
    };
  });
}

// ─── Cost Estimation ──────────────────────────────────────────────────────────

export function calculateCosts(siteEquipment: SiteEquipment[]): CostEstimate[] {
  return siteEquipment.map(se => {
    const equipmentCost = se.totalCost;
    const installation = Math.round(equipmentCost * 0.15);
    const cabling = Math.round(equipmentCost * 0.08);
    const licenses = Math.round(equipmentCost * 0.12);
    const maintenance = Math.round(equipmentCost * 0.18); // annual
    const total = equipmentCost + installation + cabling + licenses;

    return {
      siteId: se.siteId,
      siteName: se.siteName,
      equipment: equipmentCost,
      installation,
      cabling,
      licenses,
      maintenance,
      total,
    };
  });
}

// ─── Redundancy Analysis ──────────────────────────────────────────────────────

export function analyzeRedundancy(
  sites: Site[],
  siteEquipment: SiteEquipment[]
): RedundancyAnalysis[] {
  return sites.map(site => {
    const eq = siteEquipment.find(se => se.siteId === site.id);
    const spof: string[] = [];
    const recommendations: string[] = [];

    const firewalls = eq?.equipment.find(e => e.type === 'Firewalls')?.quantity || 0;
    const core = eq?.equipment.find(e => e.type === 'Switches Core (L3)')?.quantity || 0;
    const routers = eq?.equipment.find(e => e.type === 'Routers')?.quantity || 0;
    const ups = eq?.equipment.find(e => e.type === 'UPS (Sistemas de Respaldo)')?.quantity || 0;

    if (firewalls < 2) {
      spof.push('Firewall único (sin HA)');
      recommendations.push('Implementar par de firewalls en modo Active/Standby');
    }
    if (core < 2) {
      spof.push('Switch Core único');
      recommendations.push('Agregar segundo switch core con VSS/Stack');
    }
    if (routers < 2) {
      spof.push('Router único (sin redundancia WAN)');
      recommendations.push('Implementar segundo router con HSRP/VRRP');
    }
    if (ups < 2) {
      spof.push('UPS insuficientes para cobertura total');
      recommendations.push('Agregar UPS adicionales para cobertura N+1');
    }

    // Check for dual ISP
    recommendations.push('Considerar enlace WAN secundario con ISP diferente');
    recommendations.push('Implementar protocolo STP Rapid-PVST+ con BPDU Guard');

    const haScore = Math.max(0, 100 - spof.length * 20);
    let redundancyLevel: RedundancyAnalysis['redundancyLevel'];
    if (haScore >= 90) redundancyLevel = 'Full';
    else if (haScore >= 70) redundancyLevel = 'Enhanced';
    else if (haScore >= 50) redundancyLevel = 'Basic';
    else redundancyLevel = 'None';

    return {
      siteId: site.id,
      haScore,
      singlePointsOfFailure: spof,
      recommendations,
      redundancyLevel,
    };
  });
}

// ─── Topology Generation ──────────────────────────────────────────────────────

export function generateTopology(site: Site, equipment: SiteEquipment): TopologyDiagram {
  const eq = equipment.equipment;
  const accessCount = eq.find(e => e.type === 'Switches de Acceso (L2)')?.quantity || 1;
  const distCount = eq.find(e => e.type === 'Switches de Distribución (L3)')?.quantity || 1;
  const apsCount = eq.find(e => e.type === 'Puntos de Acceso WiFi (APs)')?.quantity || 1;
  const cameraCount = eq.find(e => e.type === 'Cámaras de Seguridad')?.quantity || 0;
  const serverCount = eq.find(e => e.type === 'Servidores')?.quantity || 1;

  const nodes: TopologyNode[] = [
    { id: 'internet', label: 'INTERNET', type: 'internet', x: 400, y: 20 },
    { id: 'fw1', label: 'Firewall HA', type: 'firewall', x: 200, y: 100, count: 2, details: 'Active/Standby' },
    { id: 'fw2', label: 'Firewall HA', type: 'firewall', x: 600, y: 100, count: 2, details: 'Active/Standby' },
    { id: 'core1', label: 'Core L3', type: 'core', x: 280, y: 200, details: 'VSS/Stack' },
    { id: 'core2', label: 'Core L3', type: 'core', x: 520, y: 200, details: 'VSS/Stack' },
    { id: 'dist1', label: 'Distribución L3', type: 'distribution', x: 160, y: 320, details: 'EtherChannel' },
    { id: 'dist2', label: 'Distribución L3', type: 'distribution', x: 400, y: 320, details: 'EtherChannel' },
    { id: 'dist3', label: 'Distribución L3', type: 'distribution', x: 640, y: 320, details: 'EtherChannel' },
    { id: 'access1', label: 'Acceso L2', type: 'access', x: 100, y: 440, count: Math.ceil(accessCount / 3) },
    { id: 'access2', label: 'Acceso L2', type: 'access', x: 340, y: 440, count: Math.ceil(accessCount / 3) },
    { id: 'access3', label: 'Acceso L2', type: 'access', x: 580, y: 440, count: Math.floor(accessCount / 3) },
    { id: 'servers', label: 'Servidores', type: 'server', x: 700, y: 440, count: serverCount },
    { id: 'pcs', label: 'PCs/Impresoras', type: 'endpoint', x: 80, y: 560, count: Math.round(site.users * 0.7) },
    { id: 'cameras', label: 'Cámaras', type: 'endpoint', x: 220, y: 560, count: cameraCount },
    { id: 'aps', label: 'APs WiFi', type: 'ap', x: 360, y: 560, count: apsCount },
    { id: 'mobile', label: 'Dispositivos Móviles', type: 'endpoint', x: 500, y: 640, count: Math.round(site.users * 0.3) },
  ];

  const links: TopologyLink[] = [
    { from: 'internet', to: 'fw1', type: 'wan', speed: '1 Gbps' },
    { from: 'internet', to: 'fw2', type: 'wan', speed: '1 Gbps' },
    { from: 'fw1', to: 'core1', type: 'fiber', speed: '10G' },
    { from: 'fw2', to: 'core2', type: 'fiber', speed: '10G' },
    { from: 'core1', to: 'core2', type: 'fiber', speed: '10G VSS' },
    { from: 'core1', to: 'dist1', type: 'fiber', speed: '10G' },
    { from: 'core1', to: 'dist2', type: 'fiber', speed: '10G' },
    { from: 'core2', to: 'dist2', type: 'fiber', speed: '10G' },
    { from: 'core2', to: 'dist3', type: 'fiber', speed: '10G' },
    { from: 'dist1', to: 'access1', type: 'fiber', speed: '1G' },
    { from: 'dist2', to: 'access2', type: 'fiber', speed: '1G' },
    { from: 'dist3', to: 'access3', type: 'fiber', speed: '1G' },
    { from: 'dist3', to: 'servers', type: 'fiber', speed: '10G' },
    { from: 'access1', to: 'pcs', type: 'copper', speed: '1G' },
    { from: 'access1', to: 'cameras', type: 'copper', speed: '100M' },
    { from: 'access2', to: 'aps', type: 'copper', speed: '1G' },
    { from: 'aps', to: 'mobile', type: 'wireless', speed: 'WiFi 6' },
  ];

  return { siteId: site.id, nodes, links };
}

// ─── Command Generation ───────────────────────────────────────────────────────

export function generateCommands(
  vlans: VLAN[],
  ipResults: SiteIPResult[],
  vendor: string,
  deviceType: string,
  siteIndex = 0
): string {
  const site = ipResults[siteIndex];

  if (vendor === 'cisco' && deviceType === 'switch') {
    return generateCiscoSwitchConfig(vlans, site);
  } else if (vendor === 'cisco' && deviceType === 'router') {
    return generateCiscoRouterConfig(vlans, site);
  } else if (vendor === 'cisco' && deviceType === 'firewall') {
    return generateCiscoFirewallConfig(vlans, site);
  } else if (vendor === 'hp') {
    return generateHPConfig(vlans, site, deviceType);
  } else if (vendor === 'juniper') {
    return generateJuniperConfig(vlans, site, deviceType);
  } else if (vendor === 'mikrotik') {
    return generateMikroTikConfig(vlans, site);
  } else if (vendor === 'fortinet') {
    return generateFortinetConfig(vlans, site, deviceType);
  }

  return '! Vendor no soportado';
}

function generateCiscoSwitchConfig(vlans: VLAN[], site?: SiteIPResult): string {
  const lines: string[] = [
    '! ===== CONFIGURACIÓN CISCO SWITCH =====',
    `! Sede: ${site?.siteName || 'N/A'} | Bloque: ${site?.siteBlock || 'N/A'}`,
    'configure terminal',
    '',
    '! ── Crear VLANs ──',
  ];

  for (const v of vlans) {
    lines.push(`vlan ${v.id}`);
    lines.push(` name ${v.name}`);
  }

  lines.push('', '! ── Spanning Tree (Rapid-PVST+) ──');
  lines.push('spanning-tree mode rapid-pvst');
  lines.push(`spanning-tree vlan ${vlans.map(v => v.id).join(',')} priority 24576`);

  lines.push('', '! ── Puertos de Acceso ──');
  lines.push('interface range GigabitEthernet1/0/1-48');
  lines.push(' switchport mode access');
  lines.push(' switchport access vlan 20');
  lines.push(' spanning-tree portfast');
  lines.push(' spanning-tree bpduguard enable');
  lines.push(' storm-control broadcast level 20');
  lines.push(' storm-control action shutdown');

  lines.push('', '! ── Puertos Trunk ──');
  lines.push('interface GigabitEthernet1/0/49-50');
  lines.push(' switchport mode trunk');
  lines.push(` switchport trunk allowed vlan ${vlans.map(v => v.id).join(',')}`);
  lines.push(' spanning-tree link-type point-to-point');
  lines.push(' channel-group 1 mode active');

  lines.push('', '! ── EtherChannel ──');
  lines.push('interface Port-channel1');
  lines.push(' switchport mode trunk');
  lines.push(` switchport trunk allowed vlan ${vlans.map(v => v.id).join(',')}`);

  lines.push('', '! ── QoS ──');
  lines.push('mls qos');
  lines.push('mls qos map cos-dscp 0 8 16 24 32 40 46 56');
  lines.push('interface range GigabitEthernet1/0/1-48');
  lines.push(' mls qos trust dscp');

  lines.push('', '! ── Seguridad de Puertos ──');
  lines.push('interface range GigabitEthernet1/0/1-48');
  lines.push(' switchport port-security maximum 3');
  lines.push(' switchport port-security violation restrict');
  lines.push(' switchport port-security');
  lines.push(' ip dhcp snooping limit rate 15');

  lines.push('', '! ── DHCP Snooping ──');
  lines.push('ip dhcp snooping');
  lines.push(`ip dhcp snooping vlan ${vlans.map(v => v.id).join(',')}`);
  lines.push('no ip dhcp snooping information option');

  if (site) {
    lines.push('', '! ── Interfaces SVI (Routing inter-VLAN) ──');
    for (const subnet of site.subnets) {
      const vlan = vlans.find(v => v.id === subnet.vlanId);
      if (vlan) {
        lines.push(`interface Vlan${vlan.id}`);
        lines.push(` description ${vlan.area}`);
        lines.push(` ip address ${subnet.gateway} ${subnet.mask}`);
        lines.push(' no shutdown');
      }
    }
  }

  lines.push('', '! ── Gestión ──');
  lines.push('interface Vlan10');
  lines.push(' description Gestion');
  lines.push('ip default-gateway 10.0.0.1');
  lines.push('service password-encryption');
  lines.push('enable secret <contraseña_segura>');
  lines.push('');
  lines.push('end');
  lines.push('write memory');

  return lines.join('\n');
}

function generateCiscoRouterConfig(vlans: VLAN[], site?: SiteIPResult): string {
  const lines: string[] = [
    '! ===== CONFIGURACIÓN CISCO ROUTER =====',
    `! Sede: ${site?.siteName || 'N/A'}`,
    'configure terminal',
    '',
    '! ── Interfaces WAN ──',
    'interface GigabitEthernet0/0',
    ' description WAN-Principal',
    ' ip address dhcp',
    ' ip nat outside',
    ' no shutdown',
    '',
    'interface GigabitEthernet0/1',
    ' description WAN-Respaldo',
    ' ip address dhcp',
    ' ip nat outside',
    ' no shutdown',
    '',
    '! ── Interfaz LAN (Trunk a Core) ──',
    'interface GigabitEthernet0/2',
    ' description LAN-Trunk',
    ' no shutdown',
    '',
  ];

  if (site) {
    for (const subnet of site.subnets) {
      const vlan = vlans.find(v => v.id === subnet.vlanId);
      if (vlan) {
        lines.push(`interface GigabitEthernet0/2.${vlan.id}`);
        lines.push(` description VLAN${vlan.id}-${vlan.area}`);
        lines.push(` encapsulation dot1Q ${vlan.id}`);
        lines.push(` ip address ${subnet.gateway} ${subnet.mask}`);
        lines.push(` ip nat inside`);
        lines.push('');
      }
    }
  }

  lines.push('! ── NAT ──');
  lines.push('ip nat inside source list 10 interface GigabitEthernet0/0 overload');
  lines.push('ip nat inside source list 10 interface GigabitEthernet0/1 overload');
  lines.push('access-list 10 permit 10.0.0.0 0.255.255.255');
  lines.push('');
  lines.push('! ── Rutas estáticas ──');
  lines.push('ip route 0.0.0.0 0.0.0.0 <gateway_isp1> 10');
  lines.push('ip route 0.0.0.0 0.0.0.0 <gateway_isp2> 20');
  lines.push('');
  lines.push('! ── HSRP (Redundancia) ──');
  lines.push('interface GigabitEthernet0/2.10');
  lines.push(' standby 10 ip 10.0.0.1');
  lines.push(' standby 10 priority 110');
  lines.push(' standby 10 preempt');
  lines.push('');
  lines.push('! ── QoS ──');
  lines.push('policy-map VOIP-POLICY');
  lines.push(' class VOIP-CLASS');
  lines.push('  priority percent 30');
  lines.push(' class class-default');
  lines.push('  fair-queue');
  lines.push('');
  lines.push('end');
  lines.push('write memory');

  return lines.join('\n');
}

function generateCiscoFirewallConfig(vlans: VLAN[], site?: SiteIPResult): string {
  const lines: string[] = [
    '! ===== CONFIGURACIÓN CISCO ASA FIREWALL =====',
    `! Sede: ${site?.siteName || 'N/A'}`,
    '',
    '! ── Interfaces ──',
    'interface GigabitEthernet0/0',
    ' nameif outside',
    ' security-level 0',
    ' ip address dhcp',
    ' no shutdown',
    '',
    'interface GigabitEthernet0/1',
    ' nameif inside',
    ' security-level 100',
    ' ip address 10.0.0.254 255.255.0.0',
    ' no shutdown',
    '',
    'interface GigabitEthernet0/2',
    ' nameif dmz',
    ' security-level 50',
    ' ip address 172.16.0.1 255.255.255.0',
    ' no shutdown',
    '',
    '! ── Políticas de Acceso ──',
    'access-list OUTSIDE-IN extended permit tcp any any eq 443',
    'access-list OUTSIDE-IN extended permit tcp any any eq 80',
    'access-list OUTSIDE-IN extended deny ip any any log',
    '',
    'access-list INSIDE-OUT extended permit ip 10.0.0.0 255.255.0.0 any',
    'access-list INSIDE-OUT extended deny ip any any log',
    '',
    '! ── NAT ──',
    'nat (inside,outside) dynamic interface',
    'nat (dmz,outside) dynamic interface',
    '',
    '! ── Inspección ──',
    'policy-map global_policy',
    ' class inspection_default',
    '  inspect dns',
    '  inspect ftp',
    '  inspect http',
    '  inspect icmp',
    '  inspect sip',
    '  inspect skinny',
    '',
    '! ── IPS/IDS ──',
    'threat-detection basic-threat',
    'threat-detection statistics access-list',
    'threat-detection statistics tcp-intercept rate-interval 30 burst-rate 400 average-rate 200',
    '',
    '! ── Alta Disponibilidad (HA) ──',
    'failover',
    'failover lan unit primary',
    'failover lan interface FAILOVER GigabitEthernet0/3',
    'failover link FAILOVER GigabitEthernet0/3',
    'failover interface ip FAILOVER 192.168.1.1 255.255.255.252 standby 192.168.1.2',
    '',
    'end',
    'write memory',
  ];

  return lines.join('\n');
}

function generateHPConfig(vlans: VLAN[], site?: SiteIPResult, deviceType = 'switch'): string {
  const lines: string[] = [
    `# ===== CONFIGURACIÓN HP/ARUBA ${deviceType.toUpperCase()} =====`,
    `# Sede: ${site?.siteName || 'N/A'}`,
    '',
    '# ── VLANs ──',
  ];

  for (const v of vlans) {
    lines.push(`vlan ${v.id}`);
    lines.push(` name "${v.name}"`);
  }

  lines.push('', '# ── Spanning Tree ──');
  lines.push('spanning-tree');
  lines.push('spanning-tree mode rapid-pvst');

  lines.push('', '# ── Puertos de Acceso ──');
  lines.push('interface 1-48');
  lines.push(' vlan access 20');
  lines.push(' spanning-tree port-mode edge');

  lines.push('', '# ── Puertos Trunk ──');
  lines.push('interface 49-50');
  lines.push(' vlan trunk allowed all');
  lines.push(' spanning-tree port-mode normal');

  if (site) {
    lines.push('', '# ── Interfaces IP ──');
    for (const subnet of site.subnets) {
      const vlan = vlans.find(v => v.id === subnet.vlanId);
      if (vlan) {
        lines.push(`vlan ${vlan.id}`);
        lines.push(` ip address ${subnet.gateway} ${subnet.mask}`);
      }
    }
  }

  lines.push('', '# ── Seguridad ──');
  lines.push('dhcp-snooping');
  lines.push(`dhcp-snooping vlan ${vlans.map(v => v.id).join(',')}`);
  lines.push('arp-protect');
  lines.push(`arp-protect vlan ${vlans.map(v => v.id).join(',')}`);

  return lines.join('\n');
}

function generateJuniperConfig(vlans: VLAN[], site?: SiteIPResult, deviceType = 'switch'): string {
  const lines: string[] = [
    `# ===== CONFIGURACIÓN JUNIPER ${deviceType.toUpperCase()} =====`,
    `# Sede: ${site?.siteName || 'N/A'}`,
    '',
    'set system host-name SWITCH-CORE',
    'set system root-authentication plain-text-password',
    '',
    '# ── VLANs ──',
  ];

  for (const v of vlans) {
    lines.push(`set vlans ${v.name} vlan-id ${v.id}`);
    if (site) {
      const subnet = site.subnets.find(s => s.vlanId === v.id);
      if (subnet) {
        lines.push(`set vlans ${v.name} l3-interface irb.${v.id}`);
      }
    }
  }

  if (site) {
    lines.push('', '# ── Interfaces IRB (L3) ──');
    for (const subnet of site.subnets) {
      const vlan = vlans.find(v => v.id === subnet.vlanId);
      if (vlan) {
        lines.push(`set interfaces irb unit ${vlan.id} description "${vlan.area}"`);
        lines.push(`set interfaces irb unit ${vlan.id} family inet address ${subnet.gateway}/${subnet.prefix}`);
      }
    }
  }

  lines.push('', '# ── Spanning Tree ──');
  lines.push('set protocols rstp interface all');
  lines.push('set protocols rstp bridge-priority 32768');

  lines.push('', '# ── Puertos de Acceso ──');
  lines.push('set interfaces ge-0/0/0 unit 0 family ethernet-switching interface-mode access');
  lines.push('set interfaces ge-0/0/0 unit 0 family ethernet-switching vlan members VLAN20');

  lines.push('', '# ── Puertos Trunk ──');
  lines.push('set interfaces ge-0/0/48 unit 0 family ethernet-switching interface-mode trunk');
  lines.push(`set interfaces ge-0/0/48 unit 0 family ethernet-switching vlan members [${vlans.map(v => v.name).join(' ')}]`);

  lines.push('', '# ── Commit ──');
  lines.push('commit check');
  lines.push('commit');

  return lines.join('\n');
}

function generateMikroTikConfig(vlans: VLAN[], site?: SiteIPResult): string {
  const lines: string[] = [
    '# ===== CONFIGURACIÓN MIKROTIK ROUTEROS =====',
    `# Sede: ${site?.siteName || 'N/A'}`,
    '',
    '# ── Bridge Principal ──',
    '/interface bridge add name=bridge1 protocol-mode=rstp',
    '',
    '# ── VLANs en Bridge ──',
  ];

  for (const v of vlans) {
    lines.push(`/interface bridge vlan add bridge=bridge1 vlan-ids=${v.id} comment="${v.name}"`);
  }

  lines.push('', '# ── Puertos de Acceso ──');
  lines.push('/interface bridge port add bridge=bridge1 interface=ether1 pvid=20');
  lines.push('/interface bridge port add bridge=bridge1 interface=ether2 pvid=30');

  lines.push('', '# ── Puertos Trunk ──');
  lines.push('/interface bridge port add bridge=bridge1 interface=sfp1 frame-types=admit-only-vlan-tagged');

  if (site) {
    lines.push('', '# ── Interfaces VLAN ──');
    for (const subnet of site.subnets) {
      const vlan = vlans.find(v => v.id === subnet.vlanId);
      if (vlan) {
        lines.push(`/interface vlan add interface=bridge1 name=vlan${vlan.id} vlan-id=${vlan.id}`);
        lines.push(`/ip address add address=${subnet.gateway}/${subnet.prefix} interface=vlan${vlan.id} comment="${vlan.area}"`);
      }
    }
  }

  lines.push('', '# ── DHCP Server ──');
  lines.push('/ip pool add name=pool-vlan20 ranges=10.0.0.10-10.0.0.200');
  lines.push('/ip dhcp-server add address-pool=pool-vlan20 interface=vlan20 name=dhcp-vlan20');

  lines.push('', '# ── Firewall Básico ──');
  lines.push('/ip firewall filter add chain=input action=accept connection-state=established,related');
  lines.push('/ip firewall filter add chain=input action=drop in-interface=ether1');
  lines.push('/ip firewall filter add chain=forward action=accept connection-state=established,related');
  lines.push('/ip firewall filter add chain=forward action=drop connection-state=invalid');

  lines.push('', '# ── QoS (Queue Tree) ──');
  lines.push('/queue type add name=pcq-download kind=pcq pcq-classifier=dst-address');
  lines.push('/queue type add name=pcq-upload kind=pcq pcq-classifier=src-address');
  lines.push('/queue tree add name=download parent=global packet-mark=download queue=pcq-download');

  return lines.join('\n');
}

function generateFortinetConfig(vlans: VLAN[], site?: SiteIPResult, deviceType = 'firewall'): string {
  const lines: string[] = [
    '# ===== CONFIGURACIÓN FORTINET FORTIGATE FIREWALL =====',
    `# Sede: ${site?.siteName || 'N/A'} | Bloque: ${site?.siteBlock || 'N/A'}`,
    '# Generado automáticamente por RedCalc Pro v2.1',
    '# Sintaxis: FortiOS CLI',
    '',
    '# ── CONFIGURACIÓN DE INTERFACES ──',
    '# Define las interfaces WAN/LAN con sus IPs y seguridad',
    'config system interface',
    '  edit "port1"',
    '    # Puerto WAN principal - Conecta a ISP',
    '    set vdom "root"',
    '    set type physical',
    '    set alias "WAN-Principal"',
    '    set role wan',
    '    set ip 0.0.0.0 0.0.0.0',
    '    set allowaccess ping http https ssh',
    '    set mtu-override enable',
    '    set mtu 1500',
    '  next',
    '  edit "port2"',
    '    # Puerto WAN respaldo - Redundancia ISP',
    '    set vdom "root"',
    '    set type physical',
    '    set alias "WAN-Respaldo"',
    '    set role wan',
    '    set ip 0.0.0.0 0.0.0.0',
    '  next',
    '  edit "port3"',
    '    # Puerto LAN principal - Conecta a Core Switch',
    '    set vdom "root"',
    '    set type physical',
    '    set alias "LAN-Principal"',
    '    set role lan',
    `    set ip ${site?.subnets[0]?.gateway || '10.0.0.254'} ${site?.subnets[0]?.mask || '255.255.0.0'}`,
    '    set allowaccess ping http https ssh telnet',
    '  next',
    'end',
    '',
    '# ── CONFIGURACIÓN DE VLANS ──',
    '# Crea sub-interfaces para cada VLAN en el puerto LAN',
    'config system interface',
  ];

  if (site) {
    for (const subnet of site.subnets) {
      const vlan = vlans.find(v => v.id === subnet.vlanId);
      if (vlan) {
        lines.push(`  edit "port3.${vlan.id}"`);
        lines.push(`    # VLAN ${vlan.id} - ${vlan.area} (Prioridad: ${vlan.priority})`);
        lines.push(`    set vdom "root"`);
        lines.push(`    set vlanid ${vlan.id}`);
        lines.push(`    set ip ${subnet.gateway} ${subnet.mask}`);
        lines.push(`    set allowaccess ping http https ssh`);
        lines.push(`  next`);
      }
    }
  }

  lines.push('end');
  lines.push('');
  lines.push('# ── CONFIGURACIÓN DE ZONAS DE SEGURIDAD ──');
  lines.push('# Define niveles de confianza entre zonas');
  lines.push('config system zone');
  lines.push('  edit "WAN"');
  lines.push('    # Zona externa - Menor confianza');
  lines.push('    set interface "port1" "port2"');
  lines.push('  next');
  lines.push('  edit "LAN"');
  lines.push('    # Zona interna - Mayor confianza');
  lines.push('    set interface "port3"');
  for (const vlan of vlans) {
    lines.push(`    append interface "port3.${vlan.id}"`);
  }
  lines.push('  next');
  lines.push('end');
  lines.push('');
  lines.push('# ── POLÍTICAS DE FIREWALL (RULES) ──');
  lines.push('# Define qué tráfico está permitido/denegado');
  lines.push('config firewall policy');
  lines.push('  edit 1');
  lines.push('    # Regla 1: Permitir LAN a WAN (Salida a Internet)');
  lines.push('    set name "LAN-to-WAN"');
  lines.push('    set srcintf "port3"');
  lines.push('    set dstintf "port1"');
  lines.push('    set srcaddr "all"');
  lines.push('    set dstaddr "all"');
  lines.push('    set action accept');
  lines.push('    set schedule "always"');
  lines.push('    set service "ALL"');
  lines.push('    set nat enable');
  lines.push('    set logtraffic all');
  lines.push('  next');
  lines.push('  edit 2');
  lines.push('    # Regla 2: Denegar WAN a LAN (Entrada desde Internet)');
  lines.push('    set name "WAN-to-LAN-DENY"');
  lines.push('    set srcintf "port1"');
  lines.push('    set dstintf "port3"');
  lines.push('    set srcaddr "all"');
  lines.push('    set dstaddr "all"');
  lines.push('    set action deny');
  lines.push('    set schedule "always"');
  lines.push('    set logtraffic all');
  lines.push('  next');
  lines.push('  edit 3');
  lines.push('    # Regla 3: Permitir tráfico entre VLANs');
  lines.push('    set name "Inter-VLAN-Allow"');
  lines.push('    set srcintf "port3"');
  lines.push('    set dstintf "port3"');
  lines.push('    set srcaddr "all"');
  lines.push('    set dstaddr "all"');
  lines.push('    set action accept');
  lines.push('    set schedule "always"');
  lines.push('    set service "ALL"');
  lines.push('  next');
  lines.push('end');
  lines.push('');
  lines.push('# ── CONFIGURACIÓN DE QoS (CALIDAD DE SERVICIO) ──');
  lines.push('# Prioriza tráfico crítico (VoIP, Video, etc)');
  lines.push('config firewall shaper');
  lines.push('  edit "VoIP-Shaper"');
  lines.push('    # Limitador para tráfico VoIP - 30% del ancho');
  lines.push('    set bandwidth 3000');
  lines.push('    set per-policy enable');
  lines.push('  next');
  lines.push('  edit "Video-Shaper"');
  lines.push('    # Limitador para video conferencia - 25% del ancho');
  lines.push('    set bandwidth 2500');
  lines.push('  next');
  lines.push('end');
  lines.push('');
  lines.push('# ── CONFIGURACIÓN DE DHCP ──');
  lines.push('# Servidores DHCP por VLAN');
  lines.push('config system dhcp server');
  lines.push('  edit 1');
  lines.push('    # DHCP para VLAN Administrativo');
  lines.push('    set interface "port3.20"');
  lines.push('    set lease-time 86400');
  lines.push('    config ip-range');
  lines.push('      edit 1');
  lines.push('        set start-ip 10.0.20.100');
  lines.push('        set end-ip 10.0.20.200');
  lines.push('      next');
  lines.push('    end');
  lines.push('  next');
  lines.push('end');
  lines.push('');
  lines.push('# ── CONFIGURACIÓN DE DNS ──');
  lines.push('# Servidores DNS para resolución de nombres');
  lines.push('config system dns');
  lines.push('  set primary 8.8.8.8');
  lines.push('  set secondary 8.8.4.4');
  lines.push('  set dns-over-tls enable');
  lines.push('end');
  lines.push('');
  lines.push('# ── CONFIGURACIÓN DE LOGGING ──');
  lines.push('# Registra eventos de seguridad para auditoría');
  lines.push('config log syslogd setting');
  lines.push('  set status enable');
  lines.push('  set server "192.168.1.100"');
  lines.push('  set port 514');
  lines.push('  set facility local7');
  lines.push('end');
  lines.push('');
  lines.push('# ── CONFIGURACIÓN DE ALTA DISPONIBILIDAD (HA) ──');
  lines.push('# Redundancia automática entre dos FortiGate');
  lines.push('config system ha');
  lines.push('  set mode active-passive');
  lines.push('  set ha-mgmt-status enable');
  lines.push('  set ha-mgmt-interfaces');
  lines.push('    config ha-mgmt-interface');
  lines.push('      edit 1');
  lines.push('        set interface "port4"');
  lines.push('      next');
  lines.push('    end');
  lines.push('  set password "<contraseña_ha_segura>"');
  lines.push('  set hbdev "port4" 0');
  lines.push('  set priority 100');
  lines.push('end');
  lines.push('');
  lines.push('# ── CONFIGURACIÓN DE ANTIVIRUS Y AMENAZAS ──');
  lines.push('# Protección contra malware y ataques');
  lines.push('config antivirus settings');
  lines.push('  set grayware enable');
  lines.push('  set mobile-malware-db enable');
  lines.push('end');
  lines.push('');
  lines.push('# ── CONFIGURACIÓN DE IPS/IDS ──');
  lines.push('# Detección y prevención de intrusiones');
  lines.push('config ips custom-signature');
  lines.push('  # Las firmas personalizadas se configuran aquí');
  lines.push('end');
  lines.push('');
  lines.push('# ── GUARDADO DE CONFIGURACIÓN ──');
  lines.push('# Guarda todos los cambios en memoria');
  lines.push('end');

  return lines.join('\n');
}

// ─── Utility Functions ────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getUtilizationColor(pct: number): string {
  if (pct >= 90) return '#EF4444'; // red
  if (pct >= 70) return '#F59E0B'; // amber
  if (pct >= 50) return '#3B82F6'; // blue
  return '#10B981'; // green
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    'Muy Alta': '#EF4444',
    'Alta': '#F97316',
    'Media-Alta': '#F59E0B',
    'Media': '#3B82F6',
    'Baja': '#6B7280',
  };
  return map[priority] || '#6B7280';
}
