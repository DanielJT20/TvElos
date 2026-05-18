# TV ELOS

Plataforma audiovisual universitária brasileira. Site estático com backend Node.js/Express e MongoDB Atlas.

## 📁 Estrutura

```
.
├── assets/
│   ├── css/style.css      # Estilos globais + responsivo
│   └── js/script.js       # Login, cadastro, menu mobile, sincronização
├── backend/
│   ├── server.js          # API Express (rotas, auth, segurança)
│   ├── package.json
│   └── test/
│       └── api.test.js    # Testes automatizados (Mocha + Chai + Supertest)
├── index.html              # Home com animação hero
├── programas.html          # Episódios (carregados do banco)
├── projetos.html           # Pautas da semana + formulário de envio
├── sobre.html              # Missão, valores, equipe
├── processo.html          # Fluxo de produção
├── contato.html            # Formulário funcional + infos
├── transparencia.html      # Ética e relatórios
├── painel.html             # Dashboard (participante / equipe / admin)
├── server.js               # Servidor frontend estático + proxy API
├── sitemap.xml             # Sitemap para SEO
├── robots.txt              # Diretrizes de rastreamento
└── start.sh                # Script de inicialização (backend + frontend)
```

## 🎮 Funcionalidades

| Página | O que faz |
|---|---|
| **Home** | Apresentação com animação interativa no título |
| **Programas** | Vídeos carregados dinamicamente do MongoDB |
| **Projetos** | Pautas da semana + envio de nova pauta (sem login) |
| **Contato** | Formulário que salva no banco |
| **Painel** | Participante vê suas pautas; Equipe vê tudo + gerencia vídeos |

## 🔐 Segurança

- Senhas hasheadas com **bcrypt** (salt 10)
- Auth via **JWT** (expira em 7 dias)
- Roles: `participante` → `editor` → `admin`
- **Helmet** (headers de segurança)
- **Rate-limiting** (100 req / 15 min por IP)
- **express-mongo-sanitize** (proteção NoSQL injection)
- Exportação de dados protegida por token `EXPORT_TOKEN`

## 📚 Variáveis de Ambiente (Secrets)

```
MONGODB_URI    # URI do MongoDB Atlas
JWT_SECRET     # Chave secreta para assinar JWT
EXPORT_TOKEN   # Token para endpoints de exportação (Power BI)
PORT           # Porta do backend (padrão 3001)
```

## 🚀 Como rodar

```bash
# Instalar dependências do backend
cd backend && npm install

# Iniciar tudo (backend + frontend)
bash start.sh
```

Ou via workflows:
- `Backend API` → porta 3001
- `Start application` → porta 5000

## 🧪 Testes

```bash
cd backend && npm test
```

Executa testes de integração cobrindo:
- Health check
- Cadastro e login
- Proteção de rotas
- NoSQL injection sanitization
