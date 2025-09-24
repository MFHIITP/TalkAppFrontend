import axios from "axios";
import Cookies from "js-cookie";
import envConfig from "./config.js";
import getNewAccessToken from "./utils/NewAccessToken.js";

const api = axios.create({
    baseURL: envConfig.BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000,
    withCredentials: true,    
})

api.interceptors.request.use((config) => {
    const accessToken = Cookies.get("accessToken");
    if(accessToken != null){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    Promise.reject(error);
})

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async(error) => {
        const originalRequest = error.config;

        if(!originalRequest._retry){
            originalRequest._retry = false
        }
        if(error.response.status == 401 && !originalRequest._retry){
            const data = await getNewAccessToken();
            return api(originalRequest)
        }
        else if(error.response.status == 419){
            localStorage.clear();
            location.reload();
        }
        return Promise.reject(error);
    }
)

export default api;