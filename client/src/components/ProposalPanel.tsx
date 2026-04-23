// RedCalc Pro - Proposal Configuration Panel
// Design: Corporate Precision

import { useNetwork } from '@/contexts/NetworkContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Building2, Users, Globe, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProposalPanel() {
  const {
    proposalName, setProposalName,
    sites, addSite, removeSite, updateSite,
    baseNetwork, setBaseNetwork,
    totalUsers,
  } = useNetwork();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Información de la Propuesta</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define el nombre, sedes y red base para el cálculo VLSM
        </p>
      </div>

      {/* Proposal Name */}
      <div className="rc-card p-5 rc-card-accent-blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="proposal-name" className="text-sm font-semibold">
              Nombre de la Propuesta
            </Label>
            <Input
              id="proposal-name"
              value={proposalName}
              onChange={e => setProposalName(e.target.value)}
              placeholder="Ej: Propuesta de Red Empresarial 2026"
              className="font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="base-network" className="text-sm font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Red Base (VLSM)
            </Label>
            <Input
              id="base-network"
              value={baseNetwork}
              onChange={e => setBaseNetwork(e.target.value)}
              placeholder="10.0.0.0"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Cada sede recibe un bloque /16 a partir de esta dirección
            </p>
          </div>
        </div>
      </div>

      {/* Sites */}
      <div className="rc-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-foreground">Sedes</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {sites.length}
            </span>
          </div>
          <Button
            onClick={addSite}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Sede
          </Button>
        </div>

        <div className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-5">Nombre de la Sede</div>
            <div className="col-span-3">Usuarios</div>
            <div className="col-span-3">Pisos</div>
            <div className="col-span-1"></div>
          </div>

          {sites.map((site, idx) => (
            <div
              key={site.id}
              className={cn(
                'grid grid-cols-12 gap-3 items-center px-3 py-2.5 rounded-md border border-border',
                'hover:border-blue-200 hover:bg-blue-50/30 transition-colors'
              )}
            >
              <div className="col-span-5 flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground w-5 text-right">
                  {idx + 1}
                </span>
                <Input
                  value={site.name}
                  onChange={e => updateSite(site.id, { name: e.target.value })}
                  placeholder="Nombre de la sede"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-3">
                <div className="relative">
                  <Users className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={site.users}
                    onChange={e => updateSite(site.id, { users: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min={1}
                    className="h-8 text-sm pl-7 font-mono"
                  />
                </div>
              </div>
              <div className="col-span-3">
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={site.floors || ''}
                    onChange={e => updateSite(site.id, { floors: parseInt(e.target.value) || undefined })}
                    placeholder="Auto"
                    min={1}
                    className="h-8 text-sm pl-7 font-mono"
                  />
                </div>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => removeSite(site.id)}
                  disabled={sites.length <= 1}
                  className="p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Total de Usuarios</span>
          </div>
          <div className="rc-stat-number text-blue-600">
            {totalUsers.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rc-card p-4 text-center">
          <div className="text-2xl font-bold font-mono text-blue-600">{sites.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Sedes</div>
        </div>
        <div className="rc-card p-4 text-center">
          <div className="text-2xl font-bold font-mono text-blue-600">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Usuarios</div>
        </div>
        <div className="rc-card p-4 text-center">
          <div className="text-2xl font-bold font-mono text-blue-600">
            {Math.ceil(totalUsers / 48)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Switches Est.</div>
        </div>
      </div>
    </div>
  );
}
