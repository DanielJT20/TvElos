# Dashboard do Painel de Admin - TV ELOS

## 📊 Overview

Um dashboard visual completo foi integrado ao painel de administração do site TV ELOS, fornecendo uma visão geral das métricas e atividades da plataforma.

## ✨ Features

### 1. **Header com Status ao Vivo**
- Título "TV ELOS / Painel de Métricas"
- Indicador visual "● Ao vivo"
- Data e período atual

### 2. **Cards de Métricas (4 itens)**
- **Total de Pautas** (amarelo): Contagem geral com delta de alterações
- **Aprovadas** (verde): Quantidade aprovada com percentual
- **Usuários** (ciano): Total de usuários cadastrados
- **Vídeos** (roxo): Total de vídeos publicados

Cada card exibe:
- Ícone colorido e borda destacada
- Valor grande e legível
- Delta (aumento/mudança) em texto menor

### 3. **Gráfico de Evolução Mensal**
- Gráfico de barras empilhadas mostrando:
  - **Verde**: Pautas aprovadas
  - **Amarelo**: Pautas pendentes
  - **Vermelho**: Pautas rejeitadas
- Último mês (Maio) destacado com borda
- Rótulos dos meses na base

### 4. **Situação Atual das Pautas**
- Barras de progresso para cada status:
  - Aprovadas
  - Pendentes
  - Em Análise
  - Rejeitadas
  - Mensagens recebidas
- Cores consistentes com o gráfico
- Valores numéricos ao lado

### 5. **Feed de Atividade Recente**
- 5 cards com atividades recentes:
  - Pauta enviada
  - Vídeo publicado
  - Conta criada
  - Pauta aprovada
  - Mensagem de contato
- Cada card possui:
  - Ícone colorido com semáforo
  - Descrição da ação
  - Timestamp relativo

## 🎨 Design

### Cores
- **Amarelo (#cfff04)**: Principal, destaques
- **Verde (#4ade80)**: Aprovadas, sucesso
- **Ciano (#00ffff)**: Usuários, informação
- **Roxo (#a78bfa)**: Vídeos, destaque
- **Vermelho (#f87171)**: Rejeitadas, atenção
- **Laranja (#fb923c)**: Mensagens

### Tipografia
- Títulos: Fonte grande, peso 900
- Labels: Texto pequeno, maiúsculo, espaçamento
- Body: Fonte legível com bom contraste

### Layout
- Grid responsivo
- 4 colunas em desktop
- 2 colunas em tablet
- 1 coluna em mobile

## 🔧 Integração

O dashboard é renderizado **apenas para usuários da equipe e admin**:

```javascript
if (isEquipe) {
    document.getElementById('dashboard-section').style.display = 'block';
    carregarStats(); // Busca dados do servidor
}
```

### Dados
Os dados são carregados do endpoint:
```
GET /api/admin/stats
```

Resposta esperada:
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

## 📱 Responsividade

- **Desktop (>1024px)**: Layout 2 colunas para gráficos, 5 colunas para atividades
- **Tablet (640px-1024px)**: Layout 1 coluna para gráficos, 3 colunas para atividades
- **Mobile (<640px)**: Layout adaptado com 2 colunas de cards, 1 coluna para atividades

## 🚀 Localização

O dashboard está localizado em:
- **Arquivo**: `painel.html`
- **Seção**: Primeira seção após o header, visível apenas para equipe/admin
- **ID**: `#dashboard-section`

## 📝 Notas

- O gráfico de histórico é simulado com dados exemplo
- A atividade recente usa dados pré-configurados
- Todos os valores são atualizados em tempo real ao carregar a página
- O design segue o padrão visual da TV ELOS com tema escuro

## 🎯 Próximas Melhorias

- [ ] Integrar com dados reais do banco de dados
- [ ] Adicionar gráficos interativos com Chart.js ou similar
- [ ] Adicionar filtros por período
- [ ] Adicionar exportação em PDF
- [ ] Adicionar atualização automática a cada X minutos
