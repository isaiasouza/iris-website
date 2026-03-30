# PRD — Iris Downloader Website V2
**Versão:** 2.0 | **Site:** https://iris-website-eta.vercel.app/
**Stack atual:** Next.js 15, React 19, Tailwind CSS v4, TypeScript, Vercel (static export)
**Última revisão:** Março 2026

---

## Objetivo

Transformar o site atual (landing informativa + download grátis) em um site completo de SaaS com seções de screenshots, pricing, animações, social proof e FAQ expandido. Introduzir dois planos pagos mantendo opção freemium implícita.

---

## Planos de Preço

| Plano | Preço | Período |
|-------|-------|---------|
| **Anual** | R$ 49,90 | /ano — renovação automática |
| **Vitalício** | R$ 110,99 | pagamento único |

> Sem plano gratuito listado no site — o download existe mas não é o foco da conversão.

---

## Estrutura de Páginas

### Página principal (`/`)
Ordem das seções:

```
1. Header (fixo)          — nav + CTA "Começar agora"
2. Hero                   — headline + badge versão + mockup animado + CTAs
3. Social Proof Bar       — logos/números (ex: "2.000+ downloads", "macOS 14+")
4. Features               — grid de features do V2 (atualizado)
5. Screenshots            — galeria/carrossel de screenshots reais do app
6. How It Works           — 3 passos (simplificado)
7. Pricing                — 2 cards: Anual e Vitalício + comparativo de benefícios
8. FAQ                    — 8+ perguntas atualizadas (remover rclone, V1)
9. CTA Final              — "Comece hoje" com botão de compra
10. Footer                — links, copyright, redes sociais
```

---

## Seções — Especificação Detalhada

---

### S-01 · Header (atualizar)

**Mudanças:**
- Trocar "Download Grátis" por **"Começar agora"** → ancora em `#pricing`
- Adicionar link "Preços" no menu desktop e mobile
- Remover âncora `#download` do menu principal

**Links do menu:**
- Recursos → `#features`
- Screenshots → `#screenshots`
- Preços → `#pricing`
- FAQ → `#faq`
- **"Começar agora"** (botão primário) → `#pricing`

---

### S-02 · Hero (atualizar)

**Mudanças:**
- Badge: `v2.0 — Novo motor, 3× mais rápido`
- Headline principal: manter "Baixe do Google Drive sem compactar"
- Subheadline: destacar velocidade e ausência de rclone
- CTAs:
  - Primário: **"Ver planos"** → `#pricing`
  - Secundário: **"Download grátis"** → link do DMG (discreto, menor)
- Mockup: manter animação float, atualizar conteúdo interno para refletir V2 (pausar/retomar, ordenação)
- Requisitos: `macOS 14+ · Apple Silicon + Intel · Sem dependências externas`

**Animações novas:**
- Fade-in escalonado nos elementos (badge → título → subtítulo → CTAs → mockup)
- Timing: 0ms, 150ms, 300ms, 450ms, 600ms

---

### S-03 · Social Proof Bar (novo)

**Layout:** faixa horizontal com separadores `·`

**Números:**
- `2.000+ downloads`
- `macOS 14+ nativo`
- `Google Drive API oficial`
- `Sem coleta de dados`
- `Developer ID assinado`

**Visual:** texto pequeno, cor `#58585F`, borda superior e inferior `white/5`, padding vertical pequeno.

---

### S-04 · Features (atualizar)

**Remover:**
- "Transferências rápidas — 5–200 MB/s" (rclone, não existe no V2)

**Manter e atualizar:**
- Sem compactação ✓
- Upload drag-and-drop ✓
- Múltiplas contas ✓
- Navegador de pastas ✓
- Seguro e privado ✓

**Adicionar (features V2):**
- **Pausar e retomar** — controle total sobre downloads em andamento
- **Mover para lixeira** — delete arquivos do Drive direto no app
- **Copiar link de compartilhamento** — um clique para copiar o link
- **Ordenação** — ordene por nome, tamanho ou data
- **Export inteligente** — Sheets → .xlsx, Slides → .pptx automaticamente

