# TV ELOS - Estrutura do Projeto

## 📁 Organização de Arquivos

```
TvElos/
├── index.html                 # Página principal (Home)
├── programas.html             # Página de Programas
├── projetos.html              # Página de Projetos
├── sobre.html                 # Página Sobre (TV ELOS)
├── processo.html              # Página de Processo
├── contato.html               # Página de Contato
├── transparencia.html         # Página de Transparência
├── index-tv-elos-v1.html      # Arquivo original (backup)
└── assets/
    ├── css/
    │   └── style.css          # Estilos globais (separado)
    └── js/
        └── script.js          # Scripts JavaScript (separado)
```

## 🎨 Estilização

- **Cores Principais:**
  - Fundo: `#000000` (Preto)
  - Texto: `#FFFFFF` (Branco)
  - Destaque: `#CFFF04` (Verde Lima)
  - Secundário: `#00FFFF` (Ciano)

- **Grid Layout:** Sistema de 12 colunas para layout responsivo
- **Animações:** Elastic stretch no hero com transição suave ao hover

## 📄 Páginas

### Home (index.html)
- Apresentação principal com animação do logo
- Programas em destaque
- Modal de login

### Programas (programas.html)
- Lista de todos os programas
- Descrições de cada programa
- Links para assistir

### Projetos (projetos.html)
- O que rolou na semana
- Convidados da semana
- Últimos episódios
- Sistema de inscrição de pautas

### Sobre (sobre.html)
- Missão da TV ELOS
- Valores do projeto
- Informações sobre a equipe

### Processo (processo.html)
- Fluxo de produção
- Pautas e agendamentos
- Estrutura de equipe
- Processo de qualidade

### Contato (contato.html)
- Informações de contato
- Formulário de mensagem
- Informações sobre participação

### Transparência (transparencia.html)
- Relatórios de atividades
- Informações de financiamento
- Governança e decisões
- Código de ética

## 🎯 Funcionalidades

### JavaScript (assets/js/script.js)
- Modal de login com toggle
- Animação do hero ao passar mouse
- Crossfade suave entre camadas (elastic ↔ glitch)
- Efeitos interativos

### CSS (assets/css/style.css)
- Design responsivo (desktop e mobile)
- Grid system de 12 colunas
- Animações CSS3 (elastic, glitch)
- Variáveis CSS para fácil customização
- Media queries para mobile

## 📱 Responsividade

O design é totalmente responsivo com breakpoints para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## 🔗 Navegação

Todas as páginas possuem:
- Header com logo (link para home)
- Menu de navegação
- Botão de login
- Footer com copyright

## 🚀 Como Usar

1. **Abrir no navegador:** Abra `index.html` no seu navegador favorito
2. **Editar conteúdo:** Modifique o HTML das páginas conforme necessário
3. **Customizar estilos:** Edite `assets/css/style.css`
4. **Adicionar funcionalidades:** Expanda `assets/js/script.js`

## ⚙️ Customizações

### Cores
Edite as variáveis CSS em `style.css`:
```css
:root {
    --bg-color: #000000;
    --text-color: #ffffff;
    --accent-color: #cfff04;
    --cyan-accent: #00ffff;
}
```

### Animações
Edite as keyframes em `style.css`:
- `@keyframes elastic` - Animação do hero
- `@keyframes glitch-anim` - Efeito glitch

## 📝 Notas

- O arquivo `index-tv-elos-v1.html` é um backup do arquivo original
- Remova-o quando tiver certeza que não precisa mais
- Todos os links internos usam caminhos relativos
- As imagens/vídeos podem ser adicionados em uma pasta `assets/media/`

## 🔄 Próximos Passos

- [ ] Integrar banco de dados para programas e episódios
- [ ] Implementar sistema de login real
- [ ] Adicionar carregamento de conteúdo dinâmico
- [ ] Implementar formulários funcionais
- [ ] Adicionar sistema de busca
- [ ] Integrar com plataforma de streaming
