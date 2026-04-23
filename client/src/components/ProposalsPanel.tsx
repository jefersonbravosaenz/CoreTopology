// RedCalc Pro - Proposals Management Panel
// Design: Corporate Precision

import { useNetwork } from '@/contexts/NetworkContext';
import { FileText, Trash2, Download, Upload, Clock, Building2, Users, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { NetworkProposal } from '@/lib/networkTypes';

export default function ProposalsPanel() {
  const { savedProposals, loadProposal, deleteProposal, exportProposal, importProposal } = useNetwork();

  const handleExport = () => {
    const proposal = exportProposal();
    const blob = new Blob([JSON.stringify(proposal, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proposal.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Propuesta exportada correctamente');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as NetworkProposal;
          importProposal(data);
          toast.success(`Propuesta "${data.name}" importada correctamente`);
        } catch {
          toast.error('Error al importar: archivo JSON inválido');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleLoad = (id: string, name: string) => {
    loadProposal(id);
    toast.success(`Propuesta "${name}" cargada`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteProposal(id);
    toast.success(`Propuesta "${name}" eliminada`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Gestión de Propuestas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Guarda, carga y exporta tus propuestas de infraestructura
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleImport} className="gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Importar JSON
          </Button>
          <Button size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Exportar Actual
          </Button>
        </div>
      </div>

      {savedProposals.length === 0 ? (
        <div className="rc-card p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <div className="text-muted-foreground font-medium">No hay propuestas guardadas</div>
          <div className="text-sm text-muted-foreground mt-1">
            Usa el botón "Guardar Propuesta" en la barra lateral para guardar la propuesta actual
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {savedProposals.map(proposal => (
            <div key={proposal.id} className="rc-card p-5 hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{proposal.name}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {proposal.sites.length} sedes
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {proposal.sites.reduce((s, site) => s + site.users, 0).toLocaleString()} usuarios
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {proposal.vlans.length} VLANs
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(proposal.updatedAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                        {proposal.vendor}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                        {proposal.baseNetwork}/8
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoad(proposal.id, proposal.name)}
                    className="gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Cargar
                  </Button>
                  <button
                    onClick={() => handleDelete(proposal.id, proposal.name)}
                    className="p-2 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
