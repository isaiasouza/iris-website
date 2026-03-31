# PRD — Sistema de Pagamentos, Licenças e Gestão de Assinaturas
**Produto:** Iris Downloader
**Versão:** 1.0
**Data:** Março 2026
**Stack:** Next.js 15 (site + API Routes) · Swift/SwiftUI (app macOS) · Asaas (pagamentos) · Supabase (banco + auth)

---

## Visão Geral

Transformar o Iris Downloader de app gratuito em produto pago com:
- Checkout via **Asaas** (cartão, PIX, boleto)
- **Sistema de licença** por chave única (UUID v4)
- **Limite de dispositivos** por plano (Anual: 1 Mac · Vitalício: 3 Macs)
- **Portal do cliente** para gerenciar assinatura, dispositivos e licença
- **Validação de licença no app** (online + offline com TTL)
- **Segurança** contra compartilhamento, crack e bypass

---

## Planos

| Plano | Preço | Dispositivos | Renovação |
|-------|-------|-------------|-----------|
| **Anual** | R$ 49,90/ano | 1 Mac | Automática via Asaas |
| **Vitalício** | R$ 110,99 | 3 Macs | Única vez |

---

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────┐
│                    FLUXO DE COMPRA                   │
│                                                      │
│  Site → Asaas Checkout → Webhook → API Route →       │
│  Supabase (cria licença) → Email com license_key     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 FLUXO DE ATIVAÇÃO                    │
│                                                      │
│  App (macOS) → input license_key → POST /api/       │
│  activate → valida no Supabase → salva hardware_id  │
│  no Keychain → app liberado                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              VALIDAÇÃO PERIÓDICA (app)               │
│                                                      │
│  App startup → POST /api/validate → 200 OK →        │
│  salva token local com TTL 72h → offline ok         │
│  (se offline e TTL válido, app funciona)             │
└─────────────────────────────────────────────────────┘
```

---

## Banco de Dados (Supabase)

### Tabela: `licenses`
```sql
CREATE TABLE licenses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key   TEXT UNIQUE NOT NULL,          -- ex: IRIS-XXXX-XXXX-XXXX-XXXX
  plan          TEXT NOT NULL,                 -- 'annual' | 'lifetime'
  status        TEXT NOT NULL DEFAULT 'active',-- 'active' | 'suspended' | 'cancelled' | 'expired'
  email         TEXT NOT NULL,
  asaas_customer_id   TEXT,
  asaas_subscription_id TEXT,                  -- apenas plano anual
  asaas_payment_id    TEXT,                    -- pagamento único (vitalício)
  max_devices   INT NOT NULL DEFAULT 1,        -- 1 (anual) | 3 (vitalício)
  expires_at    TIMESTAMPTZ,                   -- null = vitalício
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

### Tabela: `devices`
```sql
CREATE TABLE devices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id    UUID REFERENCES licenses(id) ON DELETE CASCADE,
  hardware_id   TEXT NOT NULL,                 -- SHA-256(serial+uuid+model)
  device_name   TEXT,                          -- "MacBook Pro de Isaias"
  os_version    TEXT,                          -- "macOS 15.2"
  activated_at  TIMESTAMPTZ DEFAULT now(),
  last_seen_at  TIMESTAMPTZ DEFAULT now(),
  is_active     BOOLEAN DEFAULT true,
  UNIQUE(license_id, hardware_id)
);
```

