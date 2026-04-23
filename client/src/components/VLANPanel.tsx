// RedCalc Pro - VLAN Panel
// Design: Corporate Precision

import { useState } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { getPriorityColor } from '@/lib/networkCalc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers, Plus, Trash2, Info, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VLAN } from '@/lib/networkTypes';
import { nanoid } from 'nanoid';

const PRIORITY_OPTIONS = ['Muy Alta', 'Alta', 'Media-Alta', 'Media', 'Baja'] as const;
const VLAN_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#6B7280', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

interface VLANPanelProps {
  mode: 'view' | 'edit';
}

export default function VLANPanel({ mode }: VLANPanelProps) {
  const { vlans, setVlans, updateVlan } = useNetwork();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<VLAN>>({});

  const startEdit = (vlan: VLAN) => {
    setEditingId(vlan.id);
    setEditData({ ...vlan });
  };

  const saveEdit = () => {
    if (editingId !== null && editData) {
      updateVlan(editingId, editData);
    }
    setEditingId(null);
    setEditData({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const addVlan = () => {
    const maxId = Math.max(...vlans.map(v => v.id), 0);
    const newId = Math.ceil((maxId + 1) / 10) * 10;
    const newVlan: VLAN = {
      id: newId,
      name: `VLAN${newId}`,
      area: `Área ${newId}`,
      description: 'Nueva VLAN',
      priority: 'Media',
      cos: 3,
      color: VLAN_COLORS[vlans.length % VLAN_COLORS.length],
      userPercent: 0,
    };
    setVlans([...vlans, newVlan]);
    startEdit(newVlan);
  };

  const removeVlan = (id: number) => {
    setVlans(vlans.filter(v => v.id !== id));
  };

  if (mode === 'view') {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">Segmentación VLAN</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configuración estándar de VLANs para segmentación de red por área funcional
          </p>
        </div>

        <div className="rc-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">VLAN</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Área</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Descripción</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prioridad</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">CoS</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">% Usuarios</th>
              </tr>
            </thead>
            <tbody>
              {vlans.map(vlan => (
                <tr key={vlan.id} className="rc-table-row">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: vlan.color }}
                      />
                      <span className="font-mono font-semibold text-blue-600">{vlan.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{vlan.area}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{vlan.description}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className="rc-badge text-white text-xs"
                      style={{ backgroundColor: getPriorityColor(vlan.priority) }}
                    >
                      {vlan.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold">{vlan.cos}</td>
                  <td className="py-3 px-4 text-center">
                    {vlan.userPercent > 0 ? (
                      <span className="font-mono text-blue-600">{vlan.userPercent}%</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Infra</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="rc-card p-4 border-l-4 border-l-blue-500 bg-blue-50/50">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 space-y-1">
              <p className="font-semibold">Notas de Implementación</p>
              <p>Las VLANs se replican en todas las sedes para consistencia.</p>
              <p>El CoS (Class of Service) determina la prioridad en la cola de transmisión.</p>
              <p>La VLAN 60 (VIP) tiene prioridad máxima en toda la red.</p>
              <p>La VLAN 50 (Invitados) está completamente aislada del resto.</p>
              <p>Las VLANs 80 y 90 requieren acceso controlado mediante ACLs.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Editor de VLANs</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Personaliza las VLANs según las necesidades de tu organización
          </p>
        </div>
        <Button onClick={addVlan} size="sm" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Nueva VLAN
        </Button>
      </div>

      <div className="space-y-2">
        {vlans.map(vlan => (
          <div
            key={vlan.id}
            className={cn(
              'rc-card p-4 transition-all',
              editingId === vlan.id ? 'ring-2 ring-blue-500' : ''
            )}
          >
            {editingId === vlan.id ? (
              // Edit form
              <div className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">ID VLAN</Label>
                    <Input
                      type="number"
                      value={editData.id}
                      onChange={e => setEditData(prev => ({ ...prev, id: parseInt(e.target.value) || 0 }))}
                      className="h-8 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Nombre</Label>
                    <Input
                      value={editData.name || ''}
                      onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Área</Label>
                    <Input
                      value={editData.area || ''}
                      onChange={e => setEditData(prev => ({ ...prev, area: e.target.value }))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">CoS (0-7)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={7}
                      value={editData.cos}
                      onChange={e => setEditData(prev => ({ ...prev, cos: parseInt(e.target.value) || 0 }))}
                      className="h-8 font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1 md:col-span-1">
                    <Label className="text-xs">Descripción</Label>
                    <Input
                      value={editData.description || ''}
                      onChange={e => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Prioridad</Label>
                    <Select
                      value={editData.priority}
                      onValueChange={v => setEditData(prev => ({ ...prev, priority: v as VLAN['priority'] }))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">% Usuarios</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={editData.userPercent}
                      onChange={e => setEditData(prev => ({ ...prev, userPercent: parseInt(e.target.value) || 0 }))}
                      className="h-8 font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Color:</Label>
                    {VLAN_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setEditData(prev => ({ ...prev, color: c }))}
                        className={cn(
                          'w-5 h-5 rounded-full border-2 transition-transform hover:scale-110',
                          editData.color === c ? 'border-gray-800 scale-110' : 'border-transparent'
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={cancelEdit} className="gap-1">
                      <X className="w-3 h-3" />
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={saveEdit} className="gap-1">
                      <Check className="w-3 h-3" />
                      Guardar
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // View row
              <div className="flex items-center gap-4">
                <div
                  className="w-3 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: vlan.color }}
                />
                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2 items-center">
                  <div>
                    <div className="font-mono font-bold text-blue-600">VLAN {vlan.id}</div>
                    <div className="text-xs text-muted-foreground">{vlan.name}</div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{vlan.area}</div>
                    <div className="text-xs text-muted-foreground truncate">{vlan.description}</div>
                  </div>
                  <div className="hidden md:block">
                    <span
                      className="rc-badge text-white text-xs"
                      style={{ backgroundColor: getPriorityColor(vlan.priority) }}
                    >
                      {vlan.priority}
                    </span>
                  </div>
                  <div className="hidden md:block text-center">
                    <span className="font-mono font-semibold">CoS {vlan.cos}</span>
                  </div>
                  <div className="hidden md:block text-center text-sm">
                    {vlan.userPercent > 0 ? `${vlan.userPercent}%` : <span className="text-muted-foreground text-xs">Infra</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(vlan)}
                    className="p-1.5 rounded text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeVlan(vlan.id)}
                    disabled={vlans.length <= 1}
                    className="p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User % validation */}
      {(() => {
        const totalPct = vlans.reduce((s, v) => s + v.userPercent, 0);
        return totalPct !== 100 ? (
          <div className={cn(
            'rc-card p-3 flex items-center gap-2 text-sm',
            totalPct > 100 ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-700'
          )}>
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>
              La suma de % de usuarios es <strong>{totalPct}%</strong>.
              {totalPct > 100 ? ' Reduce los porcentajes para que sumen 100%.' : ` Faltan ${100 - totalPct}% por asignar.`}
            </span>
          </div>
        ) : (
          <div className="rc-card p-3 flex items-center gap-2 text-sm border-green-200 bg-green-50 text-green-700">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Los porcentajes de usuarios suman correctamente 100%.</span>
          </div>
        );
      })()}
    </div>
  );
}
