const CONFIG = {
  API_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/v1'
    : 'https://gametracker-api.vercel.app/api/v1',
};

export default CONFIG;