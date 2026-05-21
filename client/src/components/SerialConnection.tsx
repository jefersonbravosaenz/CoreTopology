// CoreTopology - Serial Connection Component
// Conexión directa a equipos por puerto serial (COM/USB)

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Wifi, WifiOff, Play, Square, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface SerialConnectionProps {
  commands: string;
  vendor: string;
  deviceType: string;
}

const BAUD_RATES = [9600, 19200, 38400, 57600, 115200];

export default function SerialConnection({ commands, vendor, deviceType }: SerialConnectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [baudRate, setBaudRate] = useState('9600');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [enableMode, setEnableMode] = useState('');
  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const connectSerial = async () => {
    try {
      if (!('serial' in navigator)) {
        toast.error('Web Serial API no soportada en tu navegador');
        return;
      }

      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: parseInt(baudRate) });

      portRef.current = port;
      setIsConnected(true);
      setOutput(['✓ Conectado al puerto serial']);
      toast.success('Conectado al dispositivo');

      // Leer datos del puerto
      const reader = port.readable?.getReader();
      if (reader) {
        readerRef.current = reader;
        readLoop();
      }
    } catch (error: any) {
      toast.error(`Error de conexión: ${error.message}`);
      setOutput([`✗ Error: ${error.message}`]);
    }
  };

  const readLoop = async () => {
    if (!readerRef.current) return;

    try {
      while (true) {
        const { value, done } = await readerRef.current.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        setOutput(prev => [...prev, text]);
      }
    } catch (error) {
      console.log('Lectura completada o puerto cerrado');
    }
  };

  const disconnect = async () => {
    if (readerRef.current) {
      await readerRef.current.cancel();
      readerRef.current = null;
    }

    if (portRef.current) {
      await portRef.current.close();
      portRef.current = null;
    }

    setIsConnected(false);
    setOutput(prev => [...prev, '✓ Desconectado']);
    toast.success('Desconectado del dispositivo');
  };

  const writeToSerial = async (data: string) => {
    if (!portRef.current?.writable) {
      toast.error('Puerto no disponible para escritura');
      return;
    }

    try {
      const writer = portRef.current.writable.getWriter();
      await writer.write(new TextEncoder().encode(data + '\r\n'));
      writer.releaseLock();
    } catch (error: any) {
      toast.error(`Error al escribir: ${error.message}`);
    }
  };

  const executeCommands = async () => {
    if (!isConnected) {
      toast.error('No hay conexión serial activa');
      return;
    }

    setIsExecuting(true);
    setOutput(prev => [...prev, '\n=== INICIANDO EJECUCIÓN DE COMANDOS ===\n']);

    try {
      // Login
      await writeToSerial(username);
      await new Promise(r => setTimeout(r, 500));
      await writeToSerial(password);
      await new Promise(r => setTimeout(r, 500));

      // Enter enable mode si es Cisco
      if (vendor === 'cisco') {
        await writeToSerial('enable');
        await new Promise(r => setTimeout(r, 500));
        if (enableMode) {
          await writeToSerial(enableMode);
          await new Promise(r => setTimeout(r, 500));
        }
        await writeToSerial('configure terminal');
        await new Promise(r => setTimeout(r, 500));
      }

      // Execute commands
      const commandLines = commands.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('!') && !trimmed.startsWith('#');
      });

      for (const cmd of commandLines) {
        if (cmd.trim()) {
          setOutput(prev => [...prev, `> ${cmd}`]);
          await writeToSerial(cmd);
          await new Promise(r => setTimeout(r, 300));
        }
      }

      // Save configuration
      if (vendor === 'cisco') {
        await writeToSerial('end');
        await new Promise(r => setTimeout(r, 300));
        await writeToSerial('write memory');
        await new Promise(r => setTimeout(r, 1000));
      } else if (vendor === 'fortinet') {
        await writeToSerial('end');
        await new Promise(r => setTimeout(r, 300));
      }

      setOutput(prev => [...prev, '\n✓ EJECUCIÓN COMPLETADA\n']);
      toast.success('Comandos ejecutados correctamente');
    } catch (error: any) {
      setOutput(prev => [...prev, `\n✗ ERROR: ${error.message}\n`]);
      toast.error(`Error durante ejecución: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const clearOutput = () => {
    setOutput([]);
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Connection Status */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-indigo-200">
        {isConnected ? (
          <>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-green-700">Conectado</span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-sm font-semibold text-gray-600">Desconectado</span>
          </>
        )}
      </div>

      {/* Connection Settings */}
      {!isConnected ? (
        <div className="space-y-3 p-4 bg-white rounded-lg border border-indigo-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Velocidad (Baud Rate)</Label>
              <Select value={baudRate} onValueChange={setBaudRate}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BAUD_RATES.map(rate => (
                    <SelectItem key={rate} value={String(rate)}>
                      {rate} bps
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Usuario</Label>
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="text-sm"
              />
            </div>
            {vendor === 'cisco' && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Enable Password (opcional)</Label>
                <Input
                  type="password"
                  value={enableMode}
                  onChange={e => setEnableMode(e.target.value)}
                  placeholder="••••••••"
                  className="text-sm"
                />
              </div>
            )}
          </div>

          <Button
            onClick={connectSerial}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          >
            <Wifi className="w-4 h-4" />
            Conectar al Puerto Serial
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={executeCommands}
              disabled={isExecuting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <Play className="w-4 h-4" />
              {isExecuting ? 'Ejecutando...' : 'Ejecutar Comandos'}
            </Button>
            <Button
              onClick={clearOutput}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Limpiar
            </Button>
            <Button
              onClick={disconnect}
              variant="destructive"
              className="gap-2"
            >
              <WifiOff className="w-4 h-4" />
              Desconectar
            </Button>
          </div>
        </div>
      )}

      {/* Output Terminal */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Terminal de Salida</Label>
        <div
          ref={outputRef}
          className="h-48 bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-xs overflow-y-auto border border-slate-700 space-y-1"
        >
          {output.length === 0 ? (
            <div className="text-slate-500">Esperando conexión...</div>
          ) : (
            output.map((line, i) => (
              <div key={i} className={`
                ${line.includes('✓') ? 'text-green-400' : ''}
                ${line.includes('✗') ? 'text-red-400' : ''}
                ${line.includes('===') ? 'text-yellow-400 font-bold' : ''}
                ${line.startsWith('>') ? 'text-blue-400' : ''}
              `}>
                {line}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 space-y-1">
        <div className="flex gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Requisitos:</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-800">
              <li>Navegador con soporte Web Serial API (Chrome, Edge, Opera)</li>
              <li>Cable USB-Serial o adaptador COM conectado</li>
              <li>Dispositivo encendido y accesible por puerto serial</li>
              <li>Credenciales correctas del dispositivo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
