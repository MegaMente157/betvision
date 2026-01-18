import { Activity, TrendingUp, BarChart3, Clock, Zap, Info, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { footballApi } from './services/api';
import { newsApi } from './services/api';

// Interface para organizar os dados da API
interface LiveGame {
  fixture: { id: number; status: { elapsed: number } };
  teams: { home: { name: string; logo: string }; away: { name: string; logo: string } };
  goals: { home: number; away: number };
  league: { name: string };
}

// COMPONENTE AUXILIAR PARA O SCRIPT DO SCOREAXIS
function ScoreAxisWidget({ fixtureId }: { fixtureId: number }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://widgets.scoreaxis.com/api/football/live-match/${fixtureId}?widgetId=a0somkj2yfa8&lang=pt&lineupsBlock=1&eventsBlock=1&statsBlock=1&links=0&font=heebo&fontSize=14&widgetWidth=auto&bodyColor=%230f172a&textColor=%23ffffff&borderColor=%231e293b&tabColor=%231e293b`;
    script.async = true;

    const container = document.getElementById('scoreaxis-container');
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }
  }, [fixtureId]);

  return (
    <div id="scoreaxis-container" className="w-full h-full min-h-[600px]">
      <div className="flex items-center justify-center p-20 text-slate-500 text-sm animate-pulse">
        Sincronizando campo tático...
      </div>
    </div>
  );
}

