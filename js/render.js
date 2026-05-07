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
  const frag = document.createDocumentFragment();

  const prev = document.createElement('button');
  prev.id = 'prev';
  prev.className = 'page-btn';
  prev.disabled = page <= 1;
  prev.innerHTML = '<i data-lucide="chevron-left"></i>';

  const info = document.createElement('span');
  info.className = 'page-info';
  info.textContent = `Página ${page} de ${totalPages}`;

  const next = document.createElement('button');
  next.id = 'next';
  next.className = 'page-btn';
  next.disabled = page >= totalPages;
  next.innerHTML = '<i data-lucide="chevron-right"></i>';

  frag.appendChild(prev);
  frag.appendChild(info);
  frag.appendChild(next);

  return frag;
};
