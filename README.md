# NuvemAgent Embedded App

Base React + TypeScript + Vite para um App Integrado na Nuvemshop.

## Setup

- `npm install`
- Revise o arquivo `.env` se precisar ajustar `VITE_API_URL` ou `VITE_CLIENT_ID`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`

## Estrutura

- Conexao com Nexo e ciclo de vida: `src/App.tsx`
- Axios com Session Token: `src/lib/api.ts`
- Instancia do Nexo: `src/lib/nexo.ts`
