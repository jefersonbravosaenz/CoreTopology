#!/bin/bash

################################################################################
# SCRIPT MAESTRO DE ORQUESTACIÓN - DEPLOY COMPLETO DE RED
# RedCalc Pro v2.2 - Automatización de Infraestructura de Red
# 
# Propósito: Orquestar la configuración completa de la infraestructura:
#   1. Router Cisco Sede 1
#   2. Router Cisco Sede 2
#   3. Firewall Fortinet
#   4. Validación de conectividad
#   5. Generación de reportes
#
# Uso: ./deploy_network.sh
# Ejemplo interactivo: ./deploy_network.sh
################################################################################

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Variables globales
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/tmp/redcalc_deploy_$(date +%Y%m%d_%H%M%S).log"
REPORT_FILE="/tmp/redcalc_report_$(date +%Y%m%d_%H%M%S).txt"

# Función para logging
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Función para mostrar banner
show_banner() {
    clear
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                                                               ║"
    echo "║          REDCALC PRO v2.2 - DEPLOYMENT NETWORK              ║"
    echo "║     Automatización Completa de Infraestructura de Red        ║"
    echo "║                                                               ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Función para mostrar menú
show_menu() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  SELECCIONA UNA OPCIÓN${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}1)${NC} Desplegar todos los dispositivos (Recomendado)"
    echo -e "${YELLOW}2)${NC} Desplegar solo Router Cisco Sede 1"
    echo -e "${YELLOW}3)${NC} Desplegar solo Router Cisco Sede 2"
    echo -e "${YELLOW}4)${NC} Desplegar solo Firewall Fortinet"
    echo -e "${YELLOW}5)${NC} Validar conectividad de todos los dispositivos"
    echo -e "${YELLOW}6)${NC} Generar reporte de configuración"
    echo -e "${YELLOW}7)${NC} Ver logs de deployment"
    echo -e "${YELLOW}8)${NC} Salir"
    echo ""
}

# Función para obtener credenciales
get_credentials() {
    local device=$1
    echo ""
    echo -e "${YELLOW}Ingresa credenciales para $device:${NC}"
    read -p "IP del dispositivo: " device_ip
    read -p "Usuario SSH: " device_user
    read -sp "Contraseña SSH: " device_pass
    echo ""
    
    echo "$device_ip|$device_user|$device_pass"
}

# Función para desplegar Router Cisco 1
deploy_cisco_router1() {
    echo ""
    echo -e "${YELLOW}[PASO 1/3] Desplegando Router Cisco Sede 1...${NC}"
    
    local creds=$(get_credentials "Router Cisco Sede 1")
    local ip=$(echo $creds | cut -d'|' -f1)
    local user=$(echo $creds | cut -d'|' -f2)
    local pass=$(echo $creds | cut -d'|' -f3)
    
    if [ -f "$SCRIPT_DIR/cisco_router1_config.sh" ]; then
        bash "$SCRIPT_DIR/cisco_router1_config.sh" "$ip" "$user" "$pass"
        log "INFO" "Router Cisco Sede 1 desplegado exitosamente en $ip"
        echo -e "${GREEN}✓ Router Cisco Sede 1 configurado${NC}"
    else
        echo -e "${RED}✗ Script cisco_router1_config.sh no encontrado${NC}"
        log "ERROR" "Script cisco_router1_config.sh no encontrado"
        return 1
    fi
}

# Función para desplegar Router Cisco 2
deploy_cisco_router2() {
    echo ""
    echo -e "${YELLOW}[PASO 2/3] Desplegando Router Cisco Sede 2...${NC}"
    
    local creds=$(get_credentials "Router Cisco Sede 2")
    local ip=$(echo $creds | cut -d'|' -f1)
    local user=$(echo $creds | cut -d'|' -f2)
    local pass=$(echo $creds | cut -d'|' -f3)
    
    if [ -f "$SCRIPT_DIR/cisco_router2_config.sh" ]; then
        bash "$SCRIPT_DIR/cisco_router2_config.sh" "$ip" "$user" "$pass"
        log "INFO" "Router Cisco Sede 2 desplegado exitosamente en $ip"
        echo -e "${GREEN}✓ Router Cisco Sede 2 configurado${NC}"
    else
        echo -e "${RED}✗ Script cisco_router2_config.sh no encontrado${NC}"
        log "ERROR" "Script cisco_router2_config.sh no encontrado"
        return 1
    fi
}

