import api from "../api.js"
import allRoutes from "../Routes/RouterFrontend.routes.js"

const getNewAccessToken = async() => {
    try{
        const { data } = await api.post(allRoutes.auth.checkRefreshToken);
        return data;
    }
    catch(error){
        console.log(error);
    }
}

export default getNewAccessToken;   