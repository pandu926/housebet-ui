/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EDITION?: string;
  readonly VITE_LOCK_EDITION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
