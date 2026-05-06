import { getGames, deleteGame } from './api.js';
import { renderGameCard, renderPagination } from './render.js';

let state = {
  page: 1,
  limit: 12,
  q: '',
  status: '',
  sort: 'created_at',
  order: 'desc',
};

const grid             = document.getElementById('games-grid');
const paginationEl     = document.getElementById('pagination');
const emptyState       = document.getElementById('empty-state');
const statTotal        = document.getElementById('stat-total');
const statHours        = document.getElementById('stat-hours');

const loadGames = async () => {
  try {
    const { data } = await getGames(state);

    grid.innerHTML = '';

    if (!data.data.length) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      data.data.forEach(game => {
        const card = renderGameCard(game);

        card.querySelector('.btn--delete').addEventListener('click', async (e) => {
          e.stopPropagation();
          if (confirm(`¿Eliminar "${game.title}"?`)) {
            await deleteGame(game.id);
            loadGames();
          }
        });

        card.querySelector('.btn--edit').addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.href = `/pages/detail.html?id=${game.id}`;
        });

        grid.appendChild(card);
      });
    }

    statTotal.textContent = data.total ?? '—';
    statHours.textContent = data.totalHours != null ? `${data.totalHours}h` : '—';

    paginationEl.innerHTML = '';
    if (data.totalPages > 1) {
      const nav = renderPagination(data.page, data.totalPages);
      nav.querySelector('#prev').addEventListener('click', () => { state.page--; loadGames(); });
      nav.querySelector('#next').addEventListener('click', () => { state.page++; loadGames(); });
      paginationEl.appendChild(nav);
    }

    lucide.createIcons();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="color:var(--gray-400);padding:var(--sp-4);font-size:0.875rem">Error al cargar los juegos.</p>`;
  }
};

// Búsqueda
let timer;
document.getElementById('search').addEventListener('input', (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    state.q = e.target.value;
    state.page = 1;
    loadGames();
  }, 400);
});

// Filtros de estado
document.getElementById('status-filters').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('#status-filters .chip').forEach(c => c.classList.remove('chip--active'));
  chip.classList.add('chip--active');
  state.status = chip.dataset.status;
  state.page = 1;
  loadGames();
});

// Ordenar por
document.getElementById('sort-select').addEventListener('change', (e) => {
  state.sort = e.target.value;
  state.page = 1;
  loadGames();
});

// Dirección
document.querySelectorAll('.toggle[data-order]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle[data-order]').forEach(b => b.classList.remove('toggle--active'));
    btn.classList.add('toggle--active');
    state.order = btn.dataset.order;
    state.page = 1;
    loadGames();
  });
});

// Vista grid / lista
document.getElementById('view-grid').addEventListener('click', () => {
  grid.classList.remove('games-grid--list');
  document.getElementById('view-grid').classList.add('view-btn--active');
  document.getElementById('view-list').classList.remove('view-btn--active');
});

document.getElementById('view-list').addEventListener('click', () => {
  grid.classList.add('games-grid--list');
  document.getElementById('view-list').classList.add('view-btn--active');
  document.getElementById('view-grid').classList.remove('view-btn--active');
});

loadGames();