### Tabela: `license_events`
```sql
CREATE TABLE license_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id  UUID REFERENCES licenses(id),
  event       TEXT NOT NULL,   -- 'activated' | 'validated' | 'deactivated' | 'suspended' | 'renewed'
  hardware_id TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabela: `validation_tokens`
```sql
-- Cache de validações bem-sucedidas (reduz chamadas à API)
CREATE TABLE validation_tokens (
  hardware_id TEXT NOT NULL,
  license_id  UUID REFERENCES licenses(id),
  token       TEXT NOT NULL,                   -- JWT assinado pelo servidor
  expires_at  TIMESTAMPTZ NOT NULL,            -- TTL: 72h
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (hardware_id, license_id)
);
```

---

## API Routes (Next.js — `/api/`)

### POST `/api/checkout`
Cria cobrança no Asaas e retorna URL de pagamento.

**Request:**
```json
{
  "plan": "annual" | "lifetime",
  "name": "Isaias Souza",
  "email": "isaias@gmail.com",
  "cpf": "000.000.000-00"   // opcional, melhora aprovação PIX
}
```

**Lógica:**
1. Criar ou recuperar cliente no Asaas (`POST /customers`)
2. Se `annual`: criar assinatura recorrente (`POST /subscriptions`) com `billingType: CREDIT_CARD | BOLETO | PIX`, `cycle: MONTHLY` (ou `YEARLY`)
3. Se `lifetime`: criar cobrança única (`POST /payments`)
4. Retornar `{ checkoutUrl, paymentId }`

**Response:**
```json
{ "checkoutUrl": "https://asaas.com/c/abc123", "paymentId": "pay_xxx" }
```

---

### POST `/api/webhook/asaas`
Recebe eventos do Asaas. **Validar assinatura HMAC antes de processar.**

**Eventos tratados:**

| Evento Asaas | Ação |
|---|---|
| `PAYMENT_CONFIRMED` | Criar licença, enviar email com `license_key` |
| `PAYMENT_RECEIVED` | idem (PIX/boleto) |
| `SUBSCRIPTION_RENEWED` | Atualizar `expires_at`, reativar se suspenso |
| `PAYMENT_OVERDUE` | Suspender licença após 7 dias |
| `PAYMENT_DELETED` | Cancelar licença |
| `SUBSCRIPTION_DELETED` | Cancelar licença |

**Lógica de criação de licença (PAYMENT_CONFIRMED):**
```
1. Verificar se já existe licença para esse paymentId (idempotência)
2. Gerar license_key: "IRIS-" + 4 blocos de 4 chars UUID uppercase
3. Inserir em licenses{}
4. Enviar email via Resend: "Sua licença Iris Downloader"
5. Registrar event: 'created'
```

---

### POST `/api/license/activate`
Ativa a licença em um dispositivo. Chamada pelo app macOS.

**Request:**
```json
{
  "license_key": "IRIS-ABCD-EFGH-IJKL-MNOP",
  "hardware_id": "sha256-hash",
  "device_name": "MacBook Pro de Isaias",
  "os_version": "macOS 15.2"
}
```

**Lógica:**
```
1. Buscar licença pelo license_key
2. Verificar status = 'active'
3. Verificar expires_at (plano anual)
4. Contar devices ativos: SELECT count WHERE license_id = X AND is_active = true
5. Se hardware_id já cadastrado → reativar (is_active = true) → OK
6. Se count >= max_devices → retornar 403 DEVICE_LIMIT_REACHED
7. Inserir device
8. Gerar validation_token JWT (72h TTL)
9. Registrar event 'activated'
```

**Response (sucesso):**
```json
{
  "ok": true,
  "plan": "lifetime",
  "validation_token": "eyJ...",
  "token_expires_at": "2026-04-02T10:00:00Z",
  "devices_used": 2,
  "devices_max": 3
}
```

**Erros:**
```json
{ "error": "DEVICE_LIMIT_REACHED", "devices_used": 3, "devices_max": 3 }
{ "error": "LICENSE_EXPIRED" }
{ "error": "LICENSE_SUSPENDED" }
{ "error": "LICENSE_NOT_FOUND" }
```

---

### POST `/api/license/validate`
Validação periódica. Chamada no startup do app (a cada 72h).

**Request:**
```json
{
  "license_key": "IRIS-ABCD-EFGH-IJKL-MNOP",
  "hardware_id": "sha256-hash"
}
```

**Lógica:**
```
1. Buscar licença + device
2. Verificar status e expiração
3. Atualizar last_seen_at no device
4. Gerar novo validation_token (renova TTL)
5. Registrar event 'validated'
```

**Response:**
```json
{
  "ok": true,
  "plan": "lifetime",
  "validation_token": "eyJ...",
  "token_expires_at": "2026-04-02T10:00:00Z"
}
```

---

### POST `/api/license/deactivate`
Remove a licença de um dispositivo específico.

**Request:**
```json
{
  "license_key": "IRIS-ABCD-EFGH-IJKL-MNOP",
  "hardware_id": "sha256-hash"    // omitir para desativar o device atual
}
```

**Lógica:**
```
1. Autenticar: verificar que a licença pertence ao caller
   (via session do portal, ou hardware_id do device atual)