export default function App() {
  const [liveGames, setLiveGames] = useState<LiveGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredNews, setFeaturedNews] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState<LiveGame | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await footballApi.get('/fixtures?live=all');
        const games = response.data.response || [];
        const ligasDesejadas = [742, 140, 71, 39, 2];
        const filtrados = games.filter((g: any) => ligasDesejadas.includes(g.league.id));
        setLiveGames(filtrados.length > 0 ? filtrados : games.slice(0, 10));
        setLoading(false);
      } catch (error) {
        console.error("Erro na Football API:", error);
        setLoading(false);
      }
    };

    const fetchFeaturedNews = async () => {
      try {
        const response = await newsApi.get('/everything', {
          params: {
            q: 'Premier League OR "Paulistão" OR "Brasileirão"',
            language: 'pt',
            sortBy: 'relevancy',
            pageSize: 1,
            apiKey: '4593b9c602cf4db69f728b30136b9563'
          }
        });
        setFeaturedNews(response.data.articles[0]);
      } catch (error) {
        console.error("Erro ao buscar notícia destaque:", error);
      }
    };

    fetchGames();
    fetchFeaturedNews();
    const interval = setInterval(() => {
      fetchGames();
      fetchFeaturedNews();
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  const getAISuggestion = (homeGoals: number, awayGoals: number, elapsed: number) => {
    const totalGoals = homeGoals + awayGoals;
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
      <header className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black text-white italic tracking-tighter">
              BET<span className="text-yellow-500">VISION</span>
            </h1>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
              <Link to="/" className="hover:text-white transition text-yellow-500">LIVE SCANNER</Link>
              <a href="#" className="hover:text-white transition font-bold text-red-500 uppercase tracking-widest text-sm">Alavancagem</a>
              <a href="#" className="hover:text-white transition uppercase text-sm">Prognósticos</a>
            </nav>
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2 rounded-full font-bold text-sm transition shadow-lg shadow-yellow-500/20">
            ENTRAR NO VIP
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section>
              <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-3 text-red-500 uppercase tracking-wide">
                <span className="w-1.5 h-7 bg-red-500 rounded-full"></span>
                🔥 Notícias Destaques
              </h2>
              {featuredNews ? (
                <a href={featuredNews.url} target="_blank" rel="noopener noreferrer">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group cursor-pointer">
                    <img src={featuredNews.urlToImage || "https://images.unsplash.com/photo-1574629810360-7efbbe195018"} alt={featuredNews.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent"></div>
                    <div className="absolute bottom-0 p-6 md:p-10">
                      <span className="bg-red-600 text-[10px] font-black px-2 py-1 rounded mb-4 inline-block uppercase tracking-widest animate-pulse">MAIS BUSCADA</span>
                      <h3 className="text-2xl md:text-4xl font-black leading-tight group-hover:text-yellow-500 transition">{featuredNews.title}</h3>
                      <p className="text-slate-300 text-sm mt-2 line-clamp-2 max-w-2xl">{featuredNews.description}</p>
                      <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-slate-400 uppercase">
                        <span>Fonte: {featuredNews.source.name}</span>
                        <span>•</span>
                        <span>{new Date(featuredNews.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="aspect-video bg-slate-900 rounded-2xl animate-pulse flex items-center justify-center">
                  <p className="text-slate-500">Localizando notícia viral...</p>
                </div>
              )}
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
                      <img src={`https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400`} alt="Partida" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> Postado agora</span>
                      <Link to={`/post/${item}`}><h4 className="font-bold mt-1 mb-2 hover:text-yellow-500 transition">Estatísticas Avançadas: Última atuação e Escalação</h4></Link>
                      <div className="flex items-center gap-2 text-xs text-green-400"><TrendingUp className="w-3 h-3" /><span>Tendência de Green: 85%</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 sticky top-24 shadow-2xl shadow-yellow-500/5">
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-500/10 rounded-lg"><Activity className="w-5 h-5 text-yellow-500" strokeWidth={2.5} /></div>
                  <div className="flex flex-col"><span className="text-white leading-none">Live Scanner</span><span className="text-[10px] text-yellow-500/70 font-black uppercase tracking-widest">Powered by AI</span></div>
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mb-1 text-right">Monitorando agora</span>
                  <span className="text-[11px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-2 font-bold">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>{liveGames.length} PARTIDAS
                  </span>
                </div>
              </h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <p className="text-center text-slate-500 text-sm py-10">Conectando com o campo...</p>
                ) : liveGames.length > 0 ? (
                  liveGames.map((game) => {
                    const suggestion = getAISuggestion(game.goals.home, game.goals.away, game.fixture.status.elapsed);
                    return (
                      <div key={game.fixture.id} className="p-4 bg-[#1e293b] rounded-xl border border-slate-700 hover:border-yellow-500/50 transition shadow-sm mb-2">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase truncate w-32">{game.league.name}</span>
                          <span className="text-yellow-500 font-bold flex items-center gap-1 animate-pulse"><Zap size={12} fill="currentColor" /> {game.fixture.status.elapsed}'</span>
                        </div>
                        <div className="flex justify-between items-center mb-3 text-sm font-bold">
                          <div className="flex-1 text-left truncate">{game.teams.home.name}</div>
                          <div className="px-3 py-1 bg-[#020617] rounded mx-2 text-yellow-500 min-w-[50px] text-center">{game.goals.home} - {game.goals.away}</div>
                          <div className="flex-1 text-right truncate">{game.teams.away.name}</div>
                        </div>
                        <div className="bg-[#020617] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                          <p className={`${suggestion.color || 'text-green-400'} text-[11px] font-black uppercase tracking-tight`}>🎯 {suggestion.bet}</p>
                          <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded font-bold border border-yellow-500/20">IA</span>
                        </div>
                        <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full transition-all duration-1000" style={{ width: `${suggestion.conf}%` }}></div>
                        </div>
                        <button
                          onClick={() => setSelectedGame(game)}
                          className="w-full mt-3 bg-slate-800/50 hover:bg-slate-700 text-slate-400 text-[10px] py-2 rounded-lg font-bold transition-all border border-slate-700 flex items-center justify-center gap-2"
                        >
                          <Info size={14} /> ESCALAÇÃO E CAMPO
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-slate-500 text-sm py-10">Aguardando oportunidades de ouro...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL COM AVISO DE ATUALIZAÇÃO */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-2 md:p-4">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">

            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#1e293b]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-black text-white uppercase tracking-widest">
                  Análise em Tempo Real
                </span>
              </div>
              <button onClick={() => setSelectedGame(null)} className="text-slate-400 hover:text-white transition p-2 bg-slate-800 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Área do Conteúdo com Estética "Em Breve" */}
            <div className="flex-1 bg-[#020617] py-20 px-10 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
                <Zap size={60} className="text-yellow-500 relative z-10 animate-bounce" />
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-2">
                Em Breve <span className="text-yellow-500">Atualização</span>
              </h2>

              <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed">
                Estamos integrando um novo sistema de mapeamento tático para evitar bloqueios de API.
              </p>

              <div className="mt-8 flex gap-2">
                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-[#0f172a] border-t border-slate-800 flex justify-center">
              <button
                onClick={() => setSelectedGame(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-12 py-3 rounded-2xl font-bold text-xs transition uppercase tracking-widest border border-slate-700"
              >
                Voltar para o Scanner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}