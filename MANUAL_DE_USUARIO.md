# Manual de Usuario — CoreTopology v2.2

**Calculadora Profesional de Infraestructura de Red**

**Versión:** 2.2  
**Fecha:** Marzo 2026  
**Autor:** Manus AI

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Interfaz Principal](#interfaz-principal)
3. [Barra Lateral de Navegación](#barra-lateral-de-navegación)
4. [Panel de Resumen (Overview)](#panel-de-resumen-overview)
5. [Panel de VLANs](#panel-de-vlans)
6. [Panel de Direccionamiento IP](#panel-de-direccionamiento-ip)
7. [Panel de Ancho de Banda](#panel-de-ancho-de-banda)
8. [Panel de Equipos](#panel-de-equipos)
9. [Panel de QoS](#panel-de-qos)
10. [Panel de Costos](#panel-de-costos)
11. [Panel de Redundancia](#panel-de-redundancia)
12. [Panel de Topología](#panel-de-topología)
13. [Panel de Comandos](#panel-de-comandos)
14. [Paneles Adicionales](#paneles-adicionales)
15. [Gestión de Propuestas](#gestión-de-propuestas)
16. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

**CoreTopology** es una herramienta profesional diseñada para arquitectos, ingenieros y técnicos de redes que necesitan:

- Diseñar infraestructuras de red complejas
- Calcular direccionamiento IP con VLSM
- Estimar costos de equipamiento
- Generar comandos de configuración automáticamente
- Analizar redundancia y disponibilidad
- Documentar propuestas técnicas

### Características Principales

✅ **16 Paneles Funcionales** — Cobertura completa del diseño de redes  
✅ **Cálculos Automáticos** — VLSM, ancho de banda, costos  
✅ **Generador de Comandos** — Cisco, HP, Juniper, MikroTik, Fortinet  
✅ **Análisis de Redundancia** — Identificación de puntos únicos de fallo  
✅ **Gráficas Interactivas** — Visualización de datos en tiempo real  
✅ **Exportación de Propuestas** — Guardar y cargar en JSON  

---

## Interfaz Principal

### Estructura General

```
┌─────────────────────────────────────────────────────────────┐
│  BARRA SUPERIOR                                             │
│  Logo | Título | Menú                                       │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  SIDEBAR     │  PANEL PRINCIPAL                            │
│  (16 opciones)│  (Contenido dinámico)                       │
│              │                                              │
│              │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Elementos de la Interfaz

| Elemento | Descripción |
|----------|-------------|
| **Logo** | CoreTopology con icono de red |
| **Título** | Nombre de la herramienta |
| **Sidebar** | Menú de navegación con 16 opciones |
| **Panel Principal** | Área donde se muestra el contenido seleccionado |
| **Animaciones** | Transiciones suavizadas entre paneles |

---

## Barra Lateral de Navegación

La barra lateral izquierda contiene **16 opciones** para acceder a diferentes funcionalidades:

### 1. 📊 **Overview (Resumen Ejecutivo)**
- Dashboard con métricas principales
- Gráficas de ancho de banda
- Estimación de costos
- Información de sedes

**Cuándo usar:** Al inicio para ver un resumen general del proyecto

### 2. 🏢 **Propuesta (Información de Sedes)**
- Nombre del proyecto
- Descripción general
- Información de cada sede
- Número de usuarios por sede
- Ubicación geográfica

**Cuándo usar:** Para definir la estructura básica del proyecto

### 3. 📡 **VLANs (Gestión de VLANs)**
- Crear nuevas VLANs
- Editar VLANs existentes
- Eliminar VLANs
- Asignar porcentaje de usuarios
- Definir prioridad (Low/Medium/High)

**Cuándo usar:** Después de definir sedes, para estructurar la red lógicamente

### 4. 🌐 **IP (Cálculo VLSM)**
- Cálculo automático de subredes
- Direccionamiento por VLAN
- Rango de IPs disponibles
- Máscara de subred
- Puerta de enlace

**Cuándo usar:** Para obtener el esquema de direccionamiento IP

### 5. 📈 **Ancho BW (Bandwidth)**
- Gráficas de consumo por VLAN
- Estimación de ancho de banda requerido
- Análisis de capacidad
- Recomendaciones de velocidad

**Cuándo usar:** Para dimensionar los enlaces de red

### 6. 🖥️ **Equipos (Infraestructura)**
- Lista de equipos necesarios
- Especificaciones técnicas
- Cantidad por sede
- Costo unitario
- Costo total

**Cuándo usar:** Para definir la infraestructura física

### 7. ⚙️ **QoS (Calidad de Servicio)**
- Configuración de 5 colas de prioridad
- DSCP/CoS values
- Ancho de banda reservado
- Comandos de configuración

**Cuándo usar:** Para garantizar calidad de servicio en aplicaciones críticas

### 8. 💰 **Costos (Estimación Económica)**
- Desglose de costos
- Equipamiento
- Instalación
- Cableado estructurado
- Licencias
- Mantenimiento anual

**Cuándo usar:** Para presupuestar el proyecto

### 9. 🔄 **Redundancia (Análisis de HA)**
- Puntuación de disponibilidad
- Identificación de SPOFs
- Recomendaciones de redundancia
- Topología de respaldo

**Cuándo usar:** Para garantizar alta disponibilidad

### 10. 🗺️ **Topología (Diagrama de Red)**
- Visualización SVG interactiva
- Conexiones entre dispositivos
- Estados de enlaces
- Información al pasar mouse

**Cuándo usar:** Para visualizar la arquitectura de red

### 11. ⌨️ **Comandos (Generador)**
- Seleccionar vendor (Cisco, HP, Juniper, MikroTik, Fortinet)
- Generar comandos automáticamente
- Copiar/descargar comandos
- Comentarios explicativos

**Cuándo usar:** Para obtener comandos de configuración

### 12. 🔧 **Servicios (Gestión de Servicios)**
- Listar servicios de red
- Asignar a VLANs
- Definir prioridad
- Especificar puertos

**Cuándo usar:** Para documentar servicios disponibles

### 13. 👥 **Usuarios (Gestión de Usuarios)**
- Cantidad de usuarios por VLAN
- Distribución por sede
- Tipos de usuario
- Requerimientos especiales

**Cuándo usar:** Para dimensionar según cantidad de usuarios

### 14. 🏢 **Pisos (Topología Física)**
- Plano de pisos
- Ubicación de equipos
- Distribución de cableado
- Puntos de acceso

**Cuándo usar:** Para planificar la instalación física

### 15. 📋 **Propuestas (Gestión)**
- Guardar propuestas
- Cargar propuestas guardadas
- Exportar a JSON
- Historial de versiones

**Cuándo usar:** Para gestionar múltiples proyectos

### 16. 📥 **Importar (Cargar Propuestas)**
- Importar archivo JSON
- Cargar propuesta guardada
- Validar estructura
- Restaurar configuración

**Cuándo usar:** Para reutilizar propuestas anteriores

---

## Panel de Resumen (Overview)

### Descripción

El panel de **Overview** es el dashboard principal que muestra un resumen ejecutivo del proyecto.

### Componentes

#### **Tarjetas de Estadísticas**

| Métrica | Descripción |
|---------|-------------|
| **Total de Usuarios** | Suma de usuarios en todas las sedes |
| **Sedes Configuradas** | Cantidad de ubicaciones |
| **VLANs Totales** | Número de VLANs creadas |
| **Costo Total** | Presupuesto estimado completo |
| **Ancho de Banda** | Capacidad total requerida |
| **Disponibilidad** | Porcentaje de HA |

#### **Gráficas**

**Gráfica de Ancho de Banda por VLAN**
- Eje X: Nombres de VLANs
- Eje Y: Mbps requeridos
- Tipo: Barras animadas
- Interactivo: Pasar mouse para ver valores exactos

**Gráfica de Costos**
- Eje X: Categorías (Equipos, Instalación, Cableado, Licencias, Mantenimiento)
- Eje Y: Costo en USD
- Tipo: Barras apiladas
- Interactivo: Hacer clic para detalles

**Gráfica de Distribución de Usuarios**
- Tipo: Pastel
- Segmentos: Por VLAN
- Interactivo: Hacer clic para aislar segmento

### Cómo Usar

1. Accede al panel desde la barra lateral
2. Observa las métricas principales
3. Analiza las gráficas para tomar decisiones
4. Usa los valores como referencia para otros paneles

---

## Panel de VLANs

### Descripción

Permite crear, editar y gestionar **VLANs (Virtual Local Area Networks)** que segmentan lógicamente la red.

### Opciones Principales

#### **Crear Nueva VLAN**

1. Haz clic en botón **"Agregar VLAN"**
2. Completa los campos:
   - **ID VLAN:** Número entre 1-4094
   - **Nombre:** Identificador (ej: "TI", "Administrativo")
   - **Descripción:** Propósito de la VLAN
   - **Usuarios:** Cantidad de usuarios en esta VLAN
   - **Prioridad:** Low / Medium / High

3. Haz clic en **"Guardar"**

#### **Editar VLAN**

1. Haz clic en el icono de **lápiz** en la VLAN a editar
2. Modifica los campos necesarios
3. Haz clic en **"Actualizar"**

#### **Eliminar VLAN**

1. Haz clic en el icono de **papelera** en la VLAN
2. Confirma la eliminación

#### **Ver Detalles**

Haz clic en la VLAN para ver:
- Rango de IPs asignadas
- Número de usuarios
- Ancho de banda estimado
- Servicios asociados

### Ejemplo de VLANs Típicas

| ID | Nombre | Usuarios | Prioridad | Propósito |
|----|--------|----------|-----------|-----------|
| 10 | TI | 15 | High | Departamento de Tecnología |
| 20 | Administrativo | 30 | Medium | Área administrativa |
| 30 | Operaciones | 100 | Medium | Operaciones principales |
| 40 | VIP | 10 | High | Ejecutivos |
| 50 | Servicios | 20 | Medium | Servidores y servicios |
| 60 | Servidores | 5 | High | Data center |
| 70 | Invitados | 50 | Low | Acceso temporal |

### Validaciones

- ✅ ID VLAN debe ser único (1-4094)
- ✅ Nombre no puede estar vacío
- ✅ Usuarios debe ser > 0
- ✅ Total de usuarios no debe exceder capacidad

---

## Panel de Direccionamiento IP

### Descripción

Calcula automáticamente el **direccionamiento IP usando VLSM (Variable Length Subnet Masking)** para optimizar el uso de direcciones.

### Información Mostrada

| Campo | Descripción |
|-------|-------------|
| **Red Base** | Red principal (ej: 10.10.0.0/16) |
| **VLAN** | Nombre de la VLAN |
| **Usuarios** | Cantidad de usuarios |
| **Hosts Necesarios** | Usuarios + overhead (10%) |
| **Máscara** | Máscara de subred calculada |
| **Rango** | Desde - Hasta |
| **Puerta de Enlace** | IP del router (primera usable) |
| **Broadcast** | Dirección de broadcast (última) |

### Cálculo VLSM

El sistema calcula automáticamente:

1. **Número de hosts requeridos** = Usuarios × 1.1 (10% overhead)
2. **Bits de host** = log₂(hosts requeridos)
3. **Longitud de prefijo** = 32 - bits de host
4. **Máscara de subred** = Conversión a notación decimal

**Ejemplo:**
```
VLAN: Administrativo
Usuarios: 30
Hosts necesarios: 30 × 1.1 = 33
Bits de host: log₂(33) = 6 bits
Longitud de prefijo: 32 - 6 = /26
Máscara: 255.255.255.192
Rango: 10.10.0.0 - 10.10.0.63
```

### Cómo Usar

1. Accede al panel desde la barra lateral
2. Observa el cálculo automático para cada VLAN
3. Verifica que los rangos no se solapan
4. Usa los valores para configurar los equipos
5. Descarga o copia los valores para documentación

### Validaciones

- ✅ Verificar que no hay solapamiento de rangos
- ✅ Confirmar que la red base es suficiente
- ✅ Validar máscaras de subred

---

## Panel de Ancho de Banda

### Descripción

Analiza y visualiza el **ancho de banda requerido** para cada VLAN y el total de la red.

### Cálculo de Ancho de Banda

**Fórmula:**
```
BW por usuario = 2 Mbps (promedio)
BW por VLAN = Usuarios × BW por usuario
BW total = Suma de todas las VLANs
```

**Ejemplo:**
```
VLAN Administrativo: 30 usuarios × 2 Mbps = 60 Mbps
VLAN Operaciones: 100 usuarios × 2 Mbps = 200 Mbps
VLAN TI: 15 usuarios × 2 Mbps = 30 Mbps
─────────────────────────────────────────────
Total: 290 Mbps
```

### Gráficas Disponibles

#### **Gráfica de Barras (BW por VLAN)**
- Muestra ancho de banda de cada VLAN
- Permite comparar visualmente
- Interactivo: Pasar mouse para valores exactos

#### **Gráfica de Línea (Tendencia)**
- Muestra crecimiento proyectado
- Útil para planificación futura
- Escala: 1, 2, 3 años

#### **Gráfica de Pastel (Distribución)**
- Porcentaje de BW por VLAN
- Identifica VLANs críticas
- Interactivo: Hacer clic para aislar

### Recomendaciones

| BW Total | Recomendación |
|----------|---------------|
| < 100 Mbps | Enlace 1 Gbps suficiente |
| 100-500 Mbps | Enlace 1 Gbps recomendado |
| 500-1000 Mbps | Enlace 10 Gbps recomendado |
| > 1000 Mbps | Múltiples enlaces 10 Gbps |

### Cómo Usar

1. Accede al panel desde la barra lateral
2. Observa el ancho de banda total requerido
3. Analiza la distribución por VLAN
4. Compara con capacidad disponible
5. Ajusta VLANs si es necesario

---

## Panel de Equipos

### Descripción

Define y gestiona la **infraestructura física** necesaria para la red.

### Tipos de Equipos

#### **Routers**
- Cantidad: 1 por sede
- Función: Enrutamiento Inter-VLAN
- Especificación: Mínimo 4 puertos Gigabit
- Costo: $800-2000 USD

#### **Switches**
- Cantidad: 1 principal + 1 backup por sede
- Función: Conmutación de VLAN
- Especificación: 24-48 puertos Gigabit
- Costo: $500-1500 USD

#### **Firewalls**
- Cantidad: 1 principal + 1 backup
- Función: Seguridad perimetral
- Especificación: Throughput mínimo 10 Gbps
- Costo: $2000-5000 USD

#### **Access Points**
- Cantidad: 1 por 50 usuarios
- Función: Conectividad inalámbrica
- Especificación: Wi-Fi 6 (802.11ax)
- Costo: $200-400 USD

#### **Servidores**
- Cantidad: Según servicios
- Función: Hosting de servicios
- Especificación: 16GB RAM, SSD 500GB
- Costo: $1500-3000 USD

### Cómo Agregar Equipos

1. Haz clic en **"Agregar Equipo"**
2. Selecciona tipo de equipo
3. Especifica cantidad
4. Confirma costo unitario
5. Haz clic en **"Guardar"**

### Tabla de Equipos

Muestra:
- Tipo de equipo
- Cantidad
- Costo unitario
- Costo total
- Opciones para editar/eliminar

---

## Panel de QoS

### Descripción

Configura **Calidad de Servicio (QoS)** para garantizar rendimiento de aplicaciones críticas.

### 5 Colas de Prioridad

#### **Cola 1: VoIP (Voz)**
- **DSCP:** EF (Expedited Forwarding)
- **CoS:** 5
- **Ancho de Banda:** 20% del total
- **Latencia Máxima:** 150 ms
- **Jitter Máximo:** 30 ms

#### **Cola 2: Video**
- **DSCP:** AF41 (Assured Forwarding)
- **CoS:** 4
- **Ancho de Banda:** 30% del total
- **Latencia Máxima:** 200 ms
- **Jitter Máximo:** 50 ms

#### **Cola 3: Datos Críticos**
- **DSCP:** AF31
- **CoS:** 3
- **Ancho de Banda:** 25% del total
- **Latencia Máxima:** 300 ms
- **Jitter Máximo:** 100 ms

#### **Cola 4: Datos Normales**
- **DSCP:** AF21
- **CoS:** 2
- **Ancho de Banda:** 15% del total
- **Latencia Máxima:** 500 ms
- **Jitter Máximo:** 200 ms

#### **Cola 5: Best Effort**
- **DSCP:** BE (Default)
- **CoS:** 0
- **Ancho de Banda:** 10% del total
- **Latencia Máxima:** Sin límite
- **Jitter Máximo:** Sin límite

### Cómo Configurar QoS

1. Accede al panel QoS
2. Revisa las 5 colas predefinidas
3. Ajusta porcentajes si es necesario
4. Asigna VLANs a colas
5. Genera comandos para equipos

### Comandos Generados

El sistema genera comandos específicos para:
- Cisco IOS (policy-map, class-map)
- Fortinet FortiGate (traffic shaper)
- HP ProCurve (qos profile)
- Juniper JunOS (scheduler)
- MikroTik RouterOS (queue tree)

---

## Panel de Costos

### Descripción

Realiza una **estimación económica completa** del proyecto.

### Desglose de Costos

#### **1. Equipamiento (Hardware)**
- Routers
- Switches
- Firewalls
- Access Points
- Servidores
- Cableado estructurado

**Fórmula:** Cantidad × Costo unitario

#### **2. Instalación**
- Mano de obra técnica
- Configuración inicial
- Testing
- Documentación

**Costo:** 15-20% del equipamiento

#### **3. Cableado Estructurado**
- Cable Cat6A
- Bandejas portacables
- Patch panels
- Conectores

**Costo:** $2-5 por metro lineal

#### **4. Licencias de Software**
- Sistemas operativos
- Antivirus
- Firewalls
- Herramientas de gestión

**Costo:** 10-15% del equipamiento

#### **5. Mantenimiento Anual**
- Soporte técnico
- Actualizaciones
- Reemplazos de partes

**Costo:** 15-20% del equipamiento anual

### Tabla de Costos

| Concepto | Cantidad | Unitario | Total |
|----------|----------|----------|-------|
| Routers | 2 | $1,500 | $3,000 |
| Switches | 4 | $1,000 | $4,000 |
| Firewalls | 2 | $3,000 | $6,000 |
| Access Points | 6 | $300 | $1,800 |
| Cableado (1000m) | 1000 | $3 | $3,000 |
| Instalación | 1 | $2,000 | $2,000 |
| Licencias | 1 | $2,000 | $2,000 |
| **TOTAL CAPEX** | | | **$21,800** |
| **Mantenimiento Anual** | | | **$3,270** |

### Cómo Usar

1. Accede al panel de Costos
2. Revisa el desglose automático
3. Ajusta valores si es necesario
4. Analiza el CAPEX vs OPEX
5. Exporta para presentación a cliente

---

## Panel de Redundancia

### Descripción

Analiza la **disponibilidad de la red** e identifica puntos únicos de fallo (SPOF).

### Métricas de Disponibilidad

#### **Puntuación de HA (0-100)**
- 0-20: Crítica (sin redundancia)
- 21-40: Baja (redundancia parcial)
- 41-60: Media (redundancia en componentes)
- 61-80: Alta (redundancia en enlaces)
- 81-100: Muy Alta (redundancia completa)

#### **Tiempo de Inactividad Anual**
```
Disponibilidad 99.0% = 87.6 horas de downtime
Disponibilidad 99.9% = 8.76 horas de downtime
Disponibilidad 99.99% = 52.6 minutos de downtime
Disponibilidad 99.999% = 5.26 minutos de downtime
```

### Análisis de SPOFs

El sistema identifica:

| SPOF | Impacto | Severidad | Solución |
|------|---------|-----------|----------|
| Router único | Pérdida total de conectividad | Crítica | Agregar router backup |
| Switch único | Caída de VLAN | Alta | Agregar switch backup |
| Firewall único | Pérdida de seguridad | Crítica | Agregar firewall en HA |
| Enlace único | Desconexión de sede | Alta | Agregar enlace redundante |

### Recomendaciones de Redundancia

**Para Disponibilidad 99.0%:**
- ✅ Router principal + backup
- ✅ Switch principal + backup
- ✅ Firewall en HA activo-pasivo

**Para Disponibilidad 99.9%:**
- ✅ Múltiples routers (OSPF/BGP)
- ✅ Múltiples switches (RSTP)
- ✅ Firewall en HA activo-activo
- ✅ Enlaces redundantes

**Para Disponibilidad 99.99%:**
- ✅ Malla de routers
- ✅ Múltiples switches por sede
- ✅ Firewall en HA con sincronización
- ✅ Múltiples enlaces de diferentes proveedores
- ✅ Replicación de servidores

### Cómo Usar

1. Accede al panel de Redundancia
2. Observa la puntuación actual
3. Revisa los SPOFs identificados
4. Lee las recomendaciones
5. Implementa cambios según necesidad
6. Verifica que la puntuación mejora

---

## Panel de Topología

### Descripción

Visualiza la **arquitectura de red** de forma interactiva mediante un diagrama SVG.

### Elementos del Diagrama

#### **Nodos**
- **Routers:** Icono de enrutador
- **Switches:** Icono de conmutador
- **Firewalls:** Icono de escudo
- **Servidores:** Icono de servidor
- **Usuarios:** Icono de grupo

#### **Enlaces**
- **Línea sólida:** Enlace activo
- **Línea punteada:** Enlace backup
- **Color verde:** Enlace óptimo
- **Color amarillo:** Enlace degradado
- **Color rojo:** Enlace caído

#### **Información al Pasar Mouse**
- Nombre del dispositivo
- Velocidad del enlace
- Estado
- Carga actual

### Interactividad

- **Pasar mouse:** Ver detalles
- **Hacer clic:** Seleccionar dispositivo
- **Arrastrar:** Reorganizar layout
- **Zoom:** Rueda del mouse
- **Desplazar:** Click derecho + arrastrar

### Leyenda

```
🔵 Router          ─── Enlace 1 Gbps
🟦 Switch          ···· Enlace Backup
🛡️ Firewall        ─── Enlace 10 Gbps
🖥️ Servidor        ─── Enlace Redundante
👥 Usuarios
```

### Cómo Usar

1. Accede al panel de Topología
2. Observa la estructura general
3. Pasa mouse sobre elementos para detalles
4. Identifica puntos críticos
5. Verifica redundancia visualmente

---

## Panel de Comandos

### Descripción

Genera **comandos de configuración automáticamente** para diferentes fabricantes.

### Vendors Soportados

#### **1. Cisco IOS**
- Routers (2800, 3800, ASR)
- Switches (Catalyst 2900, 3500, 4500)
- Firewalls (ASA 5500, 5500-X)

#### **2. Fortinet FortiGate**
- FortiGate 100, 200, 300 series
- FortiGate 1000, 3000 series
- FortiGate 5000 series

#### **3. HP ProCurve**
- Switches (2500, 3500, 5500)
- Routers (MSR)

#### **4. Juniper JunOS**
- Routers (SRX, MX)
- Switches (EX)

#### **5. MikroTik RouterOS**
- RouterBOARD (RB)
- Cloud Hosted Router

### Cómo Generar Comandos

1. Accede al panel de Comandos
2. Selecciona el vendor en el dropdown
3. El sistema genera automáticamente:
   - Configuración de interfaces
   - Definición de VLANs
   - Enrutamiento Inter-VLAN
   - QoS
   - ACLs
   - Logging

4. Opciones:
   - **Copiar:** Copia al portapapeles
   - **Descargar:** Guarda en archivo .txt
   - **Imprimir:** Abre diálogo de impresión

### Estructura de Comandos

#### **Cisco IOS**
```
! ========== CONFIGURACIÓN DE INTERFACES ==========
interface GigabitEthernet0/0
  ip address 192.168.1.1 255.255.255.0
  no shutdown

! ========== DEFINICIÓN DE VLANs ==========
vlan 10
  name TI
vlan 20
  name Administrativo

! ========== ENRUTAMIENTO INTER-VLAN ==========
ip routing
interface Vlan10
  ip address 10.10.0.1 255.255.255.128

! ========== QoS ==========
policy-map QoS-Policy
  class VoIP
    priority percent 20
```

#### **Fortinet FortiGate**
```
! ========== CONFIGURACIÓN DE INTERFACES ==========
config system interface
  edit "port1"
    set ip 192.168.1.254 255.255.255.0
    set allowaccess ping http https ssh
  next
end

! ========== DEFINICIÓN DE VLANs ==========
config system interface
  edit "vlan10"
    set vlanid 10
    set interface "port2"
    set ip 10.10.0.1 255.255.255.128
  next
end

! ========== POLÍTICAS DE FIREWALL ==========
config firewall policy
  edit 1
    set name "Allow-Intra-VLAN"
    set srcintf "vlan10"
    set dstintf "vlan10"
    set action accept
  next
end
```

### Comentarios en Comandos

Todos los comandos incluyen comentarios explicativos:

```
! Comentario: Explicación del comando
! Propósito: Para qué sirve
! Nota: Información adicional
```

### Cómo Usar

1. Accede al panel de Comandos
2. Selecciona el vendor de tu equipo
3. Copia los comandos generados
4. Conéctate al equipo por SSH/Telnet
5. Pega los comandos en la terminal
6. Verifica la configuración
7. Guarda la configuración

---

## Paneles Adicionales

### 🔧 **Panel de Servicios**

Define los servicios de red disponibles:
- DNS (Puerto 53)
- DHCP (Puerto 67)
- HTTP/HTTPS (Puertos 80/443)
- SSH (Puerto 22)
- Servicios personalizados

**Cómo usar:**
1. Haz clic en "Agregar Servicio"
2. Especifica nombre, puerto, protocolo
3. Asigna a VLAN
4. Define prioridad QoS

### 👥 **Panel de Usuarios**

Gestiona información de usuarios:
- Cantidad por VLAN
- Tipos de usuario (técnico, administrativo, operario)
- Requerimientos especiales
- Acceso remoto

**Cómo usar:**
1. Especifica cantidad de usuarios por VLAN
2. Define tipos de acceso
3. El sistema calcula automáticamente BW requerido

### 🏢 **Panel de Pisos**

Define la topología física:
- Número de pisos
- Metros cuadrados por piso
- Ubicación de equipos
- Distribución de cableado

**Cómo usar:**
1. Especifica número de pisos
2. Define ubicación de equipos
3. Calcula metros de cableado necesario
4. Estima puntos de acceso requeridos

---

## Gestión de Propuestas

### Guardar Propuesta

1. Completa todos los paneles necesarios
2. Haz clic en **"Guardar Propuesta"**
3. Ingresa nombre descriptivo
4. Haz clic en **"Guardar"**
5. La propuesta se guarda en formato JSON

### Cargar Propuesta

1. Accede al panel de **"Propuestas"**
2. Haz clic en la propuesta a cargar
3. Haz clic en **"Cargar"**
4. Todos los paneles se actualizan automáticamente

### Exportar Propuesta

1. Accede al panel de **"Propuestas"**
2. Selecciona la propuesta
3. Haz clic en **"Exportar"**
4. Se descarga archivo JSON

### Importar Propuesta

1. Accede al panel de **"Importar"**
2. Haz clic en **"Seleccionar Archivo"**
3. Elige archivo JSON
4. Haz clic en **"Importar"**
5. La propuesta se carga automáticamente

### Estructura JSON

```json
{
  "id": "prop-001",
  "name": "Propuesta Red Empresa XYZ",
  "date": "2026-03-20",
  "sites": [
    {
      "name": "Sede Principal",
      "users": 100,
      "location": "Bogotá"
    }
  ],
  "vlans": [
    {
      "id": 10,
      "name": "TI",
      "users": 15,
      "priority": "high"
    }
  ],
  "costs": {
    "equipment": 21800,
    "installation": 2000,
    "cabling": 3000,
    "licenses": 2000,
    "maintenance": 3270
  }
}
```

---

## Preguntas Frecuentes

### ❓ ¿Cómo calcula CoreTopology el ancho de banda?

**Respuesta:** Utiliza la fórmula:
```
BW por usuario = 2 Mbps (promedio)
BW total = Suma de usuarios × 2 Mbps
```

Esto incluye tráfico de datos, video, VoIP y overhead.

### ❓ ¿Puedo modificar los valores de cálculo?

**Respuesta:** Sí. Todos los valores son editables. Puedes:
- Cambiar cantidad de usuarios
- Ajustar BW por usuario
- Modificar costos unitarios
- Personalizar VLANs

### ❓ ¿Qué es VLSM?

**Respuesta:** Variable Length Subnet Masking es una técnica que permite usar diferentes máscaras de subred para optimizar el uso de direcciones IP. CoreTopology calcula automáticamente la mejor máscara para cada VLAN.

### ❓ ¿Cómo garantizo alta disponibilidad?

**Respuesta:** Revisa el panel de Redundancia que identifica SPOFs y proporciona recomendaciones específicas para tu infraestructura.

### ❓ ¿Puedo usar los comandos generados directamente?

**Respuesta:** Sí, pero se recomienda:
1. Revisar los comandos antes de aplicar
2. Probar en ambiente de laboratorio
3. Ajustar según configuración específica
4. Validar después de aplicar

### ❓ ¿Qué formatos puedo exportar?

**Respuesta:** Actualmente soportamos:
- JSON (propuestas completas)
- TXT (comandos)
- Próximamente: PDF, Excel

### ❓ ¿Cómo contacto soporte?

**Respuesta:** Visita:
- Documentación: Manual Técnico
- Problemas: Revisa la sección de Troubleshooting
- Contacto: Manus AI

### ❓ ¿Puedo trabajar sin conexión a Internet?

**Respuesta:** Sí. La aplicación funciona completamente offline. Solo necesitas conexión para cargar Google Fonts la primera vez.

### ❓ ¿Cuál es el máximo de usuarios que puedo configurar?

**Respuesta:** No hay límite técnico. El sistema puede manejar desde 1 hasta 10,000+ usuarios sin problemas.

### ❓ ¿Cómo actualizo la herramienta?

**Respuesta:** La versión en línea se actualiza automáticamente. Si usas la versión descargada, descarga la última versión desde el repositorio.

---

## Consejos y Mejores Prácticas

### 1. Planificación

✅ Define claramente el número de sedes y usuarios  
✅ Identifica aplicaciones críticas (VoIP, video)  
✅ Planifica crecimiento futuro (20-30%)  
✅ Considera redundancia desde el inicio  

### 2. Diseño de VLANs

✅ Crea VLANs por departamento o función  
✅ Asigna prioridad según criticidad  
✅ Mantén rango de IPs coherente  
✅ Documenta propósito de cada VLAN  

### 3. Seguridad

✅ Implementa ACLs entre VLANs  
✅ Usa firewall en modo de inspección  
✅ Habilita logging en todos los equipos  
✅ Realiza auditorías periódicas  

### 4. Documentación

✅ Exporta propuestas regularmente  
✅ Mantén historial de cambios  
✅ Documenta decisiones de diseño  
✅ Crea diagramas de topología  

### 5. Testing

✅ Prueba en ambiente de laboratorio  
✅ Valida conectividad entre VLANs  
✅ Verifica QoS funciona correctamente  
✅ Realiza pruebas de failover  

---

## Glosario de Términos

| Término | Definición |
|---------|-----------|
| **VLAN** | Virtual Local Area Network - Segmentación lógica de red |
| **VLSM** | Variable Length Subnet Masking - Técnica de subredes variables |
| **QoS** | Quality of Service - Garantía de calidad en la red |
| **DSCP** | Differentiated Services Code Point - Marcado de paquetes |
| **CoS** | Class of Service - Prioridad en switches |
| **SPOF** | Single Point of Failure - Punto único de fallo |
| **HA** | High Availability - Alta disponibilidad |
| **BW** | Bandwidth - Ancho de banda |
| **CAPEX** | Capital Expenditure - Gasto de capital |
| **OPEX** | Operational Expenditure - Gasto operacional |
| **ACL** | Access Control List - Lista de control de acceso |
| **SLA** | Service Level Agreement - Acuerdo de nivel de servicio |

---

## Soporte y Recursos

### Documentación Disponible

- **Manual Técnico:** Arquitectura y componentes
- **Manual APA:** Formato académico
- **Tecnologías:** Stack tecnológico utilizado
- **Scripts:** Automatización de deployment
- **Guía de Ejecución:** Cómo ejecutar scripts

### Enlaces Útiles

- **Aplicación en línea:** https://coretopologypro-azgkyhp8.manus.space/
- **Repositorio GitHub:** https://github.com/jefersonbravosaenz/Planificacion-y-Automatizacion-de-Redes
- **Documentación Cisco:** https://www.cisco.com/c/en/us/support/
- **Documentación Fortinet:** https://docs.fortinet.com/

---

**Versión:** 2.2  
**Última actualización:** Marzo 2026  
**Autor:** Manus AI

**© 2026 CoreTopology. Todos los derechos reservados.**
