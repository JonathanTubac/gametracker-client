import {
    getGameById, updateGame, deleteGame,
    getRating, upsertRating, deleteRating,
} from './api.js';

const params = new URLSearchParams(window.location.search);
const gameId = params.get('id');

if (!gameId) {
    window.location.href = '/';
}

const detailLoading = document.getElementById('detail-loading');
const detailContent = document.getElementById('detail-content');
const detailHero = document.getElementById('detail-hero');
const detailCover = document.getElementById('detail-cover');
const detailTitle = document.getElementById('detail-title');
const detailStatus = document.getElementById('detail-status-badge');
const detailDev = document.getElementById('detail-developer');
const detailMeta = document.getElementById('detail-meta');
const detailHours = document.getElementById('detail-hours');
const detailYear = document.getElementById('detail-year');
const detailPlatform = document.getElementById('detail-platform');
const detailGenre = document.getElementById('detail-genre');
const detailNotes = document.getElementById('detail-notes');
const sectionNotes = document.getElementById('section-notes');

const ratingDisplay = document.getElementById('rating-display');
const ratingScore = document.getElementById('rating-score');
const ratingScoreDisplay = document.getElementById('rating-score-display');
const ratingReview = document.getElementById('rating-review');

const modalOverlay = document.getElementById('modal-overlay');
const gameForm = document.getElementById('game-form');
const coverPreview = document.getElementById('cover-preview');
const formImage = document.getElementById('form-image');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

const STATUS_LABELS = {
    playing: '🕹️ Jugando',
    completed: '✅ Completado',
    backlog: '📦 Backlog',
    dropped: '❌ Dropped',
    wishlist: '⭐ Wishlist',
};

let currentGame = null;

const loadGame = async () => {
    try {
        const [game, rating] = await Promise.all([
            getGameById(gameId),
            getRating(gameId),
        ]);

        currentGame = game;
        renderGame(game);
        renderRating(rating);

        detailLoading.classList.add('hidden');
        detailContent.classList.remove('hidden');
    } catch (err) {
        detailLoading.innerHTML = `
      <p style="color:var(--gray-500)">No se pudo cargar el juego.</p>
      <a href="/" class="btn btn--outline btn--sm">← Volver</a>
    `;
    }
};

const renderGame = (game) => {
    document.title = `GameTracker — ${game.title}`;

    if (game.cover_image) {
        detailCover.src = game.cover_image;
        detailCover.alt = game.title;
    } else {
        detailHero.classList.add('detail-hero--no-cover');
    }

    detailTitle.textContent = game.title;
    detailDev.textContent = game.developer ?? '';

    detailStatus.textContent = STATUS_LABELS[game.status] ?? game.status;
    detailStatus.className = `badge badge--${game.status}`;

    const tags = [game.genre, game.platform, game.release_year].filter(Boolean);
    detailMeta.innerHTML = tags
        .map(t => `<span class="detail-hero__tag">${escapeHtml(String(t))}</span>`)
        .join('');

    detailHours.textContent = game.hours_played > 0 ? `${game.hours_played}h` : '—';
    detailYear.textContent = game.release_year ?? '—';
    detailPlatform.textContent = game.platform ?? '—';
    detailGenre.textContent = game.genre ?? '—';

    if (game.notes) {
        detailNotes.textContent = game.notes;
    } else {
        sectionNotes.classList.add('hidden');
    }
};

const renderRating = (rating) => {
    if (!rating) {
        ratingDisplay.innerHTML = `<p style="color:var(--gray-400);font-size:0.875rem">Sin rating todavía. ¡Califica este juego!</p>`;
        ratingScore.value = 0;
        ratingScoreDisplay.textContent = '0';
        return;
    }

    const filled = Math.round(rating.score / 2);
    const stars = Array.from({ length: 5 }, (_, i) =>
        `<span class="rating-display__star ${i < filled ? 'rating-display__star--filled' : ''}">★</span>`
    ).join('');

    ratingDisplay.innerHTML = `
    <div style="display:flex;align-items:baseline;gap:6px">
      <span class="rating-display__score">${rating.score}</span>
      <span class="rating-display__max">/ 10</span>
    </div>
    <div class="rating-display__stars">${stars}</div>
    ${rating.review ? `<p class="rating-display__review">"${escapeHtml(rating.review)}"</p>` : ''}
  `;

    ratingScore.value = rating.score;
    ratingScoreDisplay.textContent = rating.score;
    ratingReview.value = rating.review ?? '';
};

ratingScore.addEventListener('input', () => {
    ratingScoreDisplay.textContent = ratingScore.value;
});

document.getElementById('btn-save-rating').addEventListener('click', async () => {
    try {
        const rating = await upsertRating(gameId, {
            score: parseFloat(ratingScore.value),
            review: ratingReview.value.trim(),
        });
        renderRating(rating);
        showToast('Rating guardado', 'success');
    } catch (err) {
        showToast(err.message, 'error');
    }
});

document.getElementById('btn-delete-rating').addEventListener('click', async () => {
    if (!confirm('¿Quitar el rating de este juego?')) return;
    try {
        await deleteRating(gameId);
        renderRating(null);
        showToast('Rating eliminado', 'success');
    } catch (err) {
        showToast(err.message, 'error');
    }
});

document.getElementById('btn-delete').addEventListener('click', async () => {
    if (!confirm(`¿Eliminar "${currentGame?.title}"? Esta acción no se puede deshacer.`)) return;
    try {
        await deleteGame(gameId);
        showToast('Juego eliminado', 'success');
        setTimeout(() => { window.location.href = '/'; }, 1000);
    } catch (err) {
        showToast(err.message, 'error');
    }
});

const openModal = () => modalOverlay.classList.remove('hidden');
const closeModal = () => {
    modalOverlay.classList.add('hidden');
    gameForm.reset();
};

document.getElementById('btn-edit').addEventListener('click', () => {
    if (!currentGame) return;
    const g = currentGame;

    document.getElementById('form-id').value = g.id;
    document.getElementById('form-title').value = g.title ?? '';
    document.getElementById('form-developer').value = g.developer ?? '';
    document.getElementById('form-genre').value = g.genre ?? '';
    document.getElementById('form-platform').value = g.platform ?? '';
    document.getElementById('form-year').value = g.release_year ?? '';
    document.getElementById('form-hours').value = g.hours_played ?? 0;
    document.getElementById('form-status').value = g.status ?? 'backlog';
    document.getElementById('form-notes').value = g.notes ?? '';

    if (g.cover_image) coverPreview.src = g.cover_image;

    openModal();
});

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

formImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { coverPreview.src = ev.target.result; };
    reader.readAsDataURL(file);
});

gameForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('title', document.getElementById('form-title').value.trim());
    fd.append('developer', document.getElementById('form-developer').value.trim());
    fd.append('genre', document.getElementById('form-genre').value.trim());
    fd.append('platform', document.getElementById('form-platform').value.trim());
    fd.append('release_year', document.getElementById('form-year').value);
    fd.append('hours_played', document.getElementById('form-hours').value || 0);
    fd.append('status', document.getElementById('form-status').value);
    fd.append('notes', document.getElementById('form-notes').value.trim());

    if (formImage.files[0]) fd.append('cover_image', formImage.files[0]);

    try {
        await updateGame(gameId, fd);
        closeModal();
        showToast('Juego actualizado', 'success');
        loadGame();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
};

let toastTimer;
const showToast = (message, type = 'default') => {
    clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.className = `toast toast--${type}`;
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
};

/* ---------- INIT ---------- */
loadGame();