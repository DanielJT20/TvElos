const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão MongoDB
let db;
const client = new MongoClient(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    serverSelectionTimeoutMS: 10000
});

async function connectDB() {
    try {
        await client.connect();
        db = client.db('tvelos');
        console.log('✅ Conectado ao MongoDB');
    } catch (error) {
        console.error('❌ Erro ao conectar MongoDB:', error);
        process.exit(1);
    }
}

// ==========================================
// ROTAS - PROGRAMAS
// ==========================================

// GET todos os programas
app.get('/api/programas', async (req, res) => {
    try {
        const programas = await db.collection('programas').find({}).toArray();
        res.json(programas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// GET um programa por ID
app.get('/api/programas/:id', async (req, res) => {
    try {
        const programa = await db.collection('programas').findOne({
            _id: new ObjectId(req.params.id)
        });
        if (!programa) {
            return res.status(404).json({ erro: 'Programa não encontrado' });
        }
        res.json(programa);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// POST criar novo programa (requer autenticação)
app.post('/api/programas', async (req, res) => {
    try {
        const { titulo, descricao, episodios } = req.body;
        
        if (!titulo || !descricao) {
            return res.status(400).json({ erro: 'Título e descrição são obrigatórios' });
        }

        const novoPrograma = {
            titulo,
            descricao,
            episodios: episodios || [],
            dataCriacao: new Date(),
            dataAtualizacao: new Date()
        };

        const resultado = await db.collection('programas').insertOne(novoPrograma);
        res.status(201).json({
            _id: resultado.insertedId,
            ...novoPrograma
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// PUT atualizar programa
app.put('/api/programas/:id', async (req, res) => {
    try {
        const { titulo, descricao } = req.body;
        
        const resultado = await db.collection('programas').updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    titulo: titulo || undefined,
                    descricao: descricao || undefined,
                    dataAtualizacao: new Date()
                }
            }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({ erro: 'Programa não encontrado' });
        }

        res.json({ mensagem: 'Programa atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// DELETE programa
app.delete('/api/programas/:id', async (req, res) => {
    try {
        const resultado = await db.collection('programas').deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ erro: 'Programa não encontrado' });
        }

        res.json({ mensagem: 'Programa deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ==========================================
// ROTAS - PAUTAS/PROJETOS
// ==========================================

// GET todas as pautas
app.get('/api/pautas', async (req, res) => {
    try {
        const pautas = await db.collection('pautas').find({}).toArray();
        res.json(pautas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// POST criar nova pauta
app.post('/api/pautas', async (req, res) => {
    try {
        const { titulo, descricao, autor, email, status } = req.body;

        if (!titulo || !autor || !email) {
            return res.status(400).json({ erro: 'Título, autor e email são obrigatórios' });
        }

        const novaPauta = {
            titulo,
            descricao,
            autor,
            email,
            status: status || 'pendente', // pendente, aprovada, rejeitada
            dataCriacao: new Date(),
            dataAtualizacao: new Date()
        };

        const resultado = await db.collection('pautas').insertOne(novaPauta);
        res.status(201).json({
            _id: resultado.insertedId,
            ...novaPauta
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ==========================================
// ROTAS - USUÁRIOS
// ==========================================

// GET todos os usuários (apenas admin)
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await db.collection('usuarios')
            .find({}, { projection: { senha: 0 } })
            .toArray();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// POST registrar usuário
app.post('/api/usuarios/registro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
        }

        // Verificar se usuário já existe
        const usuarioExistente = await db.collection('usuarios').findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Email já registrado' });
        }

        const bcrypt = require('bcryptjs');
        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = {
            nome,
            email,
            senha: senhaHash,
            role: 'participante', // participante, editor, admin
            dataCriacao: new Date()
        };

        const resultado = await db.collection('usuarios').insertOne(novoUsuario);
        res.status(201).json({
            _id: resultado.insertedId,
            nome,
            email,
            role: 'participante'
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// POST login
app.post('/api/usuarios/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }

        const usuario = await db.collection('usuarios').findOne({ email });
        if (!usuario) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const bcrypt = require('bcryptjs');
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { id: usuario._id, email: usuario.email, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            usuario: {
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
            }
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', mensagem: 'API TV ELOS rodando!' });
});

// Iniciar servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        console.log(`📝 Documentação: http://localhost:${PORT}/api/health`);
    });
});

// Tratamento de erro de encerramento
process.on('SIGINT', async () => {
    console.log('\n🔌 Encerrando conexão com MongoDB...');
    await client.close();
    process.exit(0);
});
