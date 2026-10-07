# Maje Drive: Gestão Veicular e Controle de Quilometragem 🚗💨
> *O seu assistente definitivo para o controle de manutenções, consumo e custos automotivos em uma garagem compartilhada.*

## 👥Developers
| Turma | Nome | RM |
| :--- | :--- | :--- |
| 3ESPH | Gustavo Viega Martins | RM555885 |
| 3ESPH | Gustavo Yuji Osugi | RM555034 |
| 3ESPH | Kaio Drago Lima Souza | RM556095 |
| 3ESPH | Vitor Rivas Cardoso | RM556404 |

## 📄1. Product Requirement Document (PRD)
> *Documento de requisitos, escopo funcional e especificações técnicas para o desenvolvimento do Maje Drive.*

### 1.1 Problema
A gestão do ciclo de vida automotivo exige monitoramento rigoroso de variáveis críticas, como quilometragem rodada, manutenções preventivas, tributos (IPVA) e seguros. Ferramentas tradicionais — como registros em papel ou softwares genéricos de controle financeiro — falham por não contemplarem o odômetro ou o histórico detalhado de componentes mecânicos. Essa lacuna operacional expõe motoristas a falhas mecânicas inesperadas e custos corretivos elevados que poderiam ser mitigados por meio de previsibilidade.

### 1.2 Público-Alvo
- **Condutores particulares (carros e motos):** Proprietários que buscam uma manutenção preventiva descomplicada e orientada por dados de uso real.
- **Gestores de frotas domésticas:** Famílias ou núcleos que compartilham o gerenciamento de múltiplos veículos em uma única interface centralizada.
- **Vendedores e entusiastas automotivos:** Proprietários e lojistas que necessitam de rastreabilidade e histórico comprovado para atestar a conservação do bem e maximizar seu valor de revenda.

### 1.3 Proposta de Valor
O **Maje Drive** centraliza a gestão automotiva com foco em telemetria por quilometragem e saúde mecânica preditiva. A plataforma emite alertas automatizados baseados no uso real do veículo (ex: "Troca de pastilhas de freio estimada para os próximos 1.500 km"), evitando surpresas e gerando relatórios de manutenção consolidados em PDF. Isso comprova o histórico de cuidados do automóvel, aumentando a segurança operacional e agregando valor comercial direto no momento da negociação.


