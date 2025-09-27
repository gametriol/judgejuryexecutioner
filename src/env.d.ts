/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE?: 'http://localhost:4000';
	// add other VITE_ env vars here as needed
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
