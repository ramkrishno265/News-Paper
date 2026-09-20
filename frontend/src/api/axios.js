import axios from 'axios';

// Vite-er environment mode check kore automatic URL select korbe
const API = axios.create({
  baseURL: import.meta.env.MODE === 'production'
    ? 'https://your-backend-app.onrender.com' // Ekhane apnar Render-er live backend URL bosaben
    : 'http://localhost:5000'                  // Local development-er jonno
});

export default API;