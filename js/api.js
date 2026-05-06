const API_URL = 'http://localhost:3000/api/v1';

export const getGames = async ({ page, limit, q, sort, order }) => {
    const params = new URLSearchParams({ page, limit, q, sort, order });
    const res = await fetch(`${API_URL}/games?${params}`);
    if (!res.ok) throw new Error('Error fetching games');
    return res.json();
};

export const getGameById = async (id_game) => {
    const res = await fetch(`${API_URL}/games/${id_game}`)
    if (!res.ok) throw new Error('Error fetching game')
    return res.json();
}

export const createGame = async (formData) => {
    const res = await fetch(`${API_URL}/games`, {
        method: 'POST',
        body: formData // FormData para manejar imágenes
    });
    if (!res.ok) throw new Error('Error creating game');
    return res.json();
};

export const updateGame = async (id, formData) => {
    const res = await fetch(`${API_URL}/games/${id}`, {
        method: 'PUT',
        body: formData
    });
    if (!res.ok) throw new Error('Error updating game');
    return res.json();
};

export const deleteGame = async (id) => {
    const res = await fetch(`${API_URL}/games/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error deleting game');
};

export const getRating = async (id) => {
    const res = await fetch(`${API_URL}/games/${id}/rating`);
    if (res.status === 404) return null;
    return res.json();
};

export const upsertRating = async (id, body) => {
    const res = await fetch(`${API_URL}/games/${id}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error saving rating');
    return res.json();
};

export const deleteRating = async (id) => {
    const res = await fetch(`${API_URL}/games/${id}/rating`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error deleting rating');
};