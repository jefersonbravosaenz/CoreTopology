// RedCalc Pro - Network State Context
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import type { Site, VLAN, ServiceConfig, NetworkProposal } from '@/lib/networkTypes';
import { DEFAULT_VLANS, DEFAULT_SERVICES } from '@/lib/networkTypes';

interface NetworkState {
  proposalName: string;
  sites: Site[];
  vlans: VLAN[];
  baseNetwork: string;
  services: ServiceConfig;
  vendor: 'cisco' | 'hp' | 'juniper' | 'mikrotik' | 'fortinet';
  notes: string;
  savedProposals: NetworkProposal[];
}

interface NetworkContextType extends NetworkState {
  setProposalName: (name: string) => void;
  addSite: () => void;
  removeSite: (id: string) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  setVlans: (vlans: VLAN[]) => void;
  updateVlan: (id: number, updates: Partial<VLAN>) => void;
  setBaseNetwork: (net: string) => void;
  setServices: (services: ServiceConfig) => void;
  setVendor: (vendor: NetworkState['vendor']) => void;
  setNotes: (notes: string) => void;
  saveProposal: () => void;
  loadProposal: (id: string) => void;
  deleteProposal: (id: string) => void;
  importProposal: (data: NetworkProposal) => void;
  exportProposal: () => NetworkProposal;
  totalUsers: number;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

const STORAGE_KEY = 'redcalc_proposals';

function loadFromStorage(): NetworkProposal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(proposals: NetworkProposal[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
  } catch {}
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NetworkState>({
    proposalName: 'Propuesta de Red Empresarial',
    sites: [
      { id: nanoid(), name: 'Sede 1-A', users: 530 },
      { id: nanoid(), name: 'Sede 1-B', users: 300 },
      { id: nanoid(), name: 'Sede 2', users: 1240 },
      { id: nanoid(), name: 'Sede 3', users: 210 },
    ],
    vlans: DEFAULT_VLANS,
    baseNetwork: '10.0.0.0',
    services: DEFAULT_SERVICES,
    vendor: 'cisco' as const,
    notes: '',
    savedProposals: loadFromStorage(),
  });

  const totalUsers = state.sites.reduce((sum, s) => sum + s.users, 0);

  const setProposalName = useCallback((name: string) => {
    setState(prev => ({ ...prev, proposalName: name }));
  }, []);

  const addSite = useCallback(() => {
    setState(prev => ({
      ...prev,
      sites: [...prev.sites, { id: nanoid(), name: `Sede ${prev.sites.length + 1}`, users: 100 }],
    }));
  }, []);

  const removeSite = useCallback((id: string) => {
    setState(prev => ({ ...prev, sites: prev.sites.filter(s => s.id !== id) }));
  }, []);

  const updateSite = useCallback((id: string, updates: Partial<Site>) => {
    setState(prev => ({
      ...prev,
      sites: prev.sites.map(s => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const setVlans = useCallback((vlans: VLAN[]) => {
    setState(prev => ({ ...prev, vlans }));
  }, []);

  const updateVlan = useCallback((id: number, updates: Partial<VLAN>) => {
    setState(prev => ({
      ...prev,
      vlans: prev.vlans.map(v => (v.id === id ? { ...v, ...updates } : v)),
    }));
  }, []);

  const setBaseNetwork = useCallback((baseNetwork: string) => {
    setState(prev => ({ ...prev, baseNetwork }));
  }, []);

  const setServices = useCallback((services: ServiceConfig) => {
    setState(prev => ({ ...prev, services }));
  }, []);

  const setVendor = useCallback((vendor: NetworkState['vendor']) => {
    setState(prev => ({ ...prev, vendor }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setState(prev => ({ ...prev, notes }));
  }, []);

  const exportProposal = useCallback((): NetworkProposal => {
    return {
      id: nanoid(),
      name: state.proposalName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sites: state.sites,
      vlans: state.vlans,
      baseNetwork: state.baseNetwork,
      services: state.services,
      vendor: state.vendor,
      notes: state.notes,
    };
  }, [state]);

  const saveProposal = useCallback(() => {
    const proposal = exportProposal();
    setState(prev => {
      const existing = prev.savedProposals.findIndex(p => p.name === proposal.name);
      let updated: NetworkProposal[];
      if (existing >= 0) {
        updated = prev.savedProposals.map((p, i) =>
          i === existing ? { ...proposal, id: p.id, createdAt: p.createdAt } : p
        );
      } else {
        updated = [...prev.savedProposals, proposal];
      }
      saveToStorage(updated);
      return { ...prev, savedProposals: updated };
    });
  }, [exportProposal]);

  const loadProposal = useCallback((id: string) => {
    setState(prev => {
      const proposal = prev.savedProposals.find(p => p.id === id);
      if (!proposal) return prev;
      return {
        ...prev,
        proposalName: proposal.name,
        sites: proposal.sites,
        vlans: proposal.vlans,
        baseNetwork: proposal.baseNetwork,
        services: proposal.services,
        vendor: proposal.vendor,
        notes: proposal.notes || '',
      };
    });
  }, []);

  const deleteProposal = useCallback((id: string) => {
    setState(prev => {
      const updated = prev.savedProposals.filter(p => p.id !== id);
      saveToStorage(updated);
      return { ...prev, savedProposals: updated };
    });
  }, []);

  const importProposal = useCallback((data: NetworkProposal) => {
    setState(prev => ({
      ...prev,
      proposalName: data.name,
      sites: data.sites,
      vlans: data.vlans,
      baseNetwork: data.baseNetwork,
      services: data.services,
      vendor: data.vendor,
      notes: data.notes || '',
    }));
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        ...state,
        totalUsers,
        setProposalName,
        addSite,
        removeSite,
        updateSite,
        setVlans,
        updateVlan,
        setBaseNetwork,
        setServices,
        setVendor,
        setNotes,
        saveProposal,
        loadProposal,
        deleteProposal,
        importProposal,
        exportProposal,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
}
