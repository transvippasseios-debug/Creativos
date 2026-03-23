import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '../services/clientService';
import { campaignService } from '../services/campaignService';
import { 
  ChevronLeft, 
  Building2, 
  Globe, 
  Instagram, 
  Mail, 
  Phone, 
  Briefcase,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function ClientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClientById(id!),
    enabled: !!id
  });

  const { data: campaigns } = useQuery({
    queryKey: ['campaigns', id],
    queryFn: () => campaignService.getCampaigns(id!),
    enabled: !!id
  });

  if (isLoadingClient) return <div className="animate-pulse space-y-8">...</div>;
  if (!client) return <div>Cliente não encontrado</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/clients')}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar para Clientes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                <Building2 className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
              <p className="text-slate-500">{client.segment}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                {client.email}
              </div>
              {client.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {client.phone}
                </div>
              )}
              {client.websiteUrl && (
                <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-indigo-600 hover:underline">
                  <Globe className="w-4 h-4 text-slate-400" />
                  Website
                </a>
              )}
              {client.instagramUrl && (
                <a href={client.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-indigo-600 hover:underline">
                  <Instagram className="w-4 h-4 text-slate-400" />
                  Instagram
                </a>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Branding</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Tom de Voz</p>
                <p className="text-sm text-slate-700">{client.brandTone || 'Não definido'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-600" />
              Campanhas
            </h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
              <Plus className="w-4 h-4" />
              Nova Campanha
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {campaigns?.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
                <p className="text-slate-500">Nenhuma campanha encontrada para este cliente.</p>
              </div>
            ) : (
              campaigns?.map((campaign) => (
                <Link 
                  key={campaign.id}
                  to={`/campaigns/${campaign.id}`}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{campaign.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{campaign.goal}</p>
                      <div className="flex items-center gap-3 mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                          {campaign.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
