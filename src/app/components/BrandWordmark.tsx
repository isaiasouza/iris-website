type Props = {
  className?: string;
  /** Cor de "DOWNLOADER"; "IRIS" herda a cor do texto. */
  subClassName?: string;
};

/**
 * Escrita da marca numa linha, em texto (nítida em qualquer tamanho), na
 * Unbounded carregada pelo layout. Para a versão empilhada em vetor, use
 * /iris-wordmark-white.svg.
 */
export default function BrandWordmark({ className = "", subClassName = "text-brand-text-2" }: Props) {
  return (
    <span className={`inline-flex items-baseline gap-2 font-display leading-none ${className}`}>
      <span className="font-bold tracking-[0.02em]">IRIS</span>
      <span className={`text-[0.62em] font-normal tracking-[0.18em] ${subClassName}`}>DOWNLOADER</span>
    </span>
  );
}
