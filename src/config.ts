interface ENVConfigInterface {
    API_KEY: string,
    API_URL: string,
}

const envConfig: ENVConfigInterface = {
    API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    API_URL: import.meta.env.VITE_GEMINI_API_URL,
}

export default envConfig;