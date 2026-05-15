# 🗄️ Guia de Implementação do Banco de Dados - TV ELOS

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Executar o Backend](#executar-o-backend)
5. [Usar a API no Frontend](#usar-a-api-no-frontend)
6. [Endpoints Disponíveis](#endpoints-disponíveis)
7. [Próximos Passos](#próximos-passos)

---

## 🔧 Pré-requisitos

### Node.js (obrigatório)
- Faça download em: https://nodejs.org/
- Versão recomendada: LTS (18.x ou superior)
- Verifique instalação: `node -v` e `npm -v`

### MongoDB (banco de dados)

**Opção 1: MongoDB Local**
- Download: https://www.mongodb.com/try/download/community
- Instale e inicie o serviço MongoDB

**Opção 2: MongoDB Atlas (Nuvem - Recomendado)**
- Acesse: https://www.mongodb.com/cloud/atlas
- Crie conta gratuita
- Configure um cluster gratuito
- Copie a string de conexão

---

## 💻 Instalação

### 1. Instalar dependências do Backend

```powershell
cd backend
npm install
```

Isso instalará:
- `express` - Framework web
- `mongodb` - Driver do banco de dados
- `cors` - Permitir requisições do frontend
- `bcryptjs` - Hash de senhas
- `jsonwebtoken` - Autenticação JWT
- `nodemon` - Auto-reload durante desenvolvimento

### 2. Criar arquivo de configuração

```powershell
# No Windows, crie arquivo .env na pasta backend
copy .env.example .env
```

Edite o arquivo `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tvelos
JWT_SECRET=minha_chave_super_secreta_2026
```

---

## ⚙️ Configuração

### MongoDB Local

Se estiver usando **MongoDB local**:

1. Abra PowerShell como administrador
2. Inicie o MongoDB:
```powershell
mongod
```

### MongoDB Atlas (Nuvem)

Se estiver usando **MongoDB Atlas**:

1. Vá em https://cloud.mongodb.com
2. Copie sua string de conexão (parece com):
```
mongodb+srv://usuario:senha@cluster.mongodb.net/tvelos
```
3. Cole no `.env`:
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/tvelos
```

---

## 🚀 Executar o Backend

### Modo Desenvolvimento (com auto-reload)

```powershell
cd backend
npm run dev
```

### Modo Produção

```powershell
cd backend
npm start
```

Você verá:
```
✅ Conectado ao MongoDB
🚀 Servidor rodando em http://localhost:5000
📝 Documentação: http://localhost:5000/api/health
```

---

## 🌐 Usar a API no Frontend

### 1. Copiar arquivo de cliente API

```powershell
# Copie API_CLIENTE_EXEMPLO.js para o frontend
copy backend/API_CLIENTE_EXEMPLO.js assets/js/api.js
```

### 2. Incluir no HTML

Em cada página, adicione antes de `</body>`:

```html
<script src="assets/js/api.js"></script>
<script src="assets/js/script.js"></script>
```

### 3. Usar as funções no JavaScript

```javascript
// Obter programas
const programas = await obterProgramas();
console.log(programas);

// Login
const resultado = await loginUsuario('email@tvelos.com.br', 'senha');
console.log(resultado.token);

// Enviar pauta
const pauta = await enviarPauta(
    'Minha Pauta',
    'Descrição',
    'João Silva',
    'joao@email.com'
);
```

---

## 📡 Endpoints Disponíveis

### Programas

```
GET    /api/programas          # Listar todos
GET    /api/programas/:id      # Obter um
POST   /api/programas          # Criar
PUT    /api/programas/:id      # Atualizar
DELETE /api/programas/:id      # Deletar
```

### Pautas

```
GET    /api/pautas             # Listar todas
POST   /api/pautas             # Criar nova
```

### Usuários

```
POST   /api/usuarios/registro  # Registrar novo usuário
POST   /api/usuarios/login     # Login
GET    /api/usuarios           # Listar todos (admin)
```

### Saúde

```
GET    /api/health             # Verificar status da API
```

---

## 📝 Exemplos de Requisições

### Obter Programas

```bash
curl http://localhost:5000/api/programas
```

### Criar Programa

```bash
curl -X POST http://localhost:5000/api/programas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "O Que Rolou?",
    "descricao": "Programa de atualidades",
    "episodios": []
  }'
```

### Registrar Usuário

```bash
curl -X POST http://localhost:5000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@tvelos.com.br",
    "senha": "senha123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@tvelos.com.br",
    "senha": "senha123"
  }'
```

---

## 🎯 Próximos Passos

### Curto Prazo
- [ ] Adicionar validação de entrada (Joi ou Validator)
- [ ] Implementar autenticação JWT nas rotas
- [ ] Adicionar tratamento de erros melhorado
- [ ] Criar testes unitários

### Médio Prazo
- [ ] Implementar upload de imagens/vídeos
- [ ] Adicionar comentários e avaliações
- [ ] Sistema de permissões por role
- [ ] Paginação nas listagens

### Longo Prazo
- [ ] Deploy em servidor (Heroku, Railway, etc)
- [ ] Dashboard administrativo
- [ ] Sistema de notificações
- [ ] Analytics e relatórios

---

## 🐛 Troubleshooting

### "Erro: Cannot connect to MongoDB"

**Solução:**
- Verifique se MongoDB está rodando
- Verifique a URL de conexão no `.env`
- Se usar MongoDB Atlas, verifique IP whitelist

### "Port 5000 already in use"

**Solução:**
- Mude a porta no `.env`: `PORT=5001`
- Ou mate o processo: `npx kill-port 5000`

### "CORS errors no frontend"

**Solução:**
- Verifique se `cors` está ativado no `server.js`
- Confirme que a URL da API está correta (`http://localhost:5000/api`)

---

## 📚 Recursos Úteis

- [Documentação Express](https://expressjs.com/)
- [Documentação MongoDB](https://docs.mongodb.com/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

## ❓ Dúvidas?

Consulte os exemplos em `backend/API_CLIENTE_EXEMPLO.js` para ver como usar cada função.
