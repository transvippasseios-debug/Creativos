import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Send, ChevronRight, ChevronLeft } from 'lucide-react';

const briefingSchema = z.object({
  goal: z.string().min(10, "Objetivo deve ter pelo menos 10 caracteres"),
  product: z.string().min(3, "Produto/Serviço é obrigatório"),
  cta: z.string().min(3, "CTA é obrigatória"),
  audience: z.string().min(10, "Público-alvo deve ser descrito"),
  tone: z.string().min(3, "Tom de voz é obrigatório"),
  restrictions: z.string().optional(),
  formats: z.array(z.string()).min(1, "Selecione pelo menos um formato"),
});

type BriefingData = z.infer<typeof briefingSchema>;

interface BriefingFormProps {
  initialData?: Partial<BriefingData>;
  onSubmit: (data: BriefingData) => void;
  onSaveDraft: (data: Partial<BriefingData>) => void;
}

export function BriefingForm({ initialData, onSubmit, onSaveDraft }: BriefingFormProps) {
  const [step, setStep] = React.useState(1);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<BriefingData>({
    resolver: zodResolver(briefingSchema),
    defaultValues: {
      formats: [],
      ...initialData
    }
  });

  const formats = [
    { id: 'feed_4_5', label: 'Feed (4:5)' },
    { id: 'story_9_16', label: 'Story (9:16)' },
    { id: 'square_1_1', label: 'Quadrado (1:1)' },
    { id: 'landscape_16_9', label: 'Horizontal (16:9)' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
              step === s ? "bg-indigo-600 text-white" : 
              step > s ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
            )}>
              {s}
            </div>
            <div className={cn(
              "h-1 w-8 rounded",
              step > s ? "bg-emerald-500" : "bg-slate-200"
            )} />
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-lg font-semibold text-slate-900">Dados da Campanha</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Objetivo da Campanha</label>
              <textarea 
                {...register('goal')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                placeholder="Ex: Gerar leads para clareamento dental com foco em noivas..."
              />
              {errors.goal && <p className="mt-1 text-xs text-red-600">{errors.goal.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Produto ou Serviço</label>
              <input 
                {...register('product')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Clareamento Dental Premium"
              />
              {errors.product && <p className="mt-1 text-xs text-red-600">{errors.product.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA Desejada</label>
              <input 
                {...register('cta')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Agende sua avaliação gratuita"
              />
              {errors.cta && <p className="mt-1 text-xs text-red-600">{errors.cta.message}</p>}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-lg font-semibold text-slate-900">Público e Marca</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Público-alvo</label>
              <textarea 
                {...register('audience')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                placeholder="Ex: Mulheres de 25-45 anos, classe A/B, interessadas em estética..."
              />
              {errors.audience && <p className="mt-1 text-xs text-red-600">{errors.audience.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tom de Voz</label>
              <input 
                {...register('tone')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Premium, confiável, direto"
              />
              {errors.tone && <p className="mt-1 text-xs text-red-600">{errors.tone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Restrições (Opcional)</label>
              <input 
                {...register('restrictions')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Não usar a cor vermelha, não prometer resultados garantidos"
              />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-lg font-semibold text-slate-900">Formatos e Entrega</h3>
          <div className="grid grid-cols-2 gap-4">
            {formats.map((f) => (
              <label key={f.id} className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  value={f.id}
                  {...register('formats')}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700">{f.label}</span>
              </label>
            ))}
          </div>
          {errors.formats && <p className="mt-1 text-xs text-red-600">{errors.formats.message}</p>}
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <div className="flex gap-3">
          {step > 1 && (
            <button 
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
          )}
          <button 
            type="button"
            onClick={() => onSaveDraft(watch())}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Salvar Rascunho
          </button>
        </div>

        {step < 3 ? (
          <button 
            type="button"
            onClick={() => setStep(s => s + 1)}
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button 
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Finalizar e Enviar
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