2. Marcar device is_active = false
3. Limpar validation_tokens desse device
4. Registrar event 'deactivated'
```

---

### GET `/api/license/status`
Retorna dados da licença para o portal do cliente.
**Auth:** session Supabase (email magic link).

**Response:**
```json
{
  "license_key": "IRIS-ABCD-EFGH-IJKL-MNOP",
  "plan": "lifetime",
  "status": "active",
  "expires_at": null,
  "devices": [
    {
      "id": "uuid",
      "device_name": "MacBook Pro de Isaias",
      "os_version": "macOS 15.2",
      "activated_at": "2026-03-01T...",
      "last_seen_at": "2026-03-29T...",
      "is_active": true
    }
  ],
  "devices_used": 2,
  "devices_max": 3
}
```

---

## Portal do Cliente (Next.js — `/minha-licenca`)

### Autenticação
- **Magic link por email** (Supabase Auth)
- Usuário digita email → recebe link → clica → logado
- Sem senha — email é o identificador da licença

### Telas

#### `/minha-licenca` — Dashboard
```
┌──────────────────────────────────────────┐
│  Iris Downloader · Minha Licença         │
│                                          │
│  Plano: Vitalício ✓                      │
│  Status: Ativo                           │
│  Licença: IRIS-ABCD-EFGH-IJKL-MNOP [📋] │
│                                          │
│  Dispositivos (2/3 usados)               │
│  ┌─────────────────────────────────────┐ │
│  │ 💻 MacBook Pro de Isaias            │ │
│  │    macOS 15.2 · Ativo há 28 dias    │ │
│  │    Último acesso: há 2h             │ │
│  │                         [Remover]   │ │
│  ├─────────────────────────────────────┤ │
│  │ 💻 MacBook Air (trabalho)           │ │
│  │    macOS 14.6 · Ativo há 5 dias     │ │
│  │    Último acesso: há 1 dia          │ │
│  │                         [Remover]   │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  [Gerenciar assinatura →]                │
└──────────────────────────────────────────┘
```

**Ação "Remover dispositivo":**
- Confirmar: "Tem certeza? O app nesse Mac precisará ser reativado."
- Chama `POST /api/license/deactivate`
- Remove da lista imediatamente

#### `/minha-licenca/assinatura` — Gerenciar Plano Anual
Apenas para usuários com plano `annual`:
```
┌──────────────────────────────────────────┐
│  Assinatura Anual                        │
│                                          │
│  Próxima cobrança: 01/04/2027            │
│  Valor: R$ 49,90                         │
│  Método: Cartão **** 4242                │
│                                          │
│  [Atualizar forma de pagamento →]        │  ← link Asaas
│  [Cancelar assinatura]                   │
└──────────────────────────────────────────┘
```

- "Atualizar forma de pagamento" → link para portal Asaas
- "Cancelar" → chama Asaas API `DELETE /subscriptions/{id}`, atualiza status

---

## App macOS — Integração de Licença (Swift)

### LicenseManager.swift

```swift
@MainActor
final class LicenseManager: ObservableObject {

    static let shared = LicenseManager()

    @Published var state: LicenseState = .checking

    // Armazenamento seguro no Keychain
    private let keychain = KeychainHelper(service: "com.iris.downloader")

    enum LicenseState {
        case checking
        case valid(plan: String, expiresAt: Date?)
        case invalid(reason: LicenseError)
        case notActivated
    }

    enum LicenseError: String {
        case deviceLimitReached = "DEVICE_LIMIT_REACHED"
        case licenseExpired     = "LICENSE_EXPIRED"
        case licenseSuspended   = "LICENSE_SUSPENDED"
        case licenseNotFound    = "LICENSE_NOT_FOUND"
        case networkUnavailable
        case tokenExpired
    }

    // MARK: — Hardware ID
    // SHA-256 de: IOPlatformSerialNumber + IOPlatformUUID + model identifier
    // Estável mesmo após reinstalação do macOS
    func hardwareID() -> String { ... }

    // MARK: — Ativação
    func activate(licenseKey: String) async -> Result<Void, LicenseError> { ... }

    // MARK: — Validação (startup)
    // 1. Tenta validação online
    // 2. Se offline: verifica validation_token local (Keychain) + TTL
    // 3. Se token expirado e offline: estado 'invalid' com aviso
    func validateOnStartup() async { ... }

