import { describe, expect, it } from "vitest";
import { deliveryUpdateFor, shouldReplace } from "./email-delivery";

describe("deliveryUpdateFor", () => {
  it("guarda o tipo e a mensagem da devolução", () => {
    expect(
      deliveryUpdateFor({
        type: "email.bounced",
        data: { email_id: "e1", bounce: { type: "Permanent", subType: "General", message: "Conta não existe" } },
      }),
    ).toEqual({ status: "bounced", detail: "Permanent/General: Conta não existe" });
  });

  it("ignora eventos que não mudam a entrega", () => {
    expect(deliveryUpdateFor({ type: "email.opened" })).toBeNull();
    expect(deliveryUpdateFor({ type: "email.sent" })).toBeNull();
  });
});

describe("shouldReplace", () => {
  it("atraso não apaga entrega, e entrega não apaga devolução", () => {
    expect(shouldReplace("delivered", "delivery_delayed")).toBe(false);
    expect(shouldReplace("bounced", "delivered")).toBe(false);
  });

  it("entrega substitui atraso, e spam vence a entrega", () => {
    expect(shouldReplace("delivery_delayed", "delivered")).toBe(true);
    expect(shouldReplace("delivered", "complained")).toBe(true);
    expect(shouldReplace(null, "delivery_delayed")).toBe(true);
  });
});
