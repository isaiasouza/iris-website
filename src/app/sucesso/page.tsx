import { redirect } from "next/navigation";

// Endereço antigo de pós-compra: o checkout agora volta para /obrigado.
export default function SucessoPage() {
  redirect("/obrigado");
}
