import { redirect } from "next/navigation";

// Página antiga de pós-compra (Asaas/AbacatePay). A Cakto manda para /obrigado.
export default function SucessoPage() {
  redirect("/obrigado");
}
