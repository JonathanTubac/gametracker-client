import { getGames, deleteGame } from './api.js';
import { renderGameCard, renderPagination } from './render.js';

let state = {
  page: 1,
  limit: 12,
  q: '',
  sort: 'created_at',
  order: 'desc'
};

const grid = document.getElementById('games-grid');
const paginationContainer = document.getElementById('pagination');

const loadGames = async () => {
  const { data, totalPages, page } = await getGames(state);

  grid.innerHTML = '';
  data.data.forEach(game => {
    const card = renderGameCard(game);

    card.querySelector('.btn--delete').addEventListener('click', async () => {
      if (confirm(`¿Eliminar ${game.title}?`)) {
        await deleteGame(game.id);
        loadGames();
      }
    });

    card.querySelector('.btn--edit').addEventListener('click', () => {
      window.location.href = `/pages/detail.html?id=${game.id}`;
    });

    grid.appendChild(card);
  });

  paginationContainer.innerHTML = '';
  const nav = renderPagination(data.page, data.totalPages);
  nav.querySelector('#prev').addEventListener('click', () => { state.data.page--; loadGames(); });
  nav.querySelector('#next').addEventListener('click', () => { state.data.page++; loadGames(); });
  paginationContainer.appendChild(nav);
};

let timer;
document.getElementById('search').addEventListener('input', (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    state.q = e.target.value;
    state.page = 1;
    loadGames();
  }, 400);
});

loadGames();