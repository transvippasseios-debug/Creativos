import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../services/campaignService';
import { clientService } from '../services/clientService';
import { Plus, Search, Briefcase, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CampaignStatus } from '../types';
import { CampaignModal } from '../components/campaigns/CampaignModal';

const statusConfig: Record<CampaignStatus, { label: string, color: string, icon: any }> = {
  draft: { label: 'Rascunho', color: 'bg-slate-100 text-slate-700', icon: Clock },
  briefing_pending: { label: 'Briefing Pendente', color: 'bg-amber-50 text-amber-700', icon: AlertCircle },
  ready_to_submit: { label: 'Pronto para Enviar', color: 'bg-blue-50 text-blue-700', icon: CheckCircle2 },
  submitted: { label: 'Enviado', color: 'bg-indigo-50 text-indigo-700', icon: Clock },
  processing: { label: 'Processando', color: 'bg-indigo-100 text-indigo-800 animate-pulse', icon: Clock },
  internal_review: { label: 'Revisão Interna', color: 'bg-purple-50 text-purple-700', icon: Search },
  client_review: { label: 'Revisão do Cliente', color: 'bg-orange-50 text-orange-700', icon: Search },
  revision_requested: { label: 'Ajuste Solicitado', color: 'bg-red-50 text-red-700', icon: AlertCircle },
  approved: { label: 'Aprovado', color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  delivered: { label: 'Entregue', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  failed: { label: 'Falhou', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  cancelled: { label: 'Cancelado', color: 'bg-slate-200 text-slate-800', icon: AlertCircle }
};

export function CampaignsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => campaignService.getCampaigns()
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients()
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => campaignService.createCampaign(data),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setIsModalOpen(false);
      navigate(`/campaigns/${id}`);
    }
  });

  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCampaigns = campaigns?.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.goal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campanhas</h1>
          <p className="text-slate-500 text-sm">Acompanhe o status e entregas de todas as campanhas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Nova Campanha
        </button>
      </div>

      <CampaignModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(data) => createMutation.mutate(data)}
        clients={clients || []}
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou objetivo..."
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Campanha</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4">Criada em</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : filteredCampaigns?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Nenhuma campanha encontrada.
                  </td>
                </tr>
              ) : (
                filteredCampaigns?.map((campaign) => {
                  const status = statusConfig[campaign.status] || statusConfig.draft;
                  return (
                    <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{campaign.name}</p>
                            <p className="text-xs text-slate-500 truncate max-w-xs">{campaign.goal}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                          status.color
                        )}>
                          <status.icon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-xs font-medium capitalize",
                          campaign.priority === 'high' ? "text-red-600" : 
                          campaign.priority === 'medium' ? "text-amber-600" : "text-slate-600"
                        )}>
                          {campaign.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/campaigns/${campaign.id}`}
                          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        >
                          Gerenciar
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
