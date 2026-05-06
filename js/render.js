export const renderGameCard = (game) => {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.innerHTML = `
    <img src="${game.cover_image || '/assets/placeholder.png'}" alt="${game.title}" />
    <div class="card-body">
      <h3>${game.title}</h3>
      <span class="badge badge--${game.status}">${game.status}</span>
      <p>${game.developer || ''}</p>
    </div>
    <div class="card-actions">
      <button class="btn btn--edit" data-id="${game.id}">Editar</button>
      <button class="btn btn--delete" data-id="${game.id}">Eliminar</button>
    </div>
  `;
  return card;
};

export const renderPagination = (page, totalPages) => {
  const nav = document.createElement('div');
  nav.className = 'pagination';
  nav.innerHTML = `
    <button id="prev" ${page <= 1 ? 'disabled' : ''}>«</button>
    <span>Página ${page} de ${totalPages}</span>
    <button id="next" ${page >= totalPages ? 'disabled' : ''}>»</button>
  `;
  return nav;
};