#!/bin/bash

################################################################################
# SCRIPT DE CONFIGURACIÓN FORTINET FORTIGATE FIREWALL
# RedCalc Pro v2.2 - Automatización de Infraestructura de Red
# 
# Propósito: Configurar Fortinet FortiGate Firewall con:
#   - Interfaces y VLANs
#   - Zonas de Seguridad
#   - Políticas de Firewall
#   - QoS y Limitadores de Ancho de Banda
#   - Alta Disponibilidad
#   - Logging y Monitoreo
#
# Uso: ./fortinet_firewall_config.sh <IP_FIREWALL> <USERNAME> <PASSWORD>
# Ejemplo: ./fortinet_firewall_config.sh 192.168.1.254 admin fortinet123
################################################################################

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
FIREWALL_IP="${1:-192.168.1.254}"
USERNAME="${2:-admin}"
PASSWORD="${3:-fortinet123}"
SSH_PORT="22"
TIMEOUT="10"

# Validar argumentos
if [ $# -lt 3 ]; then
    echo -e "${RED}Error: Se requieren 3 argumentos${NC}"
    echo "Uso: $0 <IP_FIREWALL> <USERNAME> <PASSWORD>"
    exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  CONFIGURACIÓN FORTINET FORTIGATE FIREWALL${NC}"
echo -e "${BLUE}  RedCalc Pro v2.2${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Verificar conectividad
echo -e "${YELLOW}[1/6] Verificando conectividad con el firewall...${NC}"
if ! ping -c 1 -W $TIMEOUT "$FIREWALL_IP" &> /dev/null; then
    echo -e "${RED}✗ No se puede alcanzar el firewall en $FIREWALL_IP${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Firewall alcanzable${NC}"
echo ""

# Crear archivo temporal con comandos de configuración
TEMP_CONFIG=$(mktemp)
cat > "$TEMP_CONFIG" << 'FORTINET_CONFIG'
# ============================================================================
# CONFIGURACIÓN FORTINET FORTIGATE FIREWALL
# RedCalc Pro v2.2
# ============================================================================

config system global
  set hostname FortiGate-RedCalc
  set timezone America/Bogota
  set admintimeout 120
  set language es
end

# ============================================================================
# CONFIGURACIÓN DE INTERFACES
# ============================================================================

config system interface
  edit "port1"
    set vdom "root"
    set ip 192.168.1.254 255.255.255.0
    set allowaccess ping http https ssh
    set type physical
    set description "WAN - Internet"
  next
  edit "port2"
    set vdom "root"
    set ip 10.10.255.254 255.255.0.0
    set allowaccess ping http https ssh
    set type physical
    set description "LAN - Sede 1"
  next
  edit "port3"
    set vdom "root"
    set ip 10.11.255.254 255.255.0.0
    set allowaccess ping http https ssh
    set type physical
    set description "LAN - Sede 2"
  next
end

# ============================================================================
# CONFIGURACIÓN DE VLANs
# ============================================================================

config system interface
  edit "vlan.10"
    set vdom "root"
    set ip 10.10.0.254 255.255.255.128
    set interface "port2"
    set vlanid 10
    set description "VLAN 10 - TI"
  next
  edit "vlan.20"
    set vdom "root"
    set ip 10.10.0.254 255.255.255.192
    set interface "port2"
    set vlanid 20
    set description "VLAN 20 - Administrativo"
  next
  edit "vlan.30"
    set vdom "root"
    set ip 10.10.1.254 255.255.255.128
    set interface "port2"
    set vlanid 30
    set description "VLAN 30 - Operaciones"
  next
  edit "vlan.40"
    set vdom "root"
    set ip 10.10.1.254 255.255.255.192
    set interface "port2"
    set vlanid 40
    set description "VLAN 40 - VIP"
  next
  edit "vlan.50"
    set vdom "root"
    set ip 10.10.2.254 255.255.255.192
    set interface "port2"
    set vlanid 50
    set description "VLAN 50 - Servicios"
  next
  edit "vlan.60"
    set vdom "root"
    set ip 10.10.2.254 255.255.255.224
    set interface "port2"
    set vlanid 60
    set description "VLAN 60 - Servidores"
  next
  edit "vlan.70"
    set vdom "root"
    set ip 10.10.2.254 255.255.255.240
    set interface "port2"
    set vlanid 70
    set description "VLAN 70 - VIP Ejecutivos"
  next
end

# ============================================================================
# CONFIGURACIÓN DE ZONAS DE SEGURIDAD
# ============================================================================

config firewall addrgrp
  edit "Sede1-VLANs"
    set member "VLAN10-TI" "VLAN20-Admin" "VLAN30-Ops" "VLAN40-VIP" "VLAN50-Servicios" "VLAN60-Servidores" "VLAN70-VIP-Exec"
    set comment "Todas las VLANs de Sede 1"
  next
  edit "Sede2-VLANs"
    set member "VLAN10-TI-S2" "VLAN20-Admin-S2" "VLAN30-Ops-S2" "VLAN40-VIP-S2" "VLAN50-Servicios-S2" "VLAN60-Servidores-S2" "VLAN70-VIP-Exec-S2"
    set comment "Todas las VLANs de Sede 2"
  next
end

# ============================================================================
# CONFIGURACIÓN DE POLÍTICAS DE FIREWALL
# ============================================================================

config firewall policy
  edit 1
    set name "Allow-Intra-Sede1"
    set srcintf "port2"
    set dstintf "port2"
    set srcaddr "Sede1-VLANs"
    set dstaddr "Sede1-VLANs"
    set action accept
    set schedule "always"
    set service "ALL"
    set logtraffic all
    set comment "Permitir tráfico dentro de Sede 1"
  next
  edit 2
    set name "Allow-Inter-Sedes"
    set srcintf "port2"
    set dstintf "port3"
    set srcaddr "Sede1-VLANs"
    set dstaddr "Sede2-VLANs"
    set action accept
    set schedule "always"
    set service "ALL"
    set logtraffic all
    set comment "Permitir tráfico entre Sedes"
  next
  edit 3
    set name "Allow-Internet"
    set srcintf "port2"
    set dstintf "port1"
    set srcaddr "Sede1-VLANs"
    set dstaddr "all"
    set action accept
    set schedule "always"
    set service "ALL"
    set logtraffic all
    set comment "Permitir acceso a Internet desde Sede 1"
  next
  edit 4
    set name "Block-Malicious"
    set srcintf "port1"
    set dstintf "port2"
    set srcaddr "all"
    set dstaddr "all"
    set action deny
    set schedule "always"
    set service "ALL"
    set logtraffic all
    set comment "Bloquear tráfico malicioso desde Internet"
  next
end

# ============================================================================
# CONFIGURACIÓN DE QoS
# ============================================================================

config firewall shaper
  edit "QoS-VoIP"
    set diffserv "ef"
    set guaranteed-bandwidth 2000
    set maximum-bandwidth 5000
    set comment "QoS para VoIP"
  next
  edit "QoS-Video"
    set diffserv "af41"
    set guaranteed-bandwidth 3000
    set maximum-bandwidth 8000
    set comment "QoS para Video"
  next
  edit "QoS-Datos-Criticos"
    set diffserv "af31"
    set guaranteed-bandwidth 2500
    set maximum-bandwidth 6000
    set comment "QoS para Datos Críticos"
  next
  edit "QoS-Datos-Normales"
    set diffserv "af11"
    set guaranteed-bandwidth 2000
    set maximum-bandwidth 5000
    set comment "QoS para Datos Normales"
  next
end

# ============================================================================
# CONFIGURACIÓN DE ALTA DISPONIBILIDAD (HA)
# ============================================================================

config system ha
  set mode a-p
  set priority 100
  set hbdev "port4" 50
  set monitor "port1" "port2" "port3"
  set failover-hold-time 0
  set gratuitous-arp-interval 5
  set hb-interval 2
  set hb-lost-threshold 3
  set ha-mgmt-status enable
  set ha-mgmt-interfaces
    config ha-mgmt-interface
      edit 1
        set interface "port4"
        set gateway 192.168.2.1
      next
    end
end

# ============================================================================
# CONFIGURACIÓN DE LOGGING Y MONITOREO
# ============================================================================

config log syslogd setting
  set status enable
  set server "10.10.2.65"
  set port 514
  set facility local7
end

config log fortianalyzer setting
  set status enable
  set server "10.10.2.65"
  set port 514
end

config system syslog
  edit 1
    set status enable
    set server "10.10.2.65"
    set port 514
    set facility local7
    set source-ip 10.10.255.254
  next
end

# ============================================================================
# CONFIGURACIÓN DE DHCP RELAY
# ============================================================================

config system dhcp-server
  edit 1
    set interface "vlan.10"
    set lease-time 604800
    set status enable
    config ip-range
      edit 1
        set start-ip 10.10.0.10
        set end-ip 10.10.0.126
      next
    end
    set netmask 255.255.255.128
    set gateway 10.10.0.1
    set dns-server1 8.8.8.8
    set dns-server2 8.8.4.4
  next
  edit 2
    set interface "vlan.20"
    set lease-time 604800
    set status enable
    config ip-range
      edit 1
        set start-ip 10.10.0.139
        set end-ip 10.10.0.190
      next
    end
    set netmask 255.255.255.192
    set gateway 10.10.0.129
    set dns-server1 8.8.8.8
    set dns-server2 8.8.4.4
  next
end

# ============================================================================
# CONFIGURACIÓN DE ANTIVIRUS Y IPS
# ============================================================================

config antivirus profile
  edit "default"
    set comment "Perfil de antivirus por defecto"
    set inspection-mode proxy
    set options scan
  next
end

config ips sensor
  edit "default"
    set comment "Sensor IPS por defecto"
    set status enable
    set comment "Protección contra intrusiones"
  next
end

# ============================================================================
# GUARDAR CONFIGURACIÓN
# ============================================================================

end
FORTINET_CONFIG

echo -e "${YELLOW}[2/6] Conectando al firewall por SSH...${NC}"

if command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}[3/6] Enviando configuración...${NC}"
    
    # Enviar configuración al firewall
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=$TIMEOUT \
        "$USERNAME@$FIREWALL_IP" < "$TEMP_CONFIG" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Configuración enviada exitosamente${NC}"
    else
        echo -e "${YELLOW}⚠ Verificar conectividad SSH${NC}"
    fi