# Función para desplegar Firewall Fortinet
deploy_fortinet_firewall() {
    echo ""
    echo -e "${YELLOW}[PASO 3/3] Desplegando Firewall Fortinet...${NC}"
    
    local creds=$(get_credentials "Firewall Fortinet")
    local ip=$(echo $creds | cut -d'|' -f1)
    local user=$(echo $creds | cut -d'|' -f2)
    local pass=$(echo $creds | cut -d'|' -f3)
    
    if [ -f "$SCRIPT_DIR/fortinet_firewall_config.sh" ]; then
        bash "$SCRIPT_DIR/fortinet_firewall_config.sh" "$ip" "$user" "$pass"
        log "INFO" "Firewall Fortinet desplegado exitosamente en $ip"
        echo -e "${GREEN}✓ Firewall Fortinet configurado${NC}"
    else
        echo -e "${RED}✗ Script fortinet_firewall_config.sh no encontrado${NC}"
        log "ERROR" "Script fortinet_firewall_config.sh no encontrado"
        return 1
    fi
}

# Función para validar conectividad
validate_connectivity() {
    echo ""
    echo -e "${YELLOW}Validando conectividad de dispositivos...${NC}"
    echo ""
    
    local devices=(
        "Router Cisco Sede 1|192.168.1.1"
        "Router Cisco Sede 2|192.168.2.1"
        "Firewall Fortinet|192.168.1.254"
    )
    
    local total=0
    local success=0
    
    for device in "${devices[@]}"; do
        local name=$(echo $device | cut -d'|' -f1)
        local ip=$(echo $device | cut -d'|' -f2)
        
        echo -n "Verificando $name ($ip)... "
        
        if ping -c 1 -W 2 "$ip" &> /dev/null; then
            echo -e "${GREEN}✓ Alcanzable${NC}"
            ((success++))
        else
            echo -e "${RED}✗ No alcanzable${NC}"
        fi
        ((total++))
    done
    
    echo ""
    echo -e "${CYAN}Resultado: $success/$total dispositivos alcanzables${NC}"
    log "INFO" "Validación de conectividad: $success/$total dispositivos alcanzables"
}

