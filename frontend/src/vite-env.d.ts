/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_BACKEND_SERVICE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
