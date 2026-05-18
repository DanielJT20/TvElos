# 🎨 Estrutura Visual do Dashboard

## Layout Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    TV ELOS / Painel de Métricas        ● Ao vivo          │
│                    Visão geral · Maio 2026                                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌─────────┤
│  │ TOTAL DE PAUTAS  │ │  APROVADAS       │ │  USUÁRIOS        │ │VÍDEOS   │
│  │ 29               │ │  14              │ │  37              │ │ 12      │
│  │ ↑ 3 este mês     │ │  Taxa: 48%       │ │  ↑ 6 novos       │ │↑ 2 mês │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ └─────────┤
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────┐ ┌───────────────────────────────┐ │
│  │ EVOLUÇÃO MENSAL DE PAUTAS          │ │ SITUAÇÃO ATUAL DAS PAUTAS     │ │
│  │                                    │ │                               │ │
│  │ ■ Aprovadas ■ Pendentes ■ Rejeit. │ │ Aprovadas    ▮▮▮▮▮▮▮▮▮ 14    │ │
│  │                                    │ │ Pendentes    ▮▮▮▮▮ 8          │ │
│  │  ┌─┐   ┌─┐   ┌─┐   ┌─┐   ┌─┐      │ │ Em Análise   ▮▮▮ 3            │ │
│  │  ├─┤   ├─┤   ├─┤   ├─┤   ├─┤      │ │ Rejeitadas   ▮▮▮▮ 4           │ │
│  │  ├─┤   ├─┤   ├─┤   ├─┤   ├─┤◄─┐  │ │ Mensagens    ▮▮▮▮▮▮▮▮ 21      │ │
│  │  │ │ │ │ │ │ │ │ │ │ │ │ │ │ │  │ │                               │ │
│  │ Jan Fev Mar Abr Mai    Destaque  │ │                               │ │
│  │                                    │ │                               │ │
│  └────────────────────────────────────┘ └───────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ATIVIDADE RECENTE                                                         │
│                                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ 🟡 Ana Lima  │ │ 🔵 Novo      │ │ 🟣 Carlos    │ │ 🟢 Pauta     │    │
│  │ enviou uma   │ │ vídeo        │ │ criou conta  │ │ aprovada     │    │
│  │ nova pauta   │ │ publicado    │ │              │ │              │    │
│  │ 2 min atrás  │ │ 18 min atrás │ │ 1h atrás     │ │ 2h atrás     │    │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ 🟠 Nova mensagem de contato recebida · 3h atrás                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Versão Mobile (< 640px)

```
┌─────────────────────────────┐
│ TV ELOS / Painel de Métricas│
│ ● Ao vivo                   │
├─────────────────────────────┤
│ ┌──────────────┐ ┌─────────┤
│ │TOTAL PAUTAS │ │APROVADAS│
│ │29            │ │14       │
│ │↑ 3 mês       │ │48%      │
│ └──────────────┘ └─────────┤
│ ┌──────────────┐ ┌─────────┤
│ │USUÁRIOS      │ │VÍDEOS   │
│ │37            │ │12       │
│ │↑ 6 novos     │ │↑ 2 mês  │
│ └──────────────┘ └─────────┤
├─────────────────────────────┤
│ EVOLUÇÃO MENSAL             │
│  │ │ │ │ │                  │
│ Jan Fev Mar Abr Mai         │
├─────────────────────────────┤
│ SITUAÇÃO ATUAL              │
│ Aprovadas  ▮▮▮▮▮▮ 14        │
│ Pendentes  ▮▮▮ 8            │
│ Em Análise ▮ 3              │
│ Rejeitadas ▮▮ 4             │
├─────────────────────────────┤
│ ATIVIDADE                   │
│ ┌──────────────────────────┐│
│ │🟡 Ana Lima enviou pauta ││
│ │2 min atrás              ││
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │🔵 Novo vídeo publicado  ││
│ │18 min atrás             ││
│ └──────────────────────────┘│
│ ... (mais atividades)       │
└─────────────────────────────┘
```

## Estrutura HTML

