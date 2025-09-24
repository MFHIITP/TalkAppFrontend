const allRoutes = {
    auth: {
        login: '/auth/login',
        signup: '/auth/signup',
        verifyOTP: '/auth/handleOTP',
        resendOTP: '/auth/verifyOTP',
        logout: '/auth/logout',
        checkLogin: '/auth/checkLogin',
        checkRefreshToken: '/auth/authRefreshToken'
    },
    history: {
        getHistory: '/history/getHistory',
        addHistory: '/history/addHistory', 
        deleteHistory: '/history/deleteHistory',
        clearHistory: '/history/clearHistory'
    },
    chats: {
        getChats: '/chats/getChats'
    }
}

export default allRoutes;