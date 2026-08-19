import { describe, expect, it } from "vitest";
import { formatPurchaseValue, parseOrderId, parsePurchaseValue } from "./purchase";

describe("purchase query parsing", () => {
  it("preserva o valor exato com até duas casas decimais", () => {
    expect(parsePurchaseValue("173")).toBe(173);
    expect(parsePurchaseValue("173.45")).toBe(173.45);
    expect(parsePurchaseValue("173,45")).toBe(173.45);
    expect(formatPurchaseValue(173)).toBe("R$ 173,00");
  });

  it("rejeita valores ausentes, negativos ou malformados", () => {
    expect(parsePurchaseValue(undefined)).toBeNull();
    expect(parsePurchaseValue("-1")).toBeNull();
    expect(parsePurchaseValue("173.456")).toBeNull();
    expect(parsePurchaseValue("173 reais")).toBeNull();
  });

  it("aceita apenas IDs de pedido seguros para exibição e tracking", () => {
    expect(parseOrderId("order_ABC-123.4")).toBe("order_ABC-123.4");
    expect(parseOrderId("<script>alert(1)</script>")).toBeNull();
    expect(parseOrderId("pedido com espaços")).toBeNull();
  });
});
