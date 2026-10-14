# Redesenho da página inicial (Iris Downloader)

Data: 2026-10-14 · Aprovado pelo Isaias (mockup `home-v1`, direção A "Aurora" + animação da direção B).
Referência visual: heros do 21st.dev. Mantém a identidade Iris (roxo #4C3CC6/#9A85FF, fundo #13131A, Unbounded + Inter) e os textos atuais.

## Seções (ordem)
1. **Header**: pílula de vidro flutuante e centralizada; menu lateral (Sheet) no celular.
2. **Hero**: fundo com aurora roxa em movimento e grade com máscara. Selo, título com degradê na segunda linha, botões com brilho passando, requisitos. Abaixo, janela do app em perspectiva (rotateX a partir do tablet): contas na lateral, lista de arquivos com barras de progresso animadas e 86 MB/s. Três selos flutuantes (só em telas largas). Entrada em sequência.
3. **Confiança**: público rolando em loop e os 4 números.
4. **O vilão é o ZIP**: navegador travado em 98% com erro × Iris baixando arquivo por arquivo; os 4 problemas riscados com a solução.
5. **Recursos em mosaico**: card grande "Sem ZIP" com a árvore de pastas; cards com borda que acende seguindo o mouse.
6. **Telas**: abas + print real numa moldura com brilho.
7. **Como funciona**: 3 passos ligados por uma linha de luz.
8. **Preços**: mesmos planos e checkout; Vitalício com borda em gradiente girando; garantias embaixo.
9. **Dúvidas**: acordeão em cards; as 3 objeções do bloco "Antes de instalar" entram no topo da lista.
10. **Chamada final** com aurora; **rodapé**.

Saem da página: `ConversionCTA` e `Objections` (conteúdo absorvido por Hero, Dor e Dúvidas). O vídeo do hero dá lugar à janela animada.

## Regras
- Animações só com CSS (keyframes em `globals.css`); a regra de "reduzir movimento" já existente desliga tudo.
- Nada de rolagem horizontal no celular; perspectiva e selos flutuantes só em telas largas.
- Links, âncoras (#features, #screenshots, #how-it-works, #pricing, #faq), checkout (CheckoutModal) e /download continuam iguais.
- Ícones lucide (sem emoji).

## Verificação
`npm run build`, `npm test`, `npm run lint`, conferência no navegador em 1440, 768 e 375 px, e uma prévia na Vercel antes de qualquer publicação em produção.
