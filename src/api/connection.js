import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sleepy-mesa-12704-4fff05c4450b.herokuapp.com/api'
});

export default api;
