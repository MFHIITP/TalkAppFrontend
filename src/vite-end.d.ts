interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string,
    readonly VITE_GEMINI_API_URL: string,
    readonly VITE_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}