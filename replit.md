# TV ELOS - Resumo do Projeto

Plataforma audiovisual universitária brasileira. Site estático com backend Node.js/Express e MongoDB Atlas.

## Stack

- **Frontend**: Vanilla HTML/CSS/JS (porta 5000)
- **Backend**: Node.js + Express (porta 3001)
- **Banco**: MongoDB Atlas (cloud)
- **Auth**: JWT + bcrypt
- **Deploy**: Replit Deployments

## Workflows

| Nome | Comando | Porta |
|---|---|---|
| Backend API | `node backend/server.js` | 3001 |
| Start application | `node server.js` | 5000 |

## Estrutura Principal

```
├── assets/css/style.css       # Estilos globais + responsivo
├── assets/js/script.js        # Login, cadastro, menu hambúrguer, sync
├── backend/server.js          # API Express (rotas, auth, segurança)
├── backend/test/api.test.js   # Testes automatizados
├── *.html                     # 8 páginas (home, programas, painel...)
└── start.sh                   # Inicialização (backend + frontend)
```

## Roles

- `participante` — envia pautas, vê suas pautas no painel
- `editor` — acessa todas as pautas, mensagens, vídeos, stats
- `admin` — mesmo que editor (pode ser expandido futuramente)

## Segurança

- Rate-limiting: 100 req / 15 min por IP
- Helmet headers (CSP, HSTS, etc.)
- express-mongo-sanitize (NoSQL injection)
- JWT expira em 7 dias
- Senhas hasheadas com bcrypt (salt 10)
- Exportação de dados protegida por token

## Secrets Necessários

```
MONGODB_URI     # MongoDB Atlas connection string
JWT_SECRET      # Chave para assinar tokens
EXPORT_TOKEN    # Token para exportação Power BI
```

## Comandos Útis

```bash
# Testes
cd backend && npm test

# Logs de produção
# Veja via Deployment skill > Logs
```
