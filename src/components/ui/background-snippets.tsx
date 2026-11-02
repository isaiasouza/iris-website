/**
 * Fundos decorativos de página inteira.
 *
 * Os dois são puramente visuais: sem props, sem estado, sem ícones, sem imagens.
 * Renderize UMA vez, como primeiro filho do container posicionado que deve recebê-lo.
 *
 * Os snippets originais exportavam ambos com o nome `Component`, o que colide ao
 * importar os dois no mesmo arquivo. Renomeados pelo que fazem.
 */

/**
 * Grade clara com brilho lilás no canto superior direito.
 * Feito para tema CLARO — o `bg-white` cobre o que estiver atrás.
 * Este site roda em `dark`, então isso aqui vai clarear a seção inteira.
 */
export const GridGlowBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]" />
    </div>
  );
};

/**
 * Fundo escuro com um halo roxo saindo do topo. Combina com o tema do site.
 *
 * Cuidado com o empilhamento: o original usa `h-screen w-screen` com `z-[-2]`,
 * que o tira do fluxo e o joga atrás de qualquer ancestral com fundo opaco —
 * é o motivo mais comum de ele "não aparecer". Aqui está como `inset-0` + `-z-10`,
 * preenchendo o pai posicionado em vez da viewport inteira.
 */
export const SpotlightBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
  );
};
