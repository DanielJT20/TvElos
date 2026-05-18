# 📋 Atualização do Dashboard - Admin Only + Páginas Acessadas

## ✅ Mudanças Realizadas

### 1. **Restrição de Acesso**
- ❌ Dashboard **NÃO** é mais visível para `editor`
- ✅ Dashboard é visível **APENAS** para `admin`

### 2. **Nova Métrica: Páginas Mais Acessadas**
- Novo gráfico de barras horizontal
- Mostra as **top 6 páginas** mais clicadas
- Cores gradientes (Amarelo → Verde → Ciano)
- Valores de cliques exibidos

### 3. **Estrutura de Acesso**

```
👤 Participante
  └─ Vê apenas suas pautas

👥 Editor (Equipe)
  ├─ Gerencia todas as pautas
  ├─ Responde mensagens
  ├─ Gerencia vídeos
  └─ ❌ Não vê dashboard

👨‍💼 Admin (NOVO)
  ├─ Dashboard completo ✅
  ├─ Métricas gerais
  ├─ Gráficos de evolução
  ├─ Atividade recente
  ├─ Páginas mais acessadas ✅ (NOVO)
  ├─ Gerencia todas as pautas
  ├─ Responde mensagens
  ├─ Gerencia vídeos
  └─ Exporta para Power BI
```

---

## 🔧 Novo Endpoint Necessário

### GET `/api/admin/acessos`

O backend precisa retornar as páginas mais acessadas:

```json
[
  {
    "pagina": "programas.html",
    "cliques": 1250
  },
  {
    "pagina": "projetos.html",
    "cliques": 980
  },
  {
    "pagina": "sobre.html",
    "cliques": 756
  },
  {
    "pagina": "processo.html",
    "cliques": 543
  },
  {
    "pagina": "transparencia.html",
    "cliques": 432
  },
  {
    "pagina": "contato.html",
    "cliques": 298
  }
]
```

### Campos Obrigatórios
- **pagina** (string): Nome/rota da página
- **cliques** (number): Total de cliques

---

## 📊 Visualização do Gráfico

```
PÁGINAS MAIS ACESSADAS

programas.html        ████████████████████████ 1250 cliques
projetos.html         ███████████████████ 980 cliques
sobre.html            ███████████████ 756 cliques
processo.html         ████████████ 543 cliques
transparencia.html    ██████████ 432 cliques
contato.html          ██████ 298 cliques
```

---

## 🎨 Estilo do Gráfico

- **Barra 1º lugar**: Gradiente amarelo (#cfff04)
- **Barra 2º lugar**: Gradiente verde (#4ade80)
- **Demais barras**: Gradiente ciano (#00ffff)
- **Altura da barra**: Proporcional aos cliques
- **Rótulos**: À direita com número de cliques

---

## 🚀 Como Usar

### 1. **Fazer Login como Admin**
```
Login como admin
```

### 2. **Acessar o Painel**
```
/painel.html
```

### 3. **Ver o Dashboard**
Dashboard aparecerá automaticamente com:
- 4 cards de métricas
- Gráfico de evolução mensal
- Barras de progresso
- Feed de atividade
- **🆕 Páginas mais acessadas**

---

## 📝 Código Adicionado

### Function JavaScript
```javascript
async function carregarPaginasMaisAcessadas() {
  // Busca dados de /api/admin/acessos
  // Processa e exibe top 6 páginas
  // Com cores e valores de cliques
}
```

### Chamada
```javascript
carregarPaginasMaisAcessadas(); // Chamada automática para admin
```

---

## 🔐 Segurança

- ✅ Dashboard só aparece para `admin`
- ✅ Requer autenticação (token)
- ✅ Endpoints protegidos por auth
- ✅ Dados não expostos para users não-autenticados

---

## ✨ Próximas Melhorias

1. [ ] Filtro por período de tempo
2. [ ] Exportar dados de acessos em CSV/PDF
3. [ ] Gráfico de heatmap por dia/hora
4. [ ] Taxa de bounce por página
5. [ ] Comparação com período anterior

---

## 📞 Referência

**Arquivo modificado**: `painel.html`

**Novas classes CSS**:
- `.page-bar-item`
- `.page-bar-label`
- `.page-bar-container`
- `.page-bar-fill`
- `.page-bar-value`

**Novo endpoint necessário**: `/api/admin/acessos`

---

**Status**: ✅ Implementado e pronto para uso
**Data**: 18 de Maio de 2026