## 🛠️2. Estrutura do Projeto (React + Vite + Capacitor)
> *O Maje Drive é um app React (TypeScript + Tailwind CSS v4) empacotado como app Android nativo com o [Capacitor](https://capacitorjs.com).*

### 2.1 Organização de pastas
```text
maje-drive/
├── src/
│   ├── components/     # Componentes reutilizáveis (BottomNav)
│   ├── screens/        # Telas: Dashboard, Garage, AddVehicle, History, AddMaintenance, Alerts
│   ├── data.ts         # Dados iniciais de exemplo (mock)
│   ├── predictive.ts   # Motor de alertas preditivos e saúde do veículo
│   ├── report.ts       # Geração/compartilhamento do dossiê em PDF
│   ├── cloud.ts        # Integração com Supabase (CRUD + mapeamento)
│   ├── types.ts        # Tipos compartilhados
│   ├── utils.ts        # Funções utilitárias
│   ├── App.tsx         # Estado global, persistência local e navegação entre telas
│   └── main.tsx        # Ponto de entrada
├── android/            # Projeto Android nativo (gerado pelo Capacitor)
├── supabase/schema.sql # Tabelas e políticas do banco
├── capacitor.config.ts # Configuração do Capacitor (appId, nome, pasta web)
├── .github/workflows/  # CI que compila o APK de debug
└── vite.config.ts
```
Os dados (veículos e manutenções) ficam no `localStorage` do aparelho e, se o Supabase estiver configurado, também na nuvem. Os alertas **não são armazenados**: são calculados a cada abertura pelo motor preditivo (`src/predictive.ts`).

### 2.2 Executar no navegador
**Pré-requisitos:** Node.js 22 e [pnpm](https://pnpm.io) 10.
```bash
git clone https://github.com/MAJE-Dev/maje-drive.git
cd maje-drive
pnpm install
pnpm dev
```

### 2.3 Gerar o APK (debug)
**Opção A, pelo GitHub (sem instalar nada):** vá em *Actions → Build Android APK → Run workflow*. Ao final, baixe o artefato `maje-drive-debug-apk` (contém o `app-debug.apk`).

**Opção B, localmente.** Pré-requisitos: JDK 21 e Android SDK (plataforma 36) com `ANDROID_HOME` configurado.
```bash
pnpm install
pnpm android:debug
```
O APK será gerado em `android/app/build/outputs/apk/debug/app-debug.apk`. Para instalar no celular com depuração USB ativa: `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`.

Comandos úteis: `pnpm android:sync` (reconstrói a web e sincroniza com o Android) e `npx cap open android` (abre no Android Studio).

## ®️3. Brand Identity & Guidelines (Marca)
> *Diretrizes visuais e paleta de cores oficial do Maje Drive.*

### 3.1 App → `Maje Drive`
### 3.2 Logotipo 
<img width="1408" height="768" alt="1788260575526" src="https://github.com/user-attachments/assets/2450c0a7-a935-4f0d-91a0-8d835d7a5fa4" />

### 3.3 Paleta de Cores 
#### 3.3.1 Logotipo
| Cor | Código Hex | Descrição |
| :---: | :---: | :--- |
| ![#2A1D38](https://img.shields.io/badge/-2A1D38?style=flat-square&color=2A1D38) | `#2A1D38` | Roxo escuro usado nas sombras e base da tipografia. |
| ![#7B3363](https://img.shields.io/badge/-7B3363?style=flat-square&color=7B3363) | `#7B3363` | Magenta metálico intermediário do escudo e engrenagem. |
| ![#C25387](https://img.shields.io/badge/-C25387?style=flat-square&color=C25387) | `#C25387` | Magenta claro vibrante para as áreas de luz e topo. |
| ![#232733](https://img.shields.io/badge/-232733?style=flat-square&color=232733) | `#232733` | Cinza chumbo dos textos de apoio. |


#### 3.3.2 Visual do App
| Cor | Código Hex | Descrição |
| :---: | :---: | :--- |
| ![#0F0F11](https://img.shields.io/badge/-0F0F11?style=flat-square&color=0F0F11) | `#0F0F11` | Fundo principal da aplicação (Dark Mode profundo). |
| ![#18181B](https://img.shields.io/badge/-18181B?style=flat-square&color=18181B) | `#18181B` | Superfície dos cards de veículos e blocos de conteúdo. |
| ![#1C1C1E](https://img.shields.io/badge/-1C1C1E?style=flat-square&color=1C1C1E) | `#1C1C1E` | Fundo de inputs, modais e elementos flutuantes. |
| ![#252529](https://img.shields.io/badge/-252529?style=flat-square&color=252529) | `#252529` | Bordas e linhas divisórias sutis entre seções. |
| ![#71717A](https://img.shields.io/badge/-71717A?style=flat-square&color=71717A) | `#71717A` | Textos secundários, legendas e ícones inativos. |
| ![#A1A1AA](https://img.shields.io/badge/-A1A1AA?style=flat-square&color=A1A1AA) | `#A1A1AA` | Rótulos de formulários e textos de apoio em geral. |
| ![#FFFFFF](https://img.shields.io/badge/-FFFFFF?style=flat-square&color=FFFFFF) | `#FFFFFF` | Títulos, valores principais e textos de alto contraste. |
| ![#00F0FF](https://img.shields.io/badge/-00F0FF?style=flat-square&color=00F0FF) | `#00F0FF` | Cor primária de destaque (botões de ação e links ativos). |
| ![#FF9F0A](https://img.shields.io/badge/-FF9F0A?style=flat-square&color=FF9F0A) | `#FF9F0A` | Alertas de atenção (vencimento próximo de IPVA/revisão). |
| ![#FF453A](https://img.shields.io/badge/-FF453A?style=flat-square&color=FF453A) | `#FF453A` | Alertas críticos (manutenção vencida ou erros). |


## 💼4. Product Pitch & Business Model (Negócio)
> *Apresentação comercial e estratégia de monetização da aplicação.*

### 4.1 Modelo de Negócio
| Plano | Preço | O que inclui |
| :--- | :--- | :--- |
| **Starter** | 🟢 Grátis | 1 veículo, registros básicos de manutenção e alertas simples de IPVA/seguro. |
| **PRO** | 🔵 R$ 14,90 / mês | Veículos ilimitados, alertas preditivos de desgaste, dossiê em PDF para revenda e relatórios avançados. |

`Diferencial Competitivo` → O Maje Drive elimina o trabalho manual da gestão automotiva por meio de automação inteligente, oferecendo manutenção preditiva baseada no uso real e gerando um dossiê transparente que valoriza o veículo na revenda.

## 📱5. Figma UI/UX Prototypes & Wireframes (Interface)
> *Design de interfaces e fluxos de navegação de baixa e alta fidelidade desenvolvidos no Figma.*

🔗 Link do projeto: [Protótipo no Figma](https://www.figma.com/design/7h8BMPkmo1qPX1BVRd17LE/maje-drive?node-id=0-1&p=f&t=g8xElepg7V6scGHj-0
)  
### 5.1 Telas Conceituais
#### 5.1.1 Tela Inicial (Dashboard)
<p align="center">
  <img width="213" height="513" alt="imagem (5)" src="https://github.com/user-attachments/assets/a25ea019-e6d0-4b99-8a1b-31a7cdefb0d0" />
</p>

#### 5.1.2 Gestão de Veículos
<p align="center">
  <img width="208" height="514" alt="imagem" src="https://github.com/user-attachments/assets/51dbfc69-6bfa-4c25-ac89-5a8736f5ff7c" />
</p>

#### 5.1.3 Registrar Novo Veículo
<p align="center">
  <img width="207" height="459" alt="imagem (1)" src="https://github.com/user-attachments/assets/8fed37f0-fef8-45ff-8965-ed39a7cda08a" />
</p>

#### 5.1.4 Adicionar Serviço de Manutenção
<p align="center">
  <img width="210" height="448" alt="imagem (3)" src="https://github.com/user-attachments/assets/737780bd-aefe-4bd2-94f4-e5a0b5910666" />
</p>

#### 5.1.5 Histórico de Manutenções
<p align="center">
  <img width="196" height="454" alt="imagem (2)" src="https://github.com/user-attachments/assets/e76201a2-f5e0-4e41-b116-b9687b425f4f" />
</p>

#### 5.1.6 Configuração de Alertas e Status
<p align="center">
  <img width="216" height="468" alt="imagem (4)" src="https://github.com/user-attachments/assets/3f5caa54-60af-4e1a-8c5c-8da67ac6654a" />
</p>


## ⚙️6. Funcionalidades, Arquitetura e Decisões Técnicas

### 6.1 Alertas preditivos
Calculados em `src/predictive.ts` a partir do histórico de manutenções:
1. **Uso médio (km/dia):** inclina a reta entre o 1º registro do veículo e a quilometragem atual (hoje). Com menos de 30 dias de histórico usa 40 km/dia.
2. **Próximo vencimento** de cada categoria (só o registro mais recente conta): `nextMileage` informado ou, na falta, o intervalo padrão (óleo 10.000 km, freios 30.000 km, etc.). `nextDate` também é respeitado.
3. **Previsão de data** = hoje + (km restantes ÷ km/dia).
4. **Severidade:** 🔴 vencido (km ou data passou) · 🟠 atenção (≤ 3.000 km ou ≤ 30 dias) · 🟢 em dia.
5. **Saúde do veículo** = 100 − 25 por item vencido − 8 por item em atenção.

Ao registrar uma manutenção com km maior que o atual, a quilometragem do veículo é atualizada.

### 6.2 Relatório em PDF
Na tela **Histórico**, o botão **PDF** gera o dossiê do veículo (dados, alertas preditivos, histórico e custo total) com `jsPDF` + `jspdf-autotable`. No navegador o arquivo é baixado; no Android abre a folha de compartilhamento (WhatsApp, e-mail, Drive…) via plugins `@capacitor/filesystem` e `@capacitor/share`.

### 6.3 Banco de dados (Supabase)
1. Crie um projeto em [supabase.com](https://supabase.com) e execute `supabase/schema.sql` no *SQL Editor*.
2. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (Project Settings → API).
3. Para o APK gerado pelo GitHub Actions, cadastre os mesmos dois valores em *Settings → Secrets and variables → Actions*.

Comportamento *offline-first*: o app sempre grava no `localStorage` e envia as alterações ao Supabase. Na abertura, se a nuvem já tem dados, ela vale; se está vazia, recebe os dados locais. Um ponto no canto da tela indica o estado (🟠 sincronizando · 🟢 conectado · 🔴 sem conexão). Sem as variáveis, o app roda 100% offline.

> ⚠️ **Limitação conhecida:** o protótipo não tem login. As políticas RLS liberam a chave anônima, então todos os aparelhos que usam o mesmo projeto veem os mesmos dados. Próximo passo: Supabase Auth + coluna `user_id` + políticas por usuário.

### 6.4 Fluxo de navegação
```text
Dashboard ──┬─ Alertas ──── Registrar agora ──► Adicionar manutenção ──► Histórico
            ├─ Garagem ──── Adicionar veículo ──► Dashboard
            ├─ Histórico ── Registrar / PDF
            └─ Botão (+) ─► Adicionar manutenção ──► Histórico
```
Barra inferior: Dashboard · Garagem · (+) · Histórico · Alertas.

### 6.5 Decisões técnicas
| Decisão | Motivo |
| :--- | :--- |
| React 19 + Vite + Tailwind v4 | Base do projeto gerada no Figma Make; build rápido. |
| Capacitor (em vez de Expo/React Native) | Reaproveita 100% do app web já pronto e gera APK com Gradle/Android Studio. |
| Supabase | PostgreSQL gerenciado, SDK simples e RLS; não exige servidor próprio. |
| Offline-first com `localStorage` | App funciona sem internet e sem configuração. |
| Alertas derivados, não salvos | Sempre coerentes com o histórico e a quilometragem atual; menos dados para sincronizar. |
| jsPDF no cliente (carregado sob demanda) | PDF sem backend e sem pesar a abertura do app. |
| Vitest | Mesmo toolchain do Vite; testa a lógica pura (previsão, PDF, mapeamento). |

## 🧪7. Testes
**Automatizados:** `pnpm test` (Vitest) cobre previsão de km/dia, severidades, saúde, geração do PDF e mapeamento Supabase. `pnpm typecheck` verifica os tipos. Ambos rodam no CI antes de gerar o APK.

**Roteiro manual** (navegador ou APK). Marque ✅/❌:

| # | Passo | Resultado esperado |
| :-: | :--- | :--- |
| 1 | Abrir o app | Dashboard com veículo selecionado, saúde e alertas |
| 2 | Garagem → trocar de veículo | Dashboard e histórico passam a mostrar o veículo escolhido |
| 3 | Garagem → Adicionar veículo (preencher e salvar) | Veículo aparece na garagem e fica selecionado |
| 4 | Adicionar veículo sem preencher campos obrigatórios | Mensagem de erro, nada é salvo |
| 5 | (+) → registrar manutenção (ex.: óleo, km maior que o atual) | Vai ao Histórico com o novo item; km do veículo atualiza |
| 6 | Alertas após o passo 5 | Alerta de óleo sai de "vencido" e a previsão de data é recalculada |
| 7 | Alertas → filtros Vencidos / Em breve / Em dia | Lista filtra corretamente |
| 8 | Alertas → Dispensar | Alerta some; volta apenas quando houver novo registro da categoria |
| 9 | Histórico → filtrar por categoria | Só itens da categoria; custo total confere |
| 10 | Histórico → PDF | Navegador baixa o arquivo; Android abre o compartilhamento. PDF traz dados, alertas e histórico |
| 11 | Garagem → excluir veículo | Veículo e seus registros somem; outro veículo é selecionado |
| 12 | Fechar e reabrir o app | Dados continuam salvos |
| 13 | Com Supabase: adicionar veículo e abrir o *Table Editor* | Linha aparece em `vehicles`; ponto de status verde |
| 14 | Com Supabase: modo avião e adicionar manutenção | Ponto vermelho, dado salvo localmente, app continua funcionando |
| 15 | No Android, observar barra de status e navegação | Conteúdo respeita as áreas seguras |

<p align="center">
  © 2026 Maje Drive. Todos os direitos reservados.
</p>
