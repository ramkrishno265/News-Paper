import axios from 'axios';

// Vite-er environment mode check kore automatic URL select korbe
const API = axios.create({
  baseURL: import.meta.env.MODE === 'production'
    ? 'https://news-paper-0wbn.onrender.com' 
    : 'http://localhost:5000'                 
});

export default API;