**Layout:** grid 3 colunas → 2 colunas em tablet → 1 em mobile. Total: 8 cards.

**Animação:** cards entram com fade-up ao scroll (Intersection Observer, sem biblioteca externa).

---

### S-05 · Screenshots (novo)

**Objetivo:** mostrar o app real em uso, gerar confiança visual.

**Layout:** carrossel/tabs horizontal com 4–5 screenshots:
1. Tela principal — lista de arquivos do Drive
2. Painel de transferências — download em andamento com progresso
3. Modo grade — visualização em grid dos arquivos
4. Settings — configurações de pasta e simultâneos
5. Multi-conta — sidebar com 2 contas conectadas

**Implementação:**
- Tabs no topo (labels: "Arquivos", "Downloads", "Grade", "Settings", "Contas")
- Transição suave entre tabs (opacity + translate)
- Imagens em `/public/screenshots/` (user vai fornecer os arquivos)
- Placeholder cinza com label enquanto screenshots não chegam
- `rounded-xl border border-white/10 shadow-2xl` no container

**Nota:** Criar placeholders funcionais agora; usuário fornece screenshots reais depois.

---

### S-06 · How It Works (simplificar)

**Mudanças:**
- Remover menção "inclui todas as dependências" (não precisa mais no V2)
- Passo 3: mudar de "Cole o link" para "Navegue e baixe" (V2 tem browser nativo)

**Passos:**
1. **Instale com um clique** — Baixe o DMG, abra e arraste para /Applications
2. **Conecte sua conta Google** — Login via OAuth direto no app, tokens seguros no Keychain
3. **Navegue e baixe** — Browse no Drive, baixe arquivos e pastas sem ZIP

---

### S-07 · Pricing (novo — seção principal de conversão)

**Layout:** dois cards lado a lado, com o Vitalício destacado como "Mais popular".

#### Card Anual
```
Anual
R$ 49,90 /ano

[ Assinar agora ]

✓ Acesso completo ao app
✓ Todas as atualizações do ano
✓ Suporte por email
✓ Múltiplas contas Google
✓ Sem limite de downloads
```

#### Card Vitalício (destacado — badge "Mais popular")
```
Vitalício
R$ 110,99 pagamento único

[ Comprar agora ]

✓ Acesso vitalício ao app
✓ Todas as atualizações para sempre
✓ Suporte prioritário por email
✓ Múltiplas contas Google
✓ Sem limite de downloads
✓ Acesso a versões futuras
```

**Visual:**
- Card Vitalício: borda `iris-500/50`, glow sutil `iris-600/15`, badge `"Mais popular"` no topo
- Card Anual: borda `white/10`, visual discreto
- Botões: gradiente iris para Vitalício, outline para Anual
- Abaixo dos cards: `🔒 Pagamento seguro · Garantia de 7 dias · Cancele quando quiser`

**Botões de compra:** `href="#"` por enquanto (usuário define gateway depois — Stripe, Hotmart, etc.)

**Animação:** cards entram com fade-up escalonado ao scroll.

---

### S-08 · FAQ (atualizar)

**Remover perguntas desatualizadas:**
- "Preciso instalar algo além do app?" (mencionava rclone)
- "Funciona em Macs Intel?" (agora funciona — universal binary)

**Manter:**
- O que é o Iris Downloader?
- Meus dados estão seguros?
- O macOS bloqueou a abertura. O que faço?

**Adicionar:**
- **O plano Vitalício inclui atualizações futuras?** — Sim, todas as atualizações da linha V2.
- **Qual a diferença entre Anual e Vitalício?** — Anual renova todo ano. Vitalício é pagamento único sem renovações.
- **Posso usar em mais de um Mac?** — Sim, a licença é por conta, não por dispositivo.
- **Funciona em Macs Intel?** — Sim. V2 é universal binary (Apple Silicon + Intel).
- **O que acontece se eu não renovar o plano Anual?** — O app continua instalado mas não recebe atualizações.
- **Como funciona a garantia?** — 7 dias. Se não ficar satisfeito, reembolso integral sem perguntas.