    // MARK: — Desativar (sair deste Mac)
    func deactivateThisDevice() async -> Result<Void, Error> { ... }
}
```

### Hardware ID — Derivação

```swift
func hardwareID() -> String {
    // Coleta 3 identificadores estáveis do hardware
    let serial   = IOServiceGetMatchingService(...) // IOPlatformSerialNumber
    let uuid     = IOServiceGetMatchingService(...) // IOPlatformUUID
    let model    = ProcessInfo.processInfo.environment["MODEL_IDENTIFIER"]

    // Concatena e faz SHA-256
    let raw = "\(serial)|\(uuid)|\(model)"
    let hash = SHA256.hash(data: Data(raw.utf8))
    return hash.compactMap { String(format: "%02x", $0) }.joined()
}
```

### Keychain — O que guardar

| Chave | Valor | Quando |
|---|---|---|
| `iris.license_key` | `IRIS-XXXX-XXXX` | Na ativação |
| `iris.validation_token` | JWT | A cada validação |
| `iris.token_expires_at` | ISO8601 Date | A cada validação |
| `iris.plan` | `"annual"` / `"lifetime"` | Na ativação |

### Fluxo de Startup do App

```
App abre
  │
  ├─ Keychain tem license_key?
  │    NÃO → mostrar tela de ativação
  │    SIM → continuar
  │
  ├─ Online?
  │    SIM → POST /api/license/validate
  │           200 → salvar novo token → app liberado
  │           403/404 → mostrar erro específico
  │    NÃO → verificar validation_token local
  │           Token válido (TTL ok)? → app liberado (modo offline)
  │           Token expirado? → mostrar aviso "Conecte à internet para validar"
  │                             → bloquear após 72h sem internet
```

### Tela de Ativação (SwiftUI)

```
┌──────────────────────────────────────┐
│    🔑 Ativar Iris Downloader         │
│                                      │
│  Digite sua chave de licença:        │
│  ┌────────────────────────────────┐  │
│  │ IRIS-XXXX-XXXX-XXXX-XXXX      │  │
│  └────────────────────────────────┘  │
│                                      │
│  [Ativar]                            │
│                                      │
│  Não tem uma licença?                │
│  Ver planos →                        │
└──────────────────────────────────────┘
```

### Tela de Erro — Limite de Dispositivos

```
┌──────────────────────────────────────┐
│    ⚠️ Limite de dispositivos         │
│                                      │
│  Sua licença já está ativa em        │
│  3 Macs (limite do plano Vitalício). │
│                                      │
│  Para usar neste Mac, acesse o       │
│  portal e remova um dispositivo.     │
│                                      │
│  [Gerenciar dispositivos →]          │
│  (abre iris-website.vercel.app/      │
│   minha-licenca)                     │
└──────────────────────────────────────┘
```

---

## Segurança

### Anti-tampering (app macOS)

| Medida | Implementação |
|---|---|
| **Código assinado** | Developer ID Application + Hardened Runtime |
| **Notarização** | `notarytool` antes de distribuir |
| **Keychain ACL** | `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` — token não exportável |
| **Anti-debug** | `PT_DENY_ATTACH` no startup (previne lldb attach) |
| **Integrity check** | Verificar próprio code signature em runtime |
| **Ofuscação de strings** | License key e API URL não em texto claro no binário |
| **HTTPS only** | Certificate pinning para o domínio da API |

### Anti-tampering (API)

| Medida | Implementação |
|---|---|
| **Rate limiting** | 5 req/min por IP em `/activate`, `/validate` |
| **HMAC webhook** | Verificar `asaas-webhook-token` header antes de processar |
| **JWT assinado** | `validation_token` assinado com `JWT_SECRET` (RS256) |
| **Hardware binding** | Token válido apenas para o `hardware_id` que o gerou |
| **Idempotência** | Webhook duplicado não cria licença duplicada |
| **RLS Supabase** | Nenhuma tabela acessível publicamente — só via service_role na API |
| **Logs de audit** | Toda ativação/validação registrada em `license_events` |

### Proteção contra Compartilhamento de Licença

- Limite de dispositivos por plano (DB)
- Hardware ID derivado de múltiplos identificadores estáveis
- `last_seen_at` auditado — atividade suspeita (muitos IPs em curto tempo) → suspensão automática
- Alertas internos: se mesmo `license_key` ativado em > N dispositivos/hora → flag para revisão manual

---

## Email Transacional (Resend)

### Templates necessários

| Trigger | Assunto | Conteúdo |
|---|---|---|
| Compra confirmada | "Sua licença Iris Downloader" | `license_key` em destaque, link portal, instruções de ativação |
| Renovação anual | "Assinatura renovada" | Confirmação, próxima cobrança |
| Pagamento falhou | "Problema no pagamento" | Link para atualizar cartão (Asaas), prazo de 7 dias |
| Suspensão | "Licença suspensa" | Motivo, como regularizar |
| Dispositivo removido | "Dispositivo removido" | Confirmação de segurança |

---

## Variáveis de Ambiente

```env
# Asaas
ASAAS_API_KEY=          # $aas_xxx (produção) ou $aas_xxx (sandbox)
ASAAS_WEBHOOK_TOKEN=    # token configurado no painel Asaas
ASAAS_ENV=              # 'production' | 'sandbox'

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # usado apenas no backend

