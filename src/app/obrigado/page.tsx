import type { Metadata } from "next";
import { PaginaObrigado } from "./PaginaObrigado";
import type { UpsellOffer } from "./UpsellCard";
import { parseOrderId, parsePurchaseValue } from "@/lib/purchase";

export const metadata: Metadata = {
  title: "Compra confirmada — Iris Downloader",
  description: "Confira os próximos passos para instalar e ativar o Iris Downloader.",
  robots: { index: false, follow: false },
};

interface ObrigadoPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readUpsellOffer(): UpsellOffer | null {
  const actionPath = process.env.UPSELL_ACTION_PATH?.trim();
  const title = process.env.UPSELL_TITLE?.trim();
  const description = process.env.UPSELL_DESCRIPTION?.trim();
  const price = process.env.UPSELL_PRICE?.trim();

  if (!actionPath?.startsWith("/api/") || !title || !description || !price) return null;

  return {
    actionPath,
    title,
    description,
    price,
    actionLabel: process.env.UPSELL_ACTION_LABEL?.trim() || "Adicionar ao pedido",
  };
}

export default async function ObrigadoPage({ searchParams }: ObrigadoPageProps) {
  const params = await searchParams;
  const orderId = parseOrderId(params.order_id);
  const value = parsePurchaseValue(params.valor);

  return <PaginaObrigado orderId={orderId} value={value} upsell={readUpsellOffer()} />;
}
