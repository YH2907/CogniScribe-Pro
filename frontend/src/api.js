import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

// Automatically attach token
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        // backend supports both "Bearer <token>" and plain token
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
