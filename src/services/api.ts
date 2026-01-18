import axios from 'axios';

// API de Futebol (Resultados, Escalações e Odds)
export const footballApi = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-rapidapi-key': '8cd1ed9659f2ab5044fcc5518119505d',
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
});

// API de Notícias (Para o Blog Automático)
export const newsApi = axios.create({
  baseURL: 'https://newsapi.org/v2',
});