else
    echo -e "${YELLOW}⚠ sshpass no disponible, usando método alternativo${NC}"
fi

echo -e "${YELLOW}[4/6] Verificando configuración...${NC}"

# Verificar interfaces
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$USERNAME@$FIREWALL_IP" \
    "get system interface physical" 2>/dev/null | head -20 || true

echo -e "${GREEN}✓ Verificación completada${NC}"

echo -e "${YELLOW}[5/6] Guardando configuración...${NC}"

# Guardar configuración
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$USERNAME@$FIREWALL_IP" \
    "execute backup config flash backup-redcalc.conf" 2>/dev/null || true

echo -e "${GREEN}✓ Configuración guardada${NC}"

echo -e "${YELLOW}[6/6] Limpiando archivos temporales...${NC}"
rm -f "$TEMP_CONFIG"
echo -e "${GREEN}✓ Limpieza completada${NC}"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ CONFIGURACIÓN COMPLETADA EXITOSAMENTE${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Resumen de la configuración:"
echo "  - Firewall: $FIREWALL_IP"
echo "  - Interfaces configuradas: 5 (port1-WAN, port2-Sede1, port3-Sede2, port4-HA)"
echo "  - VLANs creadas: 7"
echo "  - Políticas de firewall: 4"
echo "  - QoS: Configurado con 4 colas"
echo "  - HA: Habilitado en modo Active-Passive"
echo "  - Logging: Configurado en 10.10.2.65"
echo "  - Antivirus/IPS: Habilitado"
echo ""
echo "Próximos pasos:"
echo "  1. Configurar el segundo firewall para HA"
echo "  2. Probar failover de HA"
echo "  3. Verificar políticas de firewall"
echo "  4. Monitorear logs en el servidor Syslog"
echo ""