```html
<div id="dashboard-section">
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <div class="dashboard-title">
          <span>TV ELOS</span>
          <span>/ Painel de Métricas</span>
        </div>
        <div class="dashboard-date">Visão geral · Maio 2026</div>
      </div>
      <div class="dashboard-live">● Ao vivo</div>
    </div>
    
    <!-- Metric Cards -->
    <div class="metric-cards-grid">
      <div class="metric-card-dashboard yellow">
        <div class="metric-card-label">Total de Pautas</div>
        <div class="metric-card-value" id="dash-total-pautas">29</div>
        <div class="metric-card-delta" id="dash-total-delta">↑ 3 este mês</div>
      </div>
      <!-- ... mais 3 cards ... -->
    </div>
    
    <!-- Charts Row -->
    <div class="dashboard-row">
      <!-- Bar Chart -->
      <div class="dashboard-box">
        <div class="dashboard-box-title">Evolução Mensal de Pautas</div>
        <div class="bar-chart" id="dashboard-bar-chart">
          <!-- Renderizado por JavaScript -->
        </div>
      </div>
      
      <!-- Progress Bars -->
      <div class="dashboard-box">
        <div class="dashboard-box-title">Situação Atual das Pautas</div>
        <div id="dashboard-progress-bars">
          <!-- Renderizado por JavaScript -->
        </div>
      </div>
    </div>
    
    <!-- Activity Feed -->
    <div class="dashboard-box activity-section">
      <div class="dashboard-box-title">Atividade Recente</div>
      <div class="activity-grid" id="dashboard-activity">
        <!-- Renderizado por JavaScript -->
      </div>
    </div>
  </div>
</div>
```

## Paleta de Cores

| Cor | Hex | RGB | Uso |
|-----|-----|-----|-----|
| Amarelo | #cfff04 | 207, 255, 4 | Principal, Total de Pautas |
| Verde | #4ade80 | 74, 222, 128 | Aprovadas, Sucesso |
| Ciano | #00ffff | 0, 255, 255 | Usuários, Informação |
| Roxo | #a78bfa | 167, 139, 250 | Vídeos, Destaque |
| Vermelho | #f87171 | 248, 113, 113 | Rejeitadas, Atenção |
| Laranja | #fb923c | 251, 146, 60 | Mensagens, Secundário |
| Background | #000 | 0, 0, 0 | Fundo principal |
| Card | #111 | 17, 17, 17 | Fundo dos cards |

## Tamanhos de Font

```
Título Principal (TV ELOS):    20px, weight 900
Titulo Seção (Painel):          14px
Subtítulo (Visão geral):        13px
Valor Métrica:                  36px, weight 900
Label Métrica:                  11px, uppercase
Label Progresso:                13px
Tempo Atividade:                11px
Descrição Atividade:            12px
```

## Espaciamento

```
Padding Cards:                  18px 22px
Padding Boxes:                  24px
Margin Cards:                   14px (gap)
Margin Boxes:                   16px (gap)
Margin Bottom Seção:            28px (header), 24px (cards)
```

## Responsividade de Grid

```
Desktop (> 1024px)
├─ Metric Cards:    repeat(4, 1fr) ou auto-fit
├─ Dashboard Row:   1fr 1fr (2 colunas)
└─ Activity Grid:   repeat(5, 1fr)

Tablet (640 - 1024px)
├─ Metric Cards:    repeat(2, 1fr)
├─ Dashboard Row:   1fr (1 coluna)
└─ Activity Grid:   repeat(3, 1fr)

Mobile (< 640px)
├─ Metric Cards:    repeat(2, 1fr)
├─ Dashboard Row:   1fr (1 coluna)
└─ Activity Grid:   1fr (1 coluna)
```

## Animações

```css
Transição:        all 0.2s
Gráfico:          transition: height 0.3s
Progress Bar:     transition: width 0.4s
Hover Button:     transition: all 0.2s
```

## Pseudo-elementos

```
Último mês (Mai):   outline: 1px solid rgba(207,255,4,0.4)
Label Ativo:        color: #cfff04, font-weight: 700
Ícone Atividade:    border: 1.5px solid {cor}
```
