/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALGOD_TOKEN: string;
  readonly VITE_ALGOD_SERVER: string;
  readonly VITE_ALGOD_PORT: number;
  readonly VITE_WALLET_MNEMONIC: string;
  readonly VITE_EXPLORER_BASEURL: string;
  readonly VITE_CONTRACT_A_ID: number;
  readonly VITE_CONTRACT_B_ID: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
