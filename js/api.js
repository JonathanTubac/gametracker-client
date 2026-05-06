const API_URL = 'http://localhost:3000/api/v1';

const CLOUDINARY_CLOUD_NAME = 'duzscodzj';
const CLOUDINARY_UPLOAD_PRESET = 'GameTracker';

export const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: fd,
    });
    if (!res.ok) throw new Error('Error al subir la imagen');
    const json = await res.json();
    return json.secure_url;
};

export const getGames = async ({ page, limit, q, sort, order, status }) => {
    const params = new URLSearchParams({ page, limit, q, sort, order });
    if (status) params.set('status', status);
    const res = await fetch(`${API_URL}/games?${params}`);
    if (!res.ok) throw new Error('Error fetching games');
    return res.json();
};

export const getGameById = async (id_game) => {
    const res = await fetch(`${API_URL}/games/${id_game}`)
    if (!res.ok) throw new Error('Error fetching game')
    const json = await res.json();
    return json.data ?? json;
}

export const createGame = async (body) => {
    const res = await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error creating game');
    const json = await res.json();
    return json.data ?? json;
};

export const updateGame = async (id, body) => {
    const res = await fetch(`${API_URL}/games/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error updating game');
    const json = await res.json();
    return json.data ?? json;
};

export const deleteGame = async (id) => {
    const res = await fetch(`${API_URL}/games/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error deleting game');
};

export const getRating = async (id) => {
    try {
        const res = await fetch(`${API_URL}/ratings/${id}`);
        if (!res.ok) return null;
        const json = await res.json();
        return json.data ?? json;
    } catch {
        return null;
    }
};

export const upsertRating = async (id, body) => {
    const res = await fetch(`${API_URL}/ratings/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error saving rating');
    const json = await res.json();
    return json.data ?? json;
};

export const deleteRating = async (id) => {
    const res = await fetch(`${API_URL}/ratings/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error deleting rating');
};