interface Props {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, totalItems, perPage, onPageChange }: Props) {
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-4">
      <span className="text-xs text-[#58585F]">
        {totalItems === 0 ? "0 resultados" : `${from}–${to} de ${totalItems}`}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#9F9FA3] transition-colors hover:border-white/20 hover:text-white disabled:opacity-30"
        >
          ← Anterior
        </button>
        <span className="text-xs text-[#58585F]">
          {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#9F9FA3] transition-colors hover:border-white/20 hover:text-white disabled:opacity-30"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}
