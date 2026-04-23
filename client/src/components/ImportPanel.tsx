// RedCalc Pro - Import Panel
// Design: Corporate Precision

import { useState } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { Upload, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { NetworkProposal } from '@/lib/networkTypes';

export default function ImportPanel() {
  const { importProposal } = useNetwork();
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<NetworkProposal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);
    setPreview(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as NetworkProposal;
        if (!data.sites || !data.vlans) {
          setError('El archivo no tiene el formato correcto de propuesta RedCalc Pro');
          return;
        }
        setPreview(data);
      } catch {
        setError('Error al leer el archivo. Asegúrate de que sea un JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleImport = () => {
    if (!preview) return;
    importProposal(preview);
    toast.success(`Propuesta "${preview.name}" importada correctamente`);
    setPreview(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Importar Propuesta</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Importa una propuesta previamente exportada en formato JSON
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`rc-card p-12 text-center border-2 border-dashed transition-colors ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-border hover:border-blue-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <div className="font-medium text-foreground mb-1">
          Arrastra y suelta tu archivo JSON aquí
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          o haz clic para seleccionar un archivo
        </div>
        <label className="cursor-pointer">
          <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            <FileText className="w-4 h-4" />
            Seleccionar archivo
          </span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="rc-card p-4 border-red-200 bg-red-50 flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="rc-card p-5 border-green-200">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-green-700">Archivo válido detectado</div>
              <div className="text-sm text-muted-foreground mt-0.5">
                Revisa los detalles antes de importar
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Nombre', value: preview.name },
              { label: 'Sedes', value: preview.sites.length },
              { label: 'VLANs', value: preview.vlans.length },
              { label: 'Fabricante', value: preview.vendor },
            ].map(item => (
              <div key={item.label} className="rc-card p-3 bg-green-50/50">
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="font-semibold text-sm mt-0.5 capitalize">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleImport} className="gap-1.5">
              <Upload className="w-4 h-4" />
              Importar Propuesta
            </Button>
            <Button variant="outline" onClick={() => setPreview(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Format info */}
      <div className="rc-card p-4 bg-blue-50/50 border-blue-200">
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Formato de archivo esperado</p>
          <p>El archivo debe ser un JSON exportado desde RedCalc Pro con la siguiente estructura:</p>
          <pre className="mt-2 text-xs bg-blue-100 p-2 rounded font-mono overflow-x-auto">
{`{
  "name": "Nombre de la propuesta",
  "sites": [...],
  "vlans": [...],
  "baseNetwork": "10.0.0.0",
  "services": {...},
  "vendor": "cisco"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
