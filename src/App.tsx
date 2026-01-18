import { Activity, TrendingUp, BarChart3, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { footballApi } from './services/api';

// Interface para organizar os dados da API
interface LiveGame {
  fixture: { id: number; status: { elapsed: number } };
  teams: { home: { name: string; logo: string }; away: { name: string; logo: string } };
  goals: { home: number; away: number };
  league: { name: string };
}

export default function App() {
  const [liveGames, setLiveGames] = useState<LiveGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      const CACHE_KEY = 'betvision_live_games';
      const CACHE_TIME_KEY = 'betvision_cache_time';
      const TEN_MINUTES = 10 * 60 * 1000; // Tempo em milissegundos

      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      const now = new Date().getTime();

      // Se houver cache e ele tiver menos de 10 minutos, usa o cache
      if (cachedData && cachedTime && (now - parseInt(cachedTime) < TEN_MINUTES)) {
        console.log("🚀 Usando dados do Cache (Economizando API)");
        setLiveGames(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      // Se não tiver cache ou expirou, faz a chamada real
      try {
        console.log("📡 Chamada real à API efetuada!");
        const response = await footballApi.get('/fixtures?live=all');
        const games = response.data.response || [];

        // Salva no LocalStorage
        localStorage.setItem(CACHE_KEY, JSON.stringify(games));
        localStorage.setItem(CACHE_TIME_KEY, now.toString());

        // IDs de exemplo: 71 (Série A), 39 (Premier League), 2 (Champions League)
        const ligasDesejadas = [742, 140];

        const gamesFiltrados = response.data.response.filter((g: any) =>
          ligasDesejadas.includes(g.league.id)
        );

        setLiveGames(gamesFiltrados);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
        setLoading(false);
      }
    };

    fetchGames();

    // Opcional: Aumentar o intervalo do setInterval para 10 minutos também
    const interval = setInterval(fetchGames, 600000);
    return () => clearInterval(interval);
  }, []);
  // Função simples para gerar uma sugestão automática baseada no placar
  const getAISuggestion = (homeGoals: number, awayGoals: number, elapsed: number) => {
    const totalGoals = homeGoals + awayGoals;

    // Lógica para Over 0.5 Gols ou mais
    if (totalGoals === 0 && elapsed > 20) {
      return { bet: "Probabilidade: +0.5 Gols no jogo", conf: 89, color: "text-green-400" };
    }
    if (totalGoals >= 1 && elapsed < 70) {
      return { bet: "Tendência: +1.5 Gols (Live)", conf: 76, color: "text-yellow-500" };
    }
    return { bet: "Analisando fluxo de ataques...", conf: 65, color: "text-slate-400" };
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black text-white italic tracking-tighter">
              BET<span className="text-yellow-500">VISION</span>
            </h1>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
              <Link to="/" className="hover:text-white transition text-yellow-500">LIVE SCANNER</Link>
              <a href="#" className="hover:text-white transition font-bold text-red-500 uppercase tracking-widest">Alavancagem</a>
              <a href="#" className="hover:text-white transition">PROGNÓSTICOS</a>
            </nav>
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2 rounded-full font-bold text-sm transition shadow-lg shadow-yellow-500/20">
            ENTRAR NO VIP
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* COLUNA ESQUERDA: NOTÍCIAS E DESTAQUE */}
          <div className="lg:col-span-8 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                Destaque do Dia
              </h2>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200"
                  alt="Partida em destaque"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                <div className="absolute bottom-0 p-8">
                  <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded mb-4 inline-block uppercase">Análise de IA</span>
                  <h3 className="text-4xl font-black leading-tight">Como lucrar em jogos empatados após os 70 minutos?</h3>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-500" />
                Análises Recentes (Time do Coração)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition cursor-pointer group">
                    <div className="aspect-video bg-slate-900 relative overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400`}
                        alt="Partida"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} /> Postado agora
                      </span>
                      <Link to={`/post/${item}`}>
                        <h4 className="font-bold mt-1 mb-2 hover:text-yellow-500 transition">
                          Estatísticas Avançadas: Última atuação e Escalação
                        </h4>
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>Tendência de Green: 85%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* COLUNA DIREITA: SINAIS DE IA (AUTOMÁTICOS) */}
          <div className="lg:col-span-4">
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-yellow-500" />
                  Live Scanner IA
                </span>
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  {liveGames.length} JOGOS
                </span>
              </h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <p className="text-center text-slate-500 text-sm py-10">Conectando com o campo...</p>
                ) : liveGames.length > 0 ? (
                  liveGames.map((game) => {
                    // Passamos os gols e o tempo para a lógica de 0.5 gols
                    const suggestion = getAISuggestion(game.goals.home, game.goals.away, game.fixture.status.elapsed);

                    return (
                      <div key={game.fixture.id} className="p-4 bg-[#1e293b] rounded-xl border border-slate-700 hover:border-yellow-500/50 transition shadow-sm mb-2">
                        {/* Cabeçalho do Card */}
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase truncate w-32">
                            {game.league.name}
                          </span>
                          <span className="text-yellow-500 font-bold flex items-center gap-1 animate-pulse">
                            <Zap size={12} fill="currentColor" /> {game.fixture.status.elapsed}'
                          </span>
                        </div>

                        {/* Placar Estilizado */}
                        <div className="flex justify-between items-center mb-3 text-sm font-bold">
                          <div className="flex-1 text-left truncate">{game.teams.home.name}</div>
                          <div className="px-3 py-1 bg-[#020617] rounded mx-2 text-yellow-500 min-w-[50px] text-center">
                            {game.goals.home} - {game.goals.away}
                          </div>
                          <div className="flex-1 text-right truncate">{game.teams.away.name}</div>
                        </div>

                        {/* Área da Sugestão IA */}
                        <div className="bg-[#020617] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                          <p className={`${suggestion.color || 'text-green-400'} text-[11px] font-black uppercase tracking-tight`}>
                            🎯 {suggestion.bet}
                          </p>
                          <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded font-bold border border-yellow-500/20">
                            IA
                          </span>
                        </div>

                        {/* Barra de Confiança Pro */}
                        <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full transition-all duration-1000"
                            style={{ width: `${suggestion.conf}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[8px] text-slate-500 uppercase font-bold">Nível de Confiança</span>
                          <p className="text-[10px] text-slate-400 font-bold italic">{suggestion.conf}%</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-slate-500 text-sm py-10">Aguardando oportunidades de ouro...</p>
                )}
              </div>

              <button className="w-full mt-6 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 py-3 rounded-xl font-bold transition text-sm">
                VER TODOS OS JOGOS AO VIVO
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}