import api from "../api.js";
import allRoutes from "../Routes/RouterFrontend.routes.js";

const isAuthenticated = async() => {
    const { data } = await api.get(allRoutes.auth.checkLogin);
    return data.login;
}

export default isAuthenticated;