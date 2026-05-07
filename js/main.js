import { getGames, deleteGame, createGame, uploadImage, exportGames } from './api.js';
import { renderGameCard, renderPagination } from './render.js';

let state = {
  page: 1,
  limit: 10,
  q: '',
  status: '',
  sort: 'created_at',
  order: 'desc',
};

const grid         = document.getElementById('games-grid');
const paginationEl = document.getElementById('pagination');
const emptyState   = document.getElementById('empty-state');
const statTotal    = document.getElementById('stat-total');
const statHours    = document.getElementById('stat-hours');

// Modal
const modalOverlay     = document.getElementById('modal-overlay');
const gameForm         = document.getElementById('game-form');
const coverPreview     = document.getElementById('cover-preview');
const formImage        = document.getElementById('form-image');
const formScore        = document.getElementById('form-score');
const formScoreDisplay = document.getElementById('form-score-display');

// Toast
const toast        = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
let toastTimer;
const showToast = (message, type = 'default') => {
  clearTimeout(toastTimer);
  toastMessage.textContent = message;
  toast.className = `toast toast--${type}`;
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
};

/* ---- Modal ---- */
const openModal = () => {
  gameForm.reset();
  coverPreview.src = '/assets/placeholder.png';
  formScoreDisplay.textContent = '0';
  modalOverlay.classList.remove('hidden');
};

const closeModal = () => {
  modalOverlay.classList.add('hidden');
  gameForm.reset();
};

document.getElementById('btn-new-game').addEventListener('click', openModal);
document.getElementById('btn-empty-add').addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

// Preview imagen al seleccionar archivo
formImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => { coverPreview.src = ev.target.result; };
  reader.readAsDataURL(file);
});

// Score display
formScore.addEventListener('input', () => {
  formScoreDisplay.textContent = formScore.value;
});

// Submit
gameForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btnSubmit = document.getElementById('btn-submit');
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Guardando...';

  let image = '';
  if (formImage.files[0]) {
    try {
      image = await uploadImage(formImage.files[0]);
    } catch {
      showToast('Error al subir la imagen', 'error');
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Guardar';
      return;
    }
  }

  try {
    await createGame({
      title:    document.getElementById('form-title').value.trim(),
      dev:      document.getElementById('form-developer').value.trim(),
      genre:    document.getElementById('form-genre').value.trim(),
      platform: document.getElementById('form-platform').value.trim(),
      release:  document.getElementById('form-year').value,
      hours:    Number(document.getElementById('form-hours').value) || 0,
      status:   document.getElementById('form-status').value,
      notes:    document.getElementById('form-notes').value.trim(),
      image,
    });
    closeModal();
    showToast('Juego agregado', 'success');
    state.page = 1;
    loadGames();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Guardar';
  }
});

/* ---- Carga de juegos ---- */
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
    const totalPages = data.totalPages ?? Math.ceil((data.total ?? 0) / state.limit);
    if (totalPages > 1) {
      const nav = renderPagination(data.page ?? state.page, totalPages);
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

/* ---- Filtros ---- */
let timer;
document.getElementById('search').addEventListener('input', (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    state.q = e.target.value;
    state.page = 1;
    loadGames();
  }, 400);
});

document.getElementById('status-filters').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('#status-filters .chip').forEach(c => c.classList.remove('chip--active'));
  chip.classList.add('chip--active');
  state.status = chip.dataset.status;
  state.page = 1;
  loadGames();
});

document.getElementById('sort-select').addEventListener('change', (e) => {
  state.sort = e.target.value;
  state.page = 1;
  loadGames();
});

document.querySelectorAll('.toggle[data-order]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle[data-order]').forEach(b => b.classList.remove('toggle--active'));
    btn.classList.add('toggle--active');
    state.order = btn.dataset.order;
    state.page = 1;
    loadGames();
  });
});

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

/* ---- Exportar CSV ---- */
const toCSV = (games) => {
  const cols    = ['id', 'title', 'developer', 'genre', 'platform', 'release_year', 'status', 'hours_played', 'notes'];
  const headers = ['ID', 'Título', 'Desarrollador', 'Género', 'Plataforma', 'Año', 'Estado', 'Horas jugadas', 'Notas'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = games.map(g => cols.map(c => typeof g[c] === 'string' ? esc(g[c]) : (g[c] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
};

document.getElementById('btn-export-csv').addEventListener('click', async () => {
  try {
    const games = await exportGames();
    const blob  = new Blob(['﻿' + toCSV(games)], { type: 'text/csv;charset=utf-8;' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href      = url;
    a.download  = `gametracker-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exportado', 'success');
  } catch {
    showToast('Error al exportar', 'error');
  }
});

loadGames();
