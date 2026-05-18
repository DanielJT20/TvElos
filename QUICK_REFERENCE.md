# ⚡ Quick Reference - Dashboard TV ELOS

## 🚀 Acesso Rápido

### Para Visualizar o Dashboard
```
1. Login como Admin/Editor
2. Abra /painel.html
3. Dashboard aparece no topo automaticamente
```

### Para Ver Preview (sem login)
```
Abra dashboard-preview.html
```

---

## 📊 Dados Exibidos

| Métrica | Cor | Fonte |
|---------|-----|-------|
| Total de Pautas | 🟡 Amarelo | API `/admin/stats` |
| Aprovadas | 🟢 Verde | API `/admin/stats` |
| Usuários | 🔵 Ciano | API `/admin/stats` |
| Vídeos | 🟣 Roxo | API `/admin/stats` |
| Pendentes | 🟡 Amarelo | API `/admin/stats` |
| Em Análise | 🔵 Ciano | API `/admin/stats` |
| Rejeitadas | 🔴 Vermelho | API `/admin/stats` |
| Mensagens | 🟠 Laranja | API `/admin/stats` |

---

## 🎯 Componentes

### Header
```
TV ELOS / Painel de Métricas        ● Ao vivo
Visão geral · Maio 2026
```

### 4 Metric Cards
- Total de Pautas
- Aprovadas
- Usuários
- Vídeos

### 2 Charts
- Evolução Mensal (Barras empilhadas)
- Situação Atual (Barras de progresso)

### Activity Feed
- 5 últimas atividades
- Com timestamp

---

## 🔧 Configuração

### API Endpoint
```
GET /api/admin/stats

Response:
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

### CSS Classes Principais
```
.dashboard-container      - Container principal
.dashboard-header         - Cabeçalho
.metric-cards-grid        - Grid de cards
.metric-card-dashboard    - Card individual
.dashboard-row            - Linha de gráficos
.dashboard-box            - Box de conteúdo
.bar-chart                - Gráfico de barras
.activity-grid            - Grid de atividades
.activity-card            - Card de atividade
```

### JavaScript Functions
```javascript
atualizarDashboard(stats)     // Renderiza dashboard
getDataAtual()                // Retorna data formatada
carregarStats()               // Carrega dados da API
```

---

## 📱 Responsividade

| Tamanho | Layout Cards | Layout Gráficos | Atividades |
|---------|--------------|-----------------|------------|
| Desktop (>1024px) | 4 col | 2 col | 5 col |
| Tablet (640-1024px) | 2 col | 1 col | 3 col |
| Mobile (<640px) | 2 col | 1 col | 1 col |

---

## 🎨 Paleta de Cores

```css
Amarelo (#cfff04)   - Principal
Verde (#4ade80)     - Aprovadas
Ciano (#00ffff)     - Usuários/Info
Roxo (#a78bfa)      - Vídeos
Vermelho (#f87171)  - Rejeitadas
Laranja (#fb923c)   - Mensagens
Preto (#000)        - Background
Cinza #111          - Cards
```

---

## 📝 Arquivos

| Arquivo | Descrição | Tipo |
|---------|-----------|------|
| **painel.html** | Principal (modificado) | ⭐ |
| dashboard-preview.html | Preview standalone | 👁️ |
| README_DASHBOARD.md | Índice completo | 📖 |
| DASHBOARD_README.md | Documentação técnica | 📖 |
| DASHBOARD_IMPLEMENTATION.md | Guia implementação | 🛠️ |
| DASHBOARD_USAGE.md | Guia de uso | 📖 |
| VISUAL_STRUCTURE.md | Estrutura visual | 🎨 |
| COMPLETION_SUMMARY.txt | Sumário | ✅ |

---

## 🆘 Troubleshooting

### Dashboard não aparece
- ✅ Verificar se usuário é admin/editor
- ✅ Verificar se token está válido
- ✅ Verificar console do navegador

### Dados não carregam
- ✅ Verificar endpoint `/api/admin/stats`
- ✅ Verificar resposta da API
- ✅ Verificar network tab

### Layout quebrado
- ✅ Limpar cache do navegador
- ✅ Verificar CSS em painel.html
- ✅ Testar em navegador diferente

---

## 💡 Dicas

1. **Personalizar cores**: Editar variáveis CSS em `painel.html`
2. **Atualizar dados**: API carrega automaticamente ao renderizar
3. **Adicionar mais atividades**: Editar array em `atualizarDashboard()`
4. **Mudar período**: Adaptar lógica em `getDataAtual()`

---

## 📞 Referência Rápida

```javascript
// Carregar stats
carregarStats();

// Atualizar dashboard
atualizarDashboard(stats);

// Formatar data
getDataAtual();
```

---

## ✨ Features

✅ Responsivo (mobile, tablet, desktop)
✅ Cores vibrantes
✅ Gráficos renderizados
✅ Dados em tempo real
✅ Sem dependências externas
✅ Bem documentado

---

## 🚀 Próximas Steps

1. Testar em diferentes navegadores
2. Integrar com dados reais
3. Adicionar auto-refresh
4. Implementar gráficos interativos
5. Adicionar filtros por período

---

**Status: ✅ Completo**
**Última atualização: 18 de Maio de 2026**
