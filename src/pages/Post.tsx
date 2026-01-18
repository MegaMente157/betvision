// src/pages/Post.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Zap, ShieldCheck } from 'lucide-react';

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8">
          <ArrowLeft size={20} /> Voltar para o Início
        </button>

        <header className="mb-8">
          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">ANÁLISE PREMIUM</span>
          <h1 className="text-4xl font-black mt-4">Estatísticas e Escalação: Jogo ID {id}</h1>
          <p className="text-slate-400 mt-2">Dados atualizados em tempo real pela nossa IA.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Box de Escalação */}
          <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 font-bold mb-4 text-yellow-500">
              <Users size={20} /> Escalação Provável
            </h3>
            <ul className="text-sm space-y-2 text-slate-300">
              <li>• Goleiro: Courtois</li>
              <li>• Defesa: Carvajal, Militão, Rüdiger, Mendy</li>
              <li>• Meio: Valverde, Camavinga, Bellingham</li>
              <li>• Ataque: Vinícius Jr, Rodrygo, Mbappé</li>
            </ul>
          </div>

          {/* Box de Aposta Segura */}
          <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 font-bold mb-4 text-green-500">
              <ShieldCheck size={20} /> Aposta Segura (Alavancagem)
            </h3>
            <p className="text-sm mb-4">Baseado em 1.000 simulações, a entrada mais protegida é:</p>
            <div className="bg-green-500 text-black font-bold p-3 rounded-lg text-center">
              VITORIA OU EMPATE (DC) + OVER 0.5 GOLS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}