**Total:** 9 perguntas. Accordion com animação de height.

---

### S-09 · CTA Final (atualizar)

**Headline:** "Comece a baixar do Drive do jeito certo"
**Subtítulo:** "Escolha o plano que faz mais sentido para você."
**Botões:**
- Primário: "Ver planos" → `#pricing`
- Secundário: "Download grátis" → link DMG

**Remover:** seção de download standalone atual (Download.tsx vai virar esta CTA)

---

### S-10 · Footer (atualizar)

**Adicionar:**
- Links: Recursos · Screenshots · Preços · FAQ
- Link "Termos de uso" e "Política de privacidade" (páginas vazias por ora)
- GitHub: `https://github.com/isaiasouza/IrisDownloader`

**Manter:** copyright dinâmico, branding Iris Media.

---

## Animações

**Estratégia:** CSS puro + Intersection Observer. Sem Framer Motion (evita overhead no bundle estático).

### Animações globais (globals.css)
```css
/* Já existem: float, pulse-glow */

/* Adicionar: */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.animate-fade-up   { animation: fade-up 0.5s ease both; }
.animate-fade-in   { animation: fade-in 0.4s ease both; }
.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-200 { animation-delay: 200ms; }
.animate-delay-300 { animation-delay: 300ms; }
.animate-delay-400 { animation-delay: 400ms; }
```

### Hook useFadeIn (novo arquivo)
```
/src/app/hooks/useFadeIn.ts
— Intersection Observer que adiciona classe 'in-view' quando elemento entra no viewport
— Usado em Features, Screenshots, Pricing, FAQ
```

---

## Arquivos a Criar / Modificar

| Arquivo | Ação |
|---------|------|
| `components/Header.tsx` | Modificar — links + CTA |
| `components/Hero.tsx` | Modificar — badge, CTAs, requisitos |
| `components/SocialProof.tsx` | Criar |
| `components/Features.tsx` | Modificar — 8 cards V2 |
| `components/Screenshots.tsx` | Criar |
| `components/HowItWorks.tsx` | Modificar — textos |
| `components/Pricing.tsx` | Criar |
| `components/FAQ.tsx` | Modificar — 9 perguntas |
| `components/CTAFinal.tsx` | Criar (substitui Download.tsx) |
| `components/Footer.tsx` | Modificar — links |
| `app/page.tsx` | Modificar — nova ordem de seções |
| `app/globals.css` | Modificar — novas animações |
| `hooks/useFadeIn.ts` | Criar |
| `public/screenshots/` | Criar pasta + placeholders |

---

## SEO e Metadata

**Atualizar em `layout.tsx`:**
- Title: `"Iris Downloader — Google Drive para Mac, do jeito certo"`
- Description: `"Baixe e gerencie seus arquivos do Google Drive no Mac com velocidade total. Pausar, retomar, múltiplas contas. Planos a partir de R$ 49,90/ano."`
- Keywords: adicionar "comprar", "plano", "vitalício", "licença"

---

## Fora de Escopo

- Integração de pagamento (Stripe/Hotmart) — usuário define gateway depois
- Páginas internas (termos, privacidade) — criar vazias com "Em breve"
- Blog / changelog
- Dark/light mode toggle
- Internacionalização (EN)

---

## Critérios de Conclusão

- [ ] Todas as seções implementadas e visíveis no site
- [ ] Pricing com 2 cards corretos (R$ 49,90 / R$ 110,99)
- [ ] Download button aponta para v2.0.0 DMG
- [ ] FAQ sem menção a rclone ou V1
- [ ] Animações fade-up funcionando ao scroll em Features, Pricing, FAQ
- [ ] Screenshots com placeholders (troca por imagens reais depois)
- [ ] Mobile responsivo em todas as seções
- [ ] Deploy no Vercel sem erros de build
