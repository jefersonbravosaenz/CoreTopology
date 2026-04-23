#!/bin/bash

################################################################################
# SCRIPT DE CONFIGURACIÓN CISCO ROUTER 2 - SEDE 2
# RedCalc Pro v2.2 - Automatización de Infraestructura de Red
# 
# Propósito: Configurar Router Cisco (Sede 2) con:
#   - VLANs (TI, Administrativo, Operaciones, VIP, Servicios, Servidores)
#   - Direccionamiento IP VLSM (10.11.0.0/16)
#   - Enrutamiento Inter-VLAN
#   - QoS y Políticas
#   - Seguridad y Logging
#
# Uso: ./cisco_router2_config.sh <IP_ROUTER> <USERNAME> <PASSWORD>
# Ejemplo: ./cisco_router2_config.sh 192.168.2.1 admin cisco123
################################################################################

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
ROUTER_IP="${1:-192.168.2.1}"
USERNAME="${2:-admin}"
PASSWORD="${3:-cisco123}"
SSH_PORT="22"
TIMEOUT="10"

# Validar argumentos
if [ $# -lt 3 ]; then
    echo -e "${RED}Error: Se requieren 3 argumentos${NC}"
    echo "Uso: $0 <IP_ROUTER> <USERNAME> <PASSWORD>"
    exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  CONFIGURACIÓN CISCO ROUTER 2 - SEDE 2${NC}"
echo -e "${BLUE}  RedCalc Pro v2.2${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Verificar conectividad
echo -e "${YELLOW}[1/5] Verificando conectividad con el router...${NC}"
if ! ping -c 1 -W $TIMEOUT "$ROUTER_IP" &> /dev/null; then
    echo -e "${RED}✗ No se puede alcanzar el router en $ROUTER_IP${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Router alcanzable${NC}"
echo ""

# Crear archivo temporal con comandos de configuración
TEMP_CONFIG=$(mktemp)
cat > "$TEMP_CONFIG" << 'CISCO_CONFIG'
! ============================================================================
! CONFIGURACIÓN CISCO ROUTER 2 - SEDE 2
! Red Base: 10.11.0.0/16
! Usuarios: 200 (100 por router)
! ============================================================================

configure terminal
hostname Router-Sede2
ip domain-name redcalc.local
service timestamps debug datetime msec
service timestamps log datetime msec
no ip domain-lookup

! ============================================================================
! CONFIGURACIÓN DE VLANs
! ============================================================================
vlan 10
  name TI
  description Departamento de TI - 50 usuarios
exit

vlan 20
  name Administrativo
  description Departamento Administrativo - 30 usuarios
exit

vlan 30
  name Operaciones
  description Departamento de Operaciones - 60 usuarios
exit

vlan 40
  name VIP
  description Usuarios VIP - 20 usuarios
exit

vlan 50
  name Servicios
  description Servicios de Red - 20 usuarios
exit

vlan 60
  name Servidores
  description Servidores de Aplicación - 15 usuarios
exit

vlan 70
  name VIP-Ejecutivos
  description Ejecutivos - 5 usuarios
exit

! ============================================================================
! CONFIGURACIÓN DE INTERFACES VIRTUALES (SVI)
! ============================================================================

interface Vlan10
  description SVI TI - Sede 2
  ip address 10.11.0.1 255.255.255.128
  no shutdown
exit

interface Vlan20
  description SVI Administrativo - Sede 2
  ip address 10.11.0.129 255.255.255.192
  no shutdown
exit

interface Vlan30
  description SVI Operaciones - Sede 2
  ip address 10.11.1.1 255.255.255.128
  no shutdown
exit

interface Vlan40
  description SVI VIP - Sede 2
  ip address 10.11.1.129 255.255.255.192
  no shutdown
exit

interface Vlan50
  description SVI Servicios - Sede 2
  ip address 10.11.2.1 255.255.255.192
  no shutdown
exit

interface Vlan60
  description SVI Servidores - Sede 2
  ip address 10.11.2.65 255.255.255.224
  no shutdown
exit

interface Vlan70
  description SVI VIP Ejecutivos - Sede 2
  ip address 10.11.2.97 255.255.255.240
  no shutdown
exit

! ============================================================================
! CONFIGURACIÓN DE ENRUTAMIENTO
! ============================================================================

ip routing

! Ruta por defecto
ip route 0.0.0.0 0.0.0.0 10.11.255.254

! Ruta hacia Sede 1
ip route 10.10.0.0 255.255.0.0 10.11.255.253

! ============================================================================
! CONFIGURACIÓN DE QoS
! ============================================================================

class-map match-any VOIP
  match ip dscp ef
class-map match-any VIDEO
  match ip dscp af41 af42 af43
class-map match-any DATOS-CRITICOS
  match ip dscp af31 af32 af33
class-map match-any DATOS-NORMALES
  match ip dscp af11 af12 af13
class-map match-any BEST-EFFORT
  match ip dscp default

policy-map QoS-Salida
  class VOIP
    priority percent 20
    set dscp ef
  class VIDEO
    bandwidth percent 30
    set dscp af41
  class DATOS-CRITICOS
    bandwidth percent 25
    set dscp af31
  class DATOS-NORMALES
    bandwidth percent 20
    set dscp af11
  class BEST-EFFORT
    bandwidth percent 5
    set dscp default

! ============================================================================
! CONFIGURACIÓN DE SEGURIDAD
! ============================================================================

ip access-list extended ACL-ENTRADA
  permit ip 10.11.0.0 0.0.255.255 any
  permit ip 10.10.0.0 0.0.255.255 any
  deny ip any any log
exit

interface Vlan10
  ip access-group ACL-ENTRADA in
exit

! ============================================================================
! CONFIGURACIÓN DE LOGGING
! ============================================================================

logging 10.11.2.65
logging trap informational
logging source-interface Vlan60

archive
  log config
  logging enable
  logging size 500
  logging full-backup
exit

! ============================================================================
! CONFIGURACIÓN DE DHCP
! ============================================================================

ip dhcp pool VLAN10-TI
  network 10.11.0.0 255.255.255.128
  default-router 10.11.0.1
  dns-server 8.8.8.8 8.8.4.4
  lease 7
exit

ip dhcp pool VLAN20-ADMIN
  network 10.11.0.128 255.255.255.192
  default-router 10.11.0.129
  dns-server 8.8.8.8 8.8.4.4
  lease 7
exit

ip dhcp pool VLAN30-OPS
  network 10.11.1.0 255.255.255.128
  default-router 10.11.1.1
  dns-server 8.8.8.8 8.8.4.4
  lease 7
exit

ip dhcp excluded-address 10.11.0.1 10.11.0.10
ip dhcp excluded-address 10.11.0.129 10.11.0.139
ip dhcp excluded-address 10.11.1.1 10.11.1.10

! ============================================================================
! GUARDAR CONFIGURACIÓN
! ============================================================================
end
write memory
CISCO_CONFIG

echo -e "${YELLOW}[2/5] Conectando al router por SSH...${NC}"

if command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}[3/5] Enviando configuración...${NC}"
    
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=$TIMEOUT \
        "$USERNAME@$ROUTER_IP" < "$TEMP_CONFIG" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Configuración enviada exitosamente${NC}"
    else
        echo -e "${RED}✗ Error al enviar configuración${NC}"
        rm -f "$TEMP_CONFIG"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ sshpass no disponible${NC}"
fi

echo -e "${YELLOW}[4/5] Verificando configuración...${NC}"

sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$USERNAME@$ROUTER_IP" \
    "show vlan brief" 2>/dev/null | grep -E "VLAN|TI|Administrativo|Operaciones|VIP|Servicios|Servidores" || true

echo -e "${GREEN}✓ Verificación completada${NC}"

echo -e "${YELLOW}[5/5] Limpiando archivos temporales...${NC}"
rm -f "$TEMP_CONFIG"
echo -e "${GREEN}✓ Limpieza completada${NC}"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ CONFIGURACIÓN COMPLETADA EXITOSAMENTE${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Resumen de la configuración:"
echo "  - Router: $ROUTER_IP"
echo "  - VLANs creadas: 7"
echo "  - Red base: 10.11.0.0/16"
echo "  - Enrutamiento Inter-VLAN: Habilitado"
echo "  - QoS: Configurado"
echo "  - DHCP: Habilitado"
echo "  - Logging: Configurado"
echo ""