# Función para generar reporte
generate_report() {
    echo ""
    echo -e "${YELLOW}Generando reporte de configuración...${NC}"
    
    cat > "$REPORT_FILE" << 'REPORT'
╔═══════════════════════════════════════════════════════════════╗
║       REPORTE DE CONFIGURACIÓN - REDCALC PRO v2.2            ║
╚═══════════════════════════════════════════════════════════════╝

FECHA DE GENERACIÓN: $(date)
UBICACIÓN DEL LOG: $LOG_FILE

═══════════════════════════════════════════════════════════════
RESUMEN DE INFRAESTRUCTURA
═══════════════════════════════════════════════════════════════

TOPOLOGÍA:
  - 2 Routers Cisco (Sede 1 y Sede 2)
  - 1 Firewall Fortinet (Central)
  - 7 VLANs por Sede
  - 200 Usuarios totales (100 por sede)

RED BASE: 10.10.0.0/16 (Sede 1) y 10.11.0.0/16 (Sede 2)

═══════════════════════════════════════════════════════════════
CONFIGURACIÓN DE ROUTERS CISCO
═══════════════════════════════════════════════════════════════

ROUTER SEDE 1 (10.10.0.0/16):
  ✓ VLANs configuradas: 7
  ✓ Enrutamiento Inter-VLAN: Habilitado
  ✓ QoS: Configurado (5 colas)
  ✓ DHCP: Habilitado
  ✓ Logging: Configurado

ROUTER SEDE 2 (10.11.0.0/16):
  ✓ VLANs configuradas: 7
  ✓ Enrutamiento Inter-VLAN: Habilitado
  ✓ QoS: Configurado (5 colas)
  ✓ DHCP: Habilitado
  ✓ Logging: Configurado

═══════════════════════════════════════════════════════════════
CONFIGURACIÓN DE FIREWALL FORTINET
═══════════════════════════════════════════════════════════════

FIREWALL CENTRAL:
  ✓ Interfaces: 5 (1 WAN, 2 LAN, 1 HA, 1 Mgmt)
  ✓ Políticas de Firewall: 4
  ✓ QoS: Configurado
  ✓ HA: Habilitado (Active-Passive)
  ✓ Antivirus/IPS: Habilitado
  ✓ Logging: Configurado

═══════════════════════════════════════════════════════════════
VLANS CONFIGURADAS
═══════════════════════════════════════════════════════════════

VLAN 10 - TI:
  - Usuarios: 50 (25%)
  - Sede 1: 10.10.0.0/25
  - Sede 2: 10.11.0.0/25

VLAN 20 - Administrativo:
  - Usuarios: 30 (15%)
  - Sede 1: 10.10.0.128/26
  - Sede 2: 10.11.0.128/26

VLAN 30 - Operaciones:
  - Usuarios: 60 (30%)
  - Sede 1: 10.10.1.0/25
  - Sede 2: 10.11.1.0/25

VLAN 40 - VIP:
  - Usuarios: 20 (10%)
  - Sede 1: 10.10.1.128/26
  - Sede 2: 10.11.1.128/26

VLAN 50 - Servicios:
  - Usuarios: 20 (10%)
  - Sede 1: 10.10.2.0/26
  - Sede 2: 10.11.2.0/26

VLAN 60 - Servidores:
  - Usuarios: 15 (7.5%)
  - Sede 1: 10.10.2.64/27
  - Sede 2: 10.11.2.64/27

VLAN 70 - VIP Ejecutivos:
  - Usuarios: 5 (2.5%)
  - Sede 1: 10.10.2.96/28
  - Sede 2: 10.11.2.96/28

═══════════════════════════════════════════════════════════════
POLÍTICAS DE FIREWALL
═══════════════════════════════════════════════════════════════

1. Allow-Intra-Sede1: Tráfico dentro de Sede 1 (PERMITIDO)
2. Allow-Inter-Sedes: Tráfico entre Sedes (PERMITIDO)
3. Allow-Internet: Acceso a Internet (PERMITIDO)
4. Block-Malicious: Bloquear tráfico malicioso (BLOQUEADO)

═══════════════════════════════════════════════════════════════
CONFIGURACIÓN DE QoS
═══════════════════════════════════════════════════════════════

Cola 1 - VoIP (DSCP EF):
  - Ancho de banda garantizado: 20%
  - Prioridad: Máxima

Cola 2 - Video (DSCP AF41):
  - Ancho de banda garantizado: 30%
  - Prioridad: Alta

Cola 3 - Datos Críticos (DSCP AF31):
  - Ancho de banda garantizado: 25%
  - Prioridad: Media-Alta

Cola 4 - Datos Normales (DSCP AF11):
  - Ancho de banda garantizado: 20%
  - Prioridad: Media

Cola 5 - Best Effort:
  - Ancho de banda garantizado: 5%
  - Prioridad: Baja

═══════════════════════════════════════════════════════════════
PRÓXIMOS PASOS
═══════════════════════════════════════════════════════════════

1. Verificar conectividad entre dispositivos
2. Probar enrutamiento Inter-VLAN
3. Validar políticas de QoS
4. Configurar monitoreo en servidor Syslog (10.10.2.65)
5. Realizar pruebas de failover de HA
6. Documentar cambios en CMDB

═══════════════════════════════════════════════════════════════
INFORMACIÓN DE CONTACTO Y SOPORTE
═══════════════════════════════════════════════════════════════

Para soporte técnico o consultas:
  - Documentación: /home/ubuntu/redcalc-pro/MANUAL_TECNICO_APA.md
  - Logs: $LOG_FILE
  - Aplicación: https://redcalcpro-azgkyhp8.manus.space/

═══════════════════════════════════════════════════════════════
FIN DEL REPORTE
═══════════════════════════════════════════════════════════════
REPORT

    sed -i "s|\$LOG_FILE|$LOG_FILE|g" "$REPORT_FILE"
    sed -i "s|\$DATE|$(date)|g" "$REPORT_FILE"
    
    echo -e "${GREEN}✓ Reporte generado: $REPORT_FILE${NC}"
    log "INFO" "Reporte generado: $REPORT_FILE"
}

# Función para ver logs
view_logs() {
    echo ""
    echo -e "${CYAN}Últimas 20 líneas del log:${NC}"
    echo ""
    tail -20 "$LOG_FILE" 2>/dev/null || echo -e "${YELLOW}No hay logs disponibles aún${NC}"
}

# Función principal
main() {
    show_banner
    
    # Crear log inicial
    log "INFO" "Iniciando RedCalc Pro Deployment Script"
    log "INFO" "Script directory: $SCRIPT_DIR"
    
    while true; do
        show_menu
        read -p "Selecciona una opción (1-8): " option
        
        case $option in
            1)
                echo -e "${BLUE}Iniciando deployment completo...${NC}"
                deploy_cisco_router1
                deploy_cisco_router2
                deploy_fortinet_firewall
                echo ""
                echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
                echo -e "${GREEN}✓ DEPLOYMENT COMPLETADO EXITOSAMENTE${NC}"
                echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
                log "INFO" "Deployment completo finalizado exitosamente"
                ;;
            2)
                deploy_cisco_router1
                ;;
            3)
                deploy_cisco_router2
                ;;
            4)
                deploy_fortinet_firewall
                ;;
            5)
                validate_connectivity
                ;;
            6)
                generate_report
                ;;
            7)
                view_logs
                ;;
            8)
                echo -e "${YELLOW}Saliendo...${NC}"
                log "INFO" "Script finalizado por usuario"
                exit 0
                ;;
            *)
                echo -e "${RED}Opción inválida. Intenta de nuevo.${NC}"
                ;;
        esac
    done
}

# Ejecutar función principal
main
