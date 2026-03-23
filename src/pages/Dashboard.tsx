import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { campaignService } from '../services/campaignService';
import { clientService } from '../services/clientService';
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => campaignService.getCampaigns()
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients()
  });

  const activeCampaigns = campaigns?.filter(c => !['approved', 'delivered', 'failed', 'cancelled'].includes(c.status)) || [];
  const waitingReview = campaigns?.filter(c => ['internal_review', 'client_review'].includes(c.status)) || [];

  const stats = [
    { label: 'Campanhas Ativas', value: activeCampaigns.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Aguardando Revisão', value: waitingReview.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total de Clientes', value: clients?.length || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Bem-vindo à sua central de criativos com IA.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Campaigns */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Campanhas Recentes</h3>
            <Link to="/campaigns" className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1">
              Ver todas
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {campaigns?.slice(0, 5).map((campaign) => (
              <Link 
                key={campaign.id} 
                to={`/campaigns/${campaign.id}`}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{campaign.name}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{campaign.status.replace('_', ' ')}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Link>
            ))}
            {(!campaigns || campaigns.length === 0) && (
              <div className="p-12 text-center text-slate-500">
                Nenhuma campanha cadastrada.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Pronto para criar?</h3>
              <p className="text-indigo-100 mb-6 max-w-xs">Inicie uma nova campanha agora e deixe nossa IA gerar os melhores criativos para você.</p>
              <Link 
                to="/campaigns" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
              >
                Nova Campanha
                <Plus className="w-4 h-4" />
              </Link>
            </div>
            <TrendingUp className="absolute -bottom-4 -right-4 w-48 h-48 text-indigo-500 opacity-20 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Dicas de Performance</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Briefing Detalhado</p>
                  <p className="text-xs text-slate-500 mt-1">Quanto mais detalhes você fornecer no briefing, melhor será o resultado da IA.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Variações de Formato</p>
                  <p className="text-xs text-slate-500 mt-1">Sempre gere criativos para Feed e Stories para maximizar o alcance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
