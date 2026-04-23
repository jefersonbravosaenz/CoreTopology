// RedCalc Pro - Main Application Page
// Design: Corporate Precision - Bauhaus-inspired corporate technical design
// Layout: Fixed sidebar (navy) + scrollable content area (light blue-gray)

import { useState } from 'react';
import { toast } from 'sonner';
import { useNetwork } from '@/contexts/NetworkContext';
import Sidebar, { type TabId } from '@/components/Sidebar';
import OverviewPanel from '@/components/OverviewPanel';
import ProposalPanel from '@/components/ProposalPanel';
import VLANPanel from '@/components/VLANPanel';
import IPPanel from '@/components/IPPanel';
import BandwidthPanel from '@/components/BandwidthPanel';
import ServicesPanel from '@/components/ServicesPanel';
import UsersPanel from '@/components/UsersPanel';
import FloorsPanel from '@/components/FloorsPanel';
import EquipmentPanel from '@/components/EquipmentPanel';
import TopologyPanel from '@/components/TopologyPanel';
import CommandsPanel from '@/components/CommandsPanel';
import CostsPanel from '@/components/CostsPanel';
import RedundancyPanel from '@/components/RedundancyPanel';
import QoSPanel from '@/components/QoSPanel';
import ProposalsPanel from '@/components/ProposalsPanel';
import ImportPanel from '@/components/ImportPanel';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { saveProposal, exportProposal, proposalName } = useNetwork();

  const handleSave = () => {
    saveProposal();
    toast.success(`Propuesta "${proposalName}" guardada`);
  };

  const handleExport = () => {
    const proposal = exportProposal();
    const blob = new Blob([JSON.stringify(proposal, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proposal.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Propuesta exportada como JSON');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewPanel />;
      case 'vlans': return <VLANPanel mode="view" />;
      case 'vlan-editor': return <VLANPanel mode="edit" />;
      case 'ip': return <IPPanel />;
      case 'bandwidth': return <BandwidthPanel />;
      case 'services': return <ServicesPanel />;
      case 'users': return <UsersPanel />;
      case 'floors': return <FloorsPanel />;
      case 'equipment': return <EquipmentPanel />;
      case 'topology': return <TopologyPanel />;
      case 'commands': return <CommandsPanel />;
      case 'costs': return <CostsPanel />;
      case 'redundancy': return <RedundancyPanel />;
      case 'qos': return <QoSPanel />;
      case 'proposals': return <ProposalsPanel />;
      case 'import': return <ImportPanel />;
      default: return <OverviewPanel />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSave={handleSave}
        onExport={handleExport}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">RedCalc Pro</div>
            <span className="text-muted-foreground">/</span>
            <div className="text-sm font-semibold text-foreground capitalize">
              {activeTab.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground hidden sm:block">
              Calculadora de Infraestructura de Red v2.0
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500" title="Activo" />
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          {/* Proposal config panel (always visible at top) */}
          {activeTab === 'overview' && (
            <div className="border-b border-border bg-card">
              <div className="max-w-6xl mx-auto px-6 py-4">
                <ProposalPanel />
              </div>
            </div>
          )}

          {/* Main panel */}
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="animate-fade-up">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
