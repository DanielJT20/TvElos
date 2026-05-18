# 🎯 Como Usar o Dashboard

## 📌 Localização

O dashboard foi integrado no arquivo **`painel.html`** do painel de admin do TV ELOS.

## 🔑 Acesso

O dashboard é **visível apenas para usuários com role `editor` ou `admin`** ao fazer login no sistema.

### Passos para visualizar:
1. Acesse o site TV ELOS
2. Faça login como **Editor** ou **Admin**
3. Clique em **"Painel"** ou acesse `/painel.html`
4. O dashboard será exibido no topo da página

## 📊 O que é exibido

### 1. **Métricas Principais (4 cards)**
   - Total de Pautas
   - Aprovadas
   - Usuários
   - Vídeos

### 2. **Gráficos**
   - Evolução mensal de pautas (últimos 5 meses)
   - Situação atual com barras de progresso

### 3. **Atividade Recente**
   - Feed com 5 últimas ações do sistema

## 🔄 Dados em Tempo Real

Os dados são carregados automaticamente ao acessar o painel, fazendo requisições para:
```
GET /api/admin/stats
```

## 📱 Responsividade

O dashboard é totalmente responsivo:
- **Desktop (>1024px)**: Layout completo com 2 colunas
- **Tablet (640-1024px)**: Layout ajustado com 1 coluna
- **Mobile (<640px)**: Otimizado para telas pequenas

## 🎨 Personalização

### Cores
As cores do dashboard podem ser personalizadas editando as classes CSS em `painel.html`:

```css
.metric-card-dashboard.yellow { border-left-color: #cfff04; }
.metric-card-dashboard.green { border-left-color: #4ade80; }
.metric-card-dashboard.cyan { border-left-color: #00ffff; }
.metric-card-dashboard.purple { border-left-color: #a78bfa; }
.metric-card-dashboard.orange { border-left-color: #fb923c; }
```

### Conteúdo
A atividade recente pode ser substituída por dados reais editando a função `atualizarDashboard()`:

```javascript
const atividades = [
    { tipo: "pauta", msg: "...", tempo: "...", cor: "#..." },
    // adicione mais atividades aqui
];
```

## 🧪 Preview Standalone

Para visualizar o dashboard sem necessidade de login, abra:
```
dashboard-preview.html
```

Este arquivo contém um exemplo visual completo do dashboard.

## ⚙️ Configuração da API

Certifique-se de que o endpoint `/api/admin/stats` retorna os seguintes campos:

```json
{
  "pendentes": 8,
  "em_analise": 3,
  "aprovadas": 14,
  "rejeitadas": 4,
  "totalUsuarios": 37,
  "totalMensagens": 21,
  "totalVideos": 12
}
```

Se o endpoint não existir, crie-o em seu backend retornando os dados acima.

## 🚀 Próximas Etapas

### Para melhorias futuras:

1. **Gráficos Interativos**
   - Integrar Chart.js ou D3.js
   - Adicionar hover com detalhes

2. **Atualização em Tempo Real**
   - WebSockets para atualização automática
   - Auto-refresh a cada 5 minutos

3. **Filtros Avançados**
   - Filtrar por período (semana, mês, ano)
   - Exportar dados em PDF/PNG

4. **Dados Históricos**
   - Gráfico real com histórico de 12 meses
   - Comparação com período anterior

5. **Notificações**
   - Alertas para eventos importantes
   - Toast notifications para novas ações

## 📞 Suporte

Caso tenha dúvidas sobre o dashboard:

1. Verifique a documentação em `DASHBOARD_README.md`
2. Consulte a implementação em `painel.html`
3. Veja o preview em `dashboard-preview.html`

---

**Desenvolvido com ❤️ para TV ELOS**
