/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEEPSEEK_API_KEY: string;
  readonly VITE_BMOB_APPLICATION_ID: string;
  readonly VITE_BMOB_REST_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
