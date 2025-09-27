/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE?: 'https://judgejuryexecutioner.onrender.com';
	// add other VITE_ env vars here as needed
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
