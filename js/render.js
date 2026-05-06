const STATUS_LABELS = {
  playing:   'Jugando',
  completed: 'Completado',
  backlog:   'Backlog',
  dropped:   'Dropped',
  wishlist:  'Wishlist',
};

const STATUS_ICONS = {
  playing:   'play',
  completed: 'check-circle',
  backlog:   'archive',
  dropped:   'x-circle',
  wishlist:  'star',
};

export const renderGameCard = (game) => {
  const card = document.createElement('div');
  card.className = 'game-card';
  const label = STATUS_LABELS[game.status] ?? game.status;
  const icon  = STATUS_ICONS[game.status] ?? 'circle';
  const cover = game.cover_image || '/assets/placeholder.png';

  card.innerHTML = `
    <img class="game-card__cover" src="${cover}" alt="${game.title}" />
    <div class="game-card__body">
      <p class="game-card__title">${game.title}</p>
      <p class="game-card__meta">${game.developer || '&nbsp;'}</p>
    </div>
    <div class="game-card__footer">
      <span class="badge badge--${game.status}">
        <i data-lucide="${icon}"></i> ${label}
      </span>
      <div class="game-card__actions">
        <button class="icon-btn btn--edit" data-id="${game.id}" title="Ver detalle">
          <i data-lucide="eye"></i>
        </button>
        <button class="icon-btn icon-btn--danger btn--delete" data-id="${game.id}" title="Eliminar">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>
  `;
  return card;
};

export const renderPagination = (page, totalPages) => {
  const nav = document.createElement('div');
  nav.className = 'pagination';
  nav.innerHTML = `
    <button id="prev" ${page <= 1 ? 'disabled' : ''}><i data-lucide="chevron-left"></i></button>
    <span>Página ${page} de ${totalPages}</span>
    <button id="next" ${page >= totalPages ? 'disabled' : ''}><i data-lucide="chevron-right"></i></button>
  `;
  return nav;
};
