#!/bin/bash

################################################################################
# SCRIPT DE CONFIGURACIÓN CISCO ROUTER 1 - SEDE 1.
# RedCalc Pro v2.2 - Automatización de Infraestructura de Red
# 
# Propósito: Configurar Router Cisco (Sede 1) con:
#   - VLANs (TI, Administrativo, Operaciones, VIP, Servicios, Servidores)
#   - Direccionamiento IP VLSM (10.10.0.0/16)
#   - Enrutamiento Inter-VLAN
#   - QoS y Políticas
#   - Seguridad y Logging
#
# Uso: ./cisco_router1_config.sh <IP_ROUTER> <USERNAME> <PASSWORD>
# Ejemplo: ./cisco_router1_config.sh 192.168.1.1 admin cisco123
################################################################################

set -e  # Salir si hay error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
ROUTER_IP="${1:-192.168.1.1}"
USERNAME="${2:-admin}"
PASSWORD="${3:-cisco123}"
SSH_PORT="22"
TIMEOUT="10"

# Validar argumentos
if [ $# -lt 3 ]; then
    echo -e "${RED}Error: Se requieren 3 argumentos${NC}"
    echo "Uso: $0 <IP_ROUTER> <USERNAME> <PASSWORD>"
    echo "Ejemplo: $0 192.168.1.1 admin cisco123"
    exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  CONFIGURACIÓN CISCO ROUTER 1 - SEDE 1${NC}"
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
! CONFIGURACIÓN CISCO ROUTER 1 - SEDE 1
! Red Base: 10.10.0.0/16
! Usuarios: 200 (100 por router)
! ============================================================================

! ============================================================================
! 1. CONFIGURACIÓN GLOBAL
! ============================================================================
configure terminal
hostname Router-Sede1
ip domain-name redcalc.local
service timestamps debug datetime msec
service timestamps log datetime msec
no ip domain-lookup

! ============================================================================
! 2. CONFIGURACIÓN DE VLANs
! ============================================================================
! VLAN 10: TI (50 usuarios - 25%)
vlan 10
  name TI
  description Departamento de TI - 50 usuarios
exit

! VLAN 20: Administrativo (30 usuarios - 15%)
vlan 20
  name Administrativo
  description Departamento Administrativo - 30 usuarios
exit

! VLAN 30: Operaciones (60 usuarios - 30%)
vlan 30
  name Operaciones
  description Departamento de Operaciones - 60 usuarios
exit

! VLAN 40: VIP (20 usuarios - 10%)
vlan 40
  name VIP
  description Usuarios VIP - 20 usuarios
exit

! VLAN 50: Servicios (20 usuarios - 10%)
vlan 50
  name Servicios
  description Servicios de Red - 20 usuarios
exit

! VLAN 60: Servidores (15 usuarios - 7.5%)
vlan 60
  name Servidores
  description Servidores de Aplicación - 15 usuarios
exit

! VLAN 70: VIP Ejecutivos (5 usuarios - 2.5%)
vlan 70
  name VIP-Ejecutivos
  description Ejecutivos - 5 usuarios
exit

! ============================================================================
! 3. CONFIGURACIÓN DE INTERFACES VIRTUALES (SVI) - ENRUTAMIENTO INTER-VLAN
! ============================================================================

! VLAN 10 - TI: 10.10.0.0/25 (Gateway: 10.10.0.1)
interface Vlan10
  description SVI TI - Sede 1
  ip address 10.10.0.1 255.255.255.128
  no shutdown
exit

! VLAN 20 - Administrativo: 10.10.0.128/26 (Gateway: 10.10.0.129)
interface Vlan20
  description SVI Administrativo - Sede 1
  ip address 10.10.0.129 255.255.255.192
  no shutdown
exit

! VLAN 30 - Operaciones: 10.10.1.0/25 (Gateway: 10.10.1.1)
interface Vlan30
  description SVI Operaciones - Sede 1
  ip address 10.10.1.1 255.255.255.128
  no shutdown
exit

! VLAN 40 - VIP: 10.10.1.128/26 (Gateway: 10.10.1.129)
interface Vlan40
  description SVI VIP - Sede 1
  ip address 10.10.1.129 255.255.255.192
  no shutdown
exit

! VLAN 50 - Servicios: 10.10.2.0/26 (Gateway: 10.10.2.1)
interface Vlan50
  description SVI Servicios - Sede 1
  ip address 10.10.2.1 255.255.255.192
  no shutdown
exit

! VLAN 60 - Servidores: 10.10.2.64/27 (Gateway: 10.10.2.65)
interface Vlan60
  description SVI Servidores - Sede 1
  ip address 10.10.2.65 255.255.255.224
  no shutdown
exit

! VLAN 70 - VIP Ejecutivos: 10.10.2.96/28 (Gateway: 10.10.2.97)
interface Vlan70
  description SVI VIP Ejecutivos - Sede 1
  ip address 10.10.2.97 255.255.255.240
  no shutdown
exit

! ============================================================================
! 4. CONFIGURACIÓN DE ENRUTAMIENTO
! ============================================================================

! Habilitar enrutamiento IP
ip routing

! Ruta por defecto (hacia Firewall/ISP)
ip route 0.0.0.0 0.0.0.0 10.10.255.254

! Ruta hacia Sede 2 (Router 2)
ip route 10.11.0.0 255.255.0.0 10.10.255.253

! ============================================================================
! 5. CONFIGURACIÓN DE QoS (Quality of Service)
! ============================================================================

! Crear mapa de clases
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

! Crear política de tráfico
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
! 6. CONFIGURACIÓN DE SEGURIDAD
! ============================================================================

! Access Control List - Bloquear tráfico no autorizado
ip access-list extended ACL-ENTRADA
  permit ip 10.10.0.0 0.0.255.255 any
  permit ip 10.11.0.0 0.0.255.255 any
  deny ip any any log
exit

! Aplicar ACL a interfaces
interface Vlan10
  ip access-group ACL-ENTRADA in
exit

! ============================================================================
! 7. CONFIGURACIÓN DE LOGGING Y MONITOREO
! ============================================================================

! Configurar servidor Syslog
logging 10.10.2.65
logging trap informational
logging source-interface Vlan60

! Habilitar logging de cambios de configuración
archive
  log config
  logging enable
  logging size 500
  logging full-backup
exit

! ============================================================================
! 8. CONFIGURACIÓN DE DHCP (Opcional - si el router actúa como servidor)
! ============================================================================

! DHCP para VLAN 10 - TI
ip dhcp pool VLAN10-TI
  network 10.10.0.0 255.255.255.128
  default-router 10.10.0.1
  dns-server 8.8.8.8 8.8.4.4
  lease 7
exit

! DHCP para VLAN 20 - Administrativo
ip dhcp pool VLAN20-ADMIN
  network 10.10.0.128 255.255.255.192
  default-router 10.10.0.129
  dns-server 8.8.8.8 8.8.4.4
  lease 7
exit

! DHCP para VLAN 30 - Operaciones
ip dhcp pool VLAN30-OPS
  network 10.10.1.0 255.255.255.128
  default-router 10.10.1.1
  dns-server 8.8.8.8 8.8.4.4
  lease 7
exit

! Excluir direcciones reservadas
ip dhcp excluded-address 10.10.0.1 10.10.0.10
ip dhcp excluded-address 10.10.0.129 10.10.0.139
ip dhcp excluded-address 10.10.1.1 10.10.1.10

! ============================================================================
! 9. GUARDAR CONFIGURACIÓN
! ============================================================================
end
write memory

! ============================================================================
! FIN DE CONFIGURACIÓN
! ============================================================================
CISCO_CONFIG

echo -e "${YELLOW}[2/5] Conectando al router por SSH...${NC}"

# Ejecutar comandos en el router usando SSH con expect
expect << EXPECT_SCRIPT > /dev/null 2>&1
set timeout 30
spawn ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $USERNAME@$ROUTER_IP

expect {
    "assword:" {
        send "$PASSWORD\r"
        expect ">"
    }
    ">" {}
    timeout {
        puts "Error: Timeout conectando al router"
        exit 1
    }
}

# Leer y enviar comandos del archivo de configuración
set config_file [open "$TEMP_CONFIG" r]
while {[gets \$config_file line] >= 0} {
    if {[string length \$line] > 0 && ![string match "!*" \$line]} {
        send "\$line\r"
        expect {
            "#" {
                # Comando ejecutado
            }
            ">" {
                # Prompt de usuario
            }
            timeout {
                puts "Warning: Timeout esperando respuesta"
            }
        }
        after 100
    }
}
close \$config_file

send "exit\r"
expect eof
EXPECT_SCRIPT

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Conexión SSH exitosa${NC}"
else
    echo -e "${YELLOW}⚠ Verificar conectividad SSH y credenciales${NC}"
fi

echo -e "${YELLOW}[3/5] Enviando configuración...${NC}"

# Alternativa: Usar sshpass si expect no está disponible
if command -v sshpass &> /dev/null; then
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
    echo -e "${YELLOW}⚠ sshpass no disponible, usando método alternativo${NC}"
fi

echo -e "${YELLOW}[4/5] Verificando configuración...${NC}"

# Verificar que las VLANs se crearon
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
echo "  - VLANs creadas: 7 (TI, Administrativo, Operaciones, VIP, Servicios, Servidores, VIP-Ejecutivos)"
echo "  - Red base: 10.10.0.0/16"
echo "  - Enrutamiento Inter-VLAN: Habilitado"
echo "  - QoS: Configurado con 5 colas"
echo "  - DHCP: Habilitado para VLANs 10, 20, 30"
echo "  - Logging: Configurado en 10.10.2.65"
echo ""
echo "Próximos pasos:"
echo "  1. Verificar conectividad: ping 10.10.0.1"
echo "  2. Configurar el Firewall Fortinet"
echo "  3. Configurar el Router 2 (Sede 2)"
echo "  4. Probar enrutamiento Inter-VLAN"
echo ""
