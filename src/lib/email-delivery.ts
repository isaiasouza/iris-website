/**
 * Regras do status de entrega (email_events.delivery_status), a partir dos
 * eventos do webhook do Resend. Sem I/O, para ser testável.
 */

export type DeliveryStatus =
  | "delivered"
  | "delivery_delayed"
  | "bounced"
  | "complained"
  | "failed"
  | "suppressed";

/** Estados que significam que o cliente não recebeu (ou reclamou) e pedem ação. */
export const PROBLEM_STATUSES: ReadonlySet<DeliveryStatus> = new Set([
  "bounced",
  "complained",
  "failed",
  "suppressed",
]);

// Os eventos podem chegar fora de ordem ou repetidos. Um estado só substitui
// outro de peso menor: "atrasado" nunca apaga "entregue", e "entregue" nunca
// apaga uma devolução. Reclamação de spam vem depois da entrega e vence tudo.
const WEIGHT: Record<DeliveryStatus, number> = {
  delivery_delayed: 1,
  delivered: 2,
  bounced: 3,
  failed: 3,
  suppressed: 3,
  complained: 4,
};

export function shouldReplace(current: DeliveryStatus | null | undefined, next: DeliveryStatus): boolean {
  if (!current) return true;
  return WEIGHT[next] > WEIGHT[current];
}

export type DeliveryUpdate = { status: DeliveryStatus; detail: string | null };

type EmailEventData = {
  email_id?: string;
  bounce?: { message?: string; type?: string; subType?: string };
  failed?: { reason?: string };
  suppressed?: { message?: string; type?: string };
};

/**
 * Converte um evento do Resend em atualização de status; null para eventos
 * que não importam. Aceita qualquer evento (os de contato e domínio também
 * chegam pelo webhook) e só lê os campos dos eventos de e-mail.
 */
export function deliveryUpdateFor(event: { type: string; data?: unknown }): DeliveryUpdate | null {
  const data = (event.data ?? {}) as EmailEventData;
  switch (event.type) {
    case "email.delivered":
      return { status: "delivered", detail: null };
    case "email.delivery_delayed":
      return { status: "delivery_delayed", detail: "O servidor do destinatário ainda não aceitou; o Resend vai tentar de novo." };
    case "email.bounced": {
      const b = data.bounce ?? {};
      const kind = [b.type, b.subType].filter(Boolean).join("/");
      return { status: "bounced", detail: [kind, b.message].filter(Boolean).join(": ") || null };
    }
    case "email.complained":
      return { status: "complained", detail: "O destinatário marcou o e-mail como spam." };
    case "email.failed":
      return { status: "failed", detail: data.failed?.reason ?? null };
    case "email.suppressed":
      return { status: "suppressed", detail: data.suppressed?.message ?? "Endereço na lista de supressão do Resend." };
    default:
      return null;
  }
}

export const DELIVERY_LABELS: Record<DeliveryStatus, string> = {
  delivered: "Entregue",
  delivery_delayed: "Atrasado",
  bounced: "Devolvido",
  complained: "Marcado como spam",
  failed: "Falhou",
  suppressed: "Suprimido",
};
