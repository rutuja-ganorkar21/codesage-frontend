import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://codesage-backend-2a2v.onrender.com',
    withCredentials: true,
    headers:{
        'Content-Type': 'application/json'
    }
});

export default axiosClient;