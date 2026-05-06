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
  card.innerHTML = `
    <img src="${game.cover_image || '/assets/placeholder.png'}" alt="${game.title}" />
    <div class="card-body">
      <h3>${game.title}</h3>
      <span class="badge badge--${game.status}">
        <i data-lucide="${icon}"></i> ${label}
      </span>
      <p>${game.developer || ''}</p>
    </div>
    <div class="card-actions">
      <button class="btn btn--edit" data-id="${game.id}">
        <i data-lucide="pencil"></i> Editar
      </button>
      <button class="btn btn--delete" data-id="${game.id}">
        <i data-lucide="trash-2"></i> Eliminar
      </button>
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
