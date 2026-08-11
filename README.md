# Iris Downloader Website

## Ambiente local

Copie o template e preencha os valores localmente:

```bash
cp .env.example .env.local
```

As variáveis da seção CORE de `.env.example` são obrigatórias. Elas são
validadas por `src/instrumentation.ts` quando o servidor Next.js inicializa.
Como o Next não executa a instrumentação durante `next build`, `next.config.ts`
aciona a mesma rotina ao carregar a configuração do build.

As variáveis Asaas e Stripe são opcionais para o funcionamento geral do site.
Quando um desses provedores não está configurado, somente suas respectivas
rotas retornam HTTP 503.

## Build

O build exige que todas as variáveis CORE estejam configuradas:

```bash
npm install
npm run build
```

Segredos devem ficar em `.env.local` ou nas variáveis de ambiente da Vercel.
Não versione valores reais.

## Testes

```bash
npm test
```
