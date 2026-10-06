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


## 🛠️2. Estrutura Inicial do Projeto (React Native / Expo)
> *Configuração do ambiente e arquitetura base do projeto em React Native com Expo.*

### 2.1 Organização de pastas
```text
maje-drive/
├── assets/             # Imagens, fontes e logos
├── src/
│   ├── components/     # Componentes reutilizáveis (botões, cards, inputs)
│   ├── screens/        # Telas principais do aplicativo (Dashboard, Abastecimento, etc.)
│   ├── routes/         # Configuração de navegação (React Navigation)
│   ├── services/       # Integrações e lógica de dados (API / AsyncStorage)
│   └── styles/         # Paleta de cores global e estilos compartilhados
├── App.js              # Ponto de entrada da aplicação
├── app.json            # Configurações do Expo
└── package.json        # Dependências do projeto
```
### 2.2 Instruções de Configuração e Execução
*Para rodar o ambiente de desenvolvimento localmente na sua máquina, siga o passo a passo abaixo:*

**2.2.1** Pré-requisitos:
```bash 
- Certifique-se de ter o Node.js instalado (versão LTS recomendada).
- Tenha o aplicativo Expo Go instalado no seu smartphone (disponível na App Store e Google Play) ou um emulador Android/iOS configurado.
```

**2.2.2** Clonar repositório:
```bash 
git clone https://github.com/seu-usuario/maje-drive.git
cd maje-drive
```

**2.2.3** Instalar dependências:
```bash 
npm install
# ou
yarn install
```

**2.2.4** Iniciar o servidor de desenvolvimento (Expo):
```bash 
npx expo start
```

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


<p align="center">
  © 2026 Maje Drive. Todos os direitos reservados.
</p>
