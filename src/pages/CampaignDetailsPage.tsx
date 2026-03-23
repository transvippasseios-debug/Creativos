import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../services/campaignService';
import { clientService } from '../services/clientService';
import { 
  ChevronLeft, 
  Send, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Image as ImageIcon,
  Download,
  History,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { BriefingForm } from '../components/campaigns/BriefingForm';
import { CampaignStatus } from '../types';

export function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: campaign, isLoading: isLoadingCampaign } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignService.getCampaignById(id!),
    enabled: !!id
  });

  const { data: client } = useQuery({
    queryKey: ['client', campaign?.clientId],
    queryFn: () => clientService.getClientById(campaign!.clientId),
    enabled: !!campaign?.clientId
  });

  const { data: assets } = useQuery({
    queryKey: ['assets', id],
    queryFn: () => campaignService.getAssets(id!),
    enabled: !!id
  });

  const submitMutation = useMutation({
    mutationFn: () => campaignService.submitCampaign(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
    }
  });

  if (isLoadingCampaign) return <div className="animate-pulse space-y-8">...</div>;
  if (!campaign) return <div>Campanha não encontrada</div>;

  const isDraft = campaign.status === 'draft' || campaign.status === 'briefing_pending';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/campaigns')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Campanhas
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Status:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
            {campaign.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & Briefing */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{campaign.name}</h1>
                <p className="text-slate-500 mt-1">Cliente: <span className="font-medium text-slate-900">{client?.name}</span></p>
              </div>
              {isDraft && (
                <button 
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {submitMutation.isPending ? "Enviando..." : "Enviar para Geração"}
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-slate-100">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Objetivo</p>
                <p className="text-sm font-medium text-slate-900">{campaign.goal}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Canal</p>
                <p className="text-sm font-medium text-slate-900">{campaign.channel}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Prioridade</p>
                <p className="text-sm font-medium text-slate-900 capitalize">{campaign.priority}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Criada em</p>
                <p className="text-sm font-medium text-slate-900">{new Date(campaign.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                Briefing da Campanha
              </h3>
              {isDraft ? (
                <BriefingForm 
                  initialData={campaign.briefing}
                  onSubmit={(data) => campaignService.updateCampaign(id!, { briefing: data, status: 'ready_to_submit' })}
                  onSaveDraft={(data) => campaignService.updateCampaign(id!, { briefing: data })}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                  {Object.entries(campaign.briefing || {}).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">{key}</p>
                      <p className="text-sm text-slate-700">{Array.isArray(value) ? value.join(', ') : value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assets Gallery */}
          {!isDraft && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-indigo-600" />
                Criativos Gerados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assets?.length === 0 ? (
                  <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Os criativos estão sendo processados...</p>
                    <p className="text-xs text-slate-400 mt-1">Isso pode levar alguns minutos.</p>
                  </div>
                ) : (
                  assets?.map((asset) => (
                    <div key={asset.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                      <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                        {asset.assetType === 'image' ? (
                          <img 
                            src={asset.fileUrl} 
                            alt={asset.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div className="flex gap-2 w-full">
                            <button className="flex-1 bg-white text-slate-900 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                              <CheckCircle2 className="w-3 h-3" /> Aprovar
                            </button>
                            <button className="flex-1 bg-white/20 backdrop-blur-md text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                              <MessageSquare className="w-3 h-3" /> Ajustar
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between border-t border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{asset.title || 'Criativo'}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-0.5">{asset.format}</p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Atividade Recente</h3>
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-700 font-medium">Campanha criada</p>
                  <p className="text-xs text-slate-400 mt-0.5">Há 2 horas</p>
                </div>
              </div>
              {campaign.status === 'submitted' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">Enviada para geração</p>
                    <p className="text-xs text-slate-400 mt-0.5">Há 15 minutos</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Suporte e Feedback</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Precisa de ajuda com esta campanha? Fale com nosso time operacional.
            </p>
            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Abrir Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