# JWT
JWT_SECRET=             # chave RS256 para assinar validation_tokens

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_SITE_URL=   # https://iris-website-eta.vercel.app
```

---

## Ordem de Implementação (Sprints)

### Sprint 1 — Backend Core
- [ ] Setup Supabase: criar tabelas `licenses`, `devices`, `license_events`, `validation_tokens`
- [ ] `POST /api/checkout` — integração Asaas (criar cliente + cobrança/assinatura)
- [ ] `POST /api/webhook/asaas` — criar licença ao confirmar pagamento
- [ ] Setup Resend — template "sua licença"
- [ ] Testar fluxo completo com sandbox Asaas

### Sprint 2 — API de Licença
- [ ] `POST /api/license/activate` — ativação com limite de devices
- [ ] `POST /api/license/validate` — validação + renovação de token
- [ ] `POST /api/license/deactivate` — remover device
- [ ] `GET /api/license/status` — dados para portal
- [ ] Testes: limite de devices, licença expirada, licença suspensa

### Sprint 3 — App macOS
- [ ] `LicenseManager.swift` — Keychain, hardware ID, activate/validate
- [ ] Tela de ativação (SwiftUI)
- [ ] Validação no startup com fallback offline (TTL 72h)
- [ ] Tela de erro com link para portal
- [ ] Tela "Minha Licença" dentro do app (Settings)
- [ ] Anti-debug + certificate pinning

### Sprint 4 — Portal do Cliente
- [ ] `/minha-licenca` — auth magic link (Supabase)
- [ ] Dashboard: licença, status, devices
- [ ] Remover dispositivo
- [ ] `/minha-licenca/assinatura` — gerenciar plano anual
- [ ] Webhook: suspensão por inadimplência

### Sprint 5 — Segurança e Polimento
- [ ] Rate limiting nas rotas de licença
- [ ] Alertas de uso suspeito
- [ ] Notarização do app com licença
- [ ] Testes de carga na API de validação
- [ ] Monitoramento (Sentry ou similar)

---

## Decisões de Design

### Por que Asaas?
- Gateway brasileiro com PIX nativo
- Suporte a assinatura recorrente (plano anual)
- API bem documentada, webhook confiável
- Sem necessidade de conta Stripe (simplifica operação)

### Por que magic link e não senha?
- Usuário não precisa criar conta — email já veio da compra
- Menos fricção, menos suporte ("esqueci minha senha")
- Seguro: link com TTL curto (15 min)

### Por que TTL de 72h no token offline?
- Usuários viajam, ficam sem internet
- 72h é razoável sem ser permissivo demais
- Após 72h sem internet, app bloqueia — aceitável

### Por que hardware ID baseado em 3 fatores?
- Serial Number pode mudar (troca de placa)
- IOPlatformUUID muda ao reinstalar macOS
- Combinação dos 3 é mais estável e difícil de spoofer

### Limite de dispositivos por plano
- **Anual (1 dispositivo):** incentiva upgrade para vitalício
- **Vitalício (3 dispositivos):** Mac pessoal + trabalho + Mac mini = caso real
- Usuário pode remover e reativar em outro Mac via portal sem contato com suporte

---

## Fora de Escopo (V1)

- [ ] App iOS / iPad
- [ ] Revendedores / licenças em volume
- [ ] Cupons de desconto
- [ ] Trial gratuito com timer
- [ ] Suporte a múltiplos idiomas no portal
- [ ] Painel administrativo interno (usar Supabase Studio por enquanto)
