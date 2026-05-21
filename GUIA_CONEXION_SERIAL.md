# Guía de Conexión Serial — CoreTopology v2.3

**Ejecutar Comandos Directamente en Equipos de Red**

---

## 📋 Tabla de Contenidos

1. [Requisitos](#requisitos)
2. [Hardware Necesario](#hardware-necesario)
3. [Configuración Inicial](#configuración-inicial)
4. [Cómo Conectar](#cómo-conectar)
5. [Ejecución de Comandos](#ejecución-de-comandos)
6. [Troubleshooting](#troubleshooting)
7. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## Requisitos

### Software

✅ **Navegador Compatible:**
- Google Chrome 89+
- Microsoft Edge 89+
- Opera 75+
- ❌ Firefox (no soporta Web Serial API)
- ❌ Safari (no soporta Web Serial API)

✅ **Sistema Operativo:**
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+)

### Hardware

✅ **Dispositivos Compatibles:**
- Routers Cisco (2800, 3800, ASR, etc.)
- Firewalls Fortinet FortiGate
- Switches HP ProCurve
- Routers Juniper
- Routers MikroTik

✅ **Conexión Serial:**
- Puerto COM (DB-9 o DB-25)
- Adaptador USB-Serial (recomendado)
- Cable de consola RJ-45 a Serial

---

## Hardware Necesario

### Opción 1: Adaptador USB-Serial (RECOMENDADO)

**Ventajas:**
- No requiere puerto COM físico
- Compatible con laptops modernas
- Fácil de conectar/desconectar
- Precio: $10-30 USD

**Modelos Recomendados:**
- Prolific PL2303
- FTDI FT232RL
- Silicon Labs CP2102

**Conexión:**
```
Adaptador USB-Serial
├── USB → Computadora
├── TX (Transmit) → RX (Receive) del dispositivo
├── RX (Receive) → TX (Transmit) del dispositivo
└── GND (Ground) → GND del dispositivo
```

### Opción 2: Cable de Consola Directo

**Para Cisco:**
```
Cable RJ-45 a Serial (DB-9)
├── Pin 1 (blanco/azul) → NC
├── Pin 2 (azul) → NC
├── Pin 3 (blanco/naranja) → Pin 3 (RX)
├── Pin 4 (naranja) → Pin 5 (GND)
├── Pin 5 (blanco/verde) → Pin 5 (GND)
├── Pin 6 (verde) → Pin 2 (TX)
├── Pin 7 (blanco/marrón) → NC
└── Pin 8 (marrón) → NC
```

**Para Fortinet:**
```
Cable RJ-45 a Serial (DB-9)
├── Pin 1 (blanco/azul) → Pin 1 (DCD)
├── Pin 2 (azul) → Pin 4 (DTR)
├── Pin 3 (blanco/naranja) → Pin 3 (RX)
├── Pin 4 (naranja) → Pin 5 (GND)
├── Pin 5 (blanco/verde) → Pin 5 (GND)
├── Pin 6 (verde) → Pin 2 (TX)
├── Pin 7 (blanco/marrón) → Pin 6 (DSR)
└── Pin 8 (marrón) → Pin 8 (CTS)
```

---

## Configuración Inicial

### Paso 1: Verificar Conectividad

```bash
# Windows - Listar puertos COM
mode

# Linux - Listar puertos seriales
ls -la /dev/ttyUSB*
ls -la /dev/ttyS*

# macOS - Listar puertos seriales
ls -la /dev/tty.usbserial*
```

### Paso 2: Instalar Drivers (si es necesario)

**Para Adaptador USB-Serial:**

**Windows:**
1. Descargar driver del fabricante
2. Instalar el driver
3. Conectar el adaptador
4. Verificar en Administrador de Dispositivos

**Linux:**
```bash
# Generalmente reconocido automáticamente
sudo usermod -a -G dialout $USER
# Reiniciar sesión
```

**macOS:**
```bash
# Instalar driver si es necesario
brew install ch340g-ch34x-usb-serial-driver
```

### Paso 3: Configurar Permisos (Linux)

```bash
# Dar permisos de lectura/escritura
sudo chmod 666 /dev/ttyUSB0

# O agregar usuario al grupo dialout
sudo usermod -a -G dialout $USER
```

---

## Cómo Conectar

### Paso 1: Conectar Físicamente

1. **Apaga el dispositivo de red** (opcional pero recomendado)
2. **Conecta el cable serial:**
   - RX → TX
   - TX → RX
   - GND → GND
3. **Enciende el dispositivo**
4. **Conecta el adaptador USB a tu computadora**

### Paso 2: Acceder a CoreTopology

1. Abre CoreTopology en tu navegador
2. Ve al panel **"Comandos"**
3. Selecciona el vendor de tu dispositivo
4. Haz clic en botón **"Conectar"** (icono de rayo)

### Paso 3: Configurar Parámetros

En la ventana de conexión serial:

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **Velocidad (Baud Rate)** | 9600 | Velocidad de comunicación |
| **Usuario** | admin | Usuario de login |
| **Contraseña** | (tu contraseña) | Contraseña del dispositivo |
| **Enable Password** | (opcional) | Para Cisco enable mode |

**Velocidades Comunes:**
- Cisco: 9600 bps (por defecto)
- Fortinet: 9600 bps
- HP: 9600 bps
- Juniper: 9600 bps
- MikroTik: 115200 bps

### Paso 4: Conectar

1. Haz clic en **"Conectar al Puerto Serial"**
2. Selecciona el puerto en el diálogo del navegador
3. Espera a que aparezca "✓ Conectado"

---

## Ejecución de Comandos

### Paso 1: Generar Comandos

1. En el panel de Comandos, selecciona:
   - **Fabricante:** Tu dispositivo
   - **Tipo de Dispositivo:** Switch/Router/Firewall
   - **Sede:** La sede a configurar

2. Los comandos se generan automáticamente

### Paso 2: Ejecutar

1. Con la conexión serial activa, haz clic en **"Ejecutar Comandos"**
2. El sistema:
   - Inicia sesión automáticamente
   - Entra en modo enable (Cisco)
   - Ejecuta cada comando
   - Guarda la configuración
   - Muestra el progreso en tiempo real

### Paso 3: Monitorear Progreso

En la **Terminal de Salida** verás:

```
✓ Conectado al puerto serial
> configure terminal
> interface Vlan10
> ip address 10.10.0.1 255.255.255.128
> no shutdown
> exit
> write memory
✓ EJECUCIÓN COMPLETADA
```

### Paso 4: Validar Configuración

Después de ejecutar:

```bash
# En el dispositivo
show running-config
show vlan brief
show ip route
show interfaces
```

---

## Troubleshooting

### ❌ "Web Serial API no soportada"

**Problema:** Tu navegador no soporta Web Serial API

**Solución:**
- Usa Chrome, Edge u Opera
- Actualiza a la última versión
- Habilita la API en `chrome://flags` (busca "Serial")

### ❌ "No se encuentra el puerto serial"

**Problema:** El adaptador no aparece en la lista

**Solución:**
```bash
# Windows
devmgmt.msc  # Abre Administrador de Dispositivos
# Busca "Puertos (COM y LPT)"

# Linux
dmesg | grep ttyUSB

# macOS
system_profiler SPUSBDataType
```

### ❌ "Error de conexión"

**Problema:** No se puede conectar al dispositivo

**Solución:**
1. Verifica que el cable esté bien conectado
2. Prueba con otro adaptador USB-Serial
3. Verifica la velocidad (baud rate)
4. Reinicia el dispositivo
5. Prueba con otra computadora

### ❌ "Autenticación fallida"

**Problema:** Usuario/contraseña incorrectos

**Solución:**
1. Verifica credenciales
2. Prueba conectar manualmente por terminal
3. Reinicia el dispositivo
4. Restablece contraseña si es necesario

### ❌ "Comandos no se ejecutan"

**Problema:** Los comandos se envían pero no se ejecutan

**Solución:**
1. Aumenta el delay entre comandos (en SerialConnection.tsx)
2. Verifica que el dispositivo esté en modo configuración
3. Revisa los comentarios de seguridad
4. Prueba con un comando simple primero

### ❌ "Conexión se cae"

**Problema:** La conexión se pierde durante la ejecución

**Solución:**
1. Verifica que el cable esté bien conectado
2. Reduce la velocidad de baud rate
3. Aumenta los delays entre comandos
4. Verifica que el dispositivo no se reinicia

---

## Ejemplos Prácticos

### Ejemplo 1: Configurar Switch Cisco

**Pasos:**

1. Abre CoreTopology
2. Ve a **Comandos**
3. Selecciona:
   - Fabricante: **Cisco IOS**
   - Dispositivo: **Switch L2/L3**
   - Sede: **Sede Principal**

4. Haz clic en **"Conectar"**
5. Selecciona el puerto COM del adaptador
6. Ingresa:
   - Usuario: `admin`
   - Contraseña: `cisco123`

7. Haz clic en **"Conectar al Puerto Serial"**
8. Espera a ver "✓ Conectado"
9. Haz clic en **"Ejecutar Comandos"**
10. Monitorea el progreso en la terminal
11. Cuando termine, valida con `show running-config`

### Ejemplo 2: Configurar Firewall Fortinet

**Pasos:**

1. Abre CoreTopology
2. Ve a **Comandos**
3. Selecciona:
   - Fabricante: **Fortinet FortiGate**
   - Dispositivo: **Firewall**
   - Sede: **Sede Principal**

4. Haz clic en **"Conectar"**
5. Selecciona el puerto COM
6. Ingresa:
   - Usuario: `admin`
   - Contraseña: `fortinet123`
   - Velocidad: **9600 bps**

7. Haz clic en **"Conectar al Puerto Serial"**
8. Haz clic en **"Ejecutar Comandos"**
9. Espera a que se complete
10. Valida con `show system interface`

### Ejemplo 3: Exportar Comandos para Ejecución Manual

Si prefieres ejecutar manualmente:

1. En el panel de Comandos, haz clic en **".txt"** para descargar
2. Abre el archivo en un editor de texto
3. Copia los comandos (sin comentarios)
4. Conéctate manualmente por SSH/Telnet
5. Pega los comandos en la terminal

---

## Mejores Prácticas

### ✅ Antes de Conectar

- [ ] Verifica que el dispositivo está encendido
- [ ] Prueba la conexión manual primero
- [ ] Haz backup de la configuración actual
- [ ] Verifica que tienes las credenciales correctas
- [ ] Prueba en ambiente de laboratorio

### ✅ Durante la Ejecución

- [ ] No desconectes el cable durante la ejecución
- [ ] No cierres la ventana del navegador
- [ ] Monitorea la terminal de salida
- [ ] Si hay error, detén la ejecución inmediatamente

### ✅ Después de Ejecutar

- [ ] Valida la configuración con comandos show
- [ ] Prueba conectividad entre VLANs
- [ ] Verifica que los servicios funcionan
- [ ] Guarda la configuración nuevamente
- [ ] Documenta los cambios

---

## Especificaciones Técnicas

### Web Serial API

- **Estándar:** W3C Web Serial API
- **Soporte:** Chrome 89+, Edge 89+, Opera 75+
- **Características:**
  - Acceso directo a puertos seriales
  - Lectura/escritura de datos
  - Configuración de velocidad
  - Manejo de errores

### Velocidades Soportadas

```
300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 
28800, 38400, 57600, 115200, 230400, 460800, 921600 bps
```

### Compatibilidad de Dispositivos

| Dispositivo | Baud Rate | Protocolo | Notas |
|-------------|-----------|-----------|-------|
| Cisco IOS | 9600 | RJ-45 a Serial | Requiere cable de consola |
| Fortinet FortiGate | 9600 | RJ-45 a Serial | Compatible con HA |
| HP ProCurve | 9600 | RJ-45 a Serial | Algunos modelos usan 19200 |
| Juniper JunOS | 9600 | RJ-45 a Serial | Requiere adaptador específico |
| MikroTik RouterOS | 115200 | RJ-45 a Serial | Velocidad más alta |

---

## Soporte y Recursos

### Documentación Oficial

- [W3C Web Serial API](https://wicg.github.io/serial/)
- [Chrome Serial API](https://developer.chrome.com/articles/serial/)
- [MDN Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Serial)

### Herramientas Útiles

- **Putty:** Terminal serial gratuita
- **TeraTerm:** Terminal avanzada para Windows
- **Minicom:** Terminal para Linux
- **Screen:** Terminal para macOS/Linux

---

**Versión:** 2.3  
**Última actualización:** Marzo 2026  
**Autor:** Manus AI

**© 2026 CoreTopology. Todos los derechos reservados.**
