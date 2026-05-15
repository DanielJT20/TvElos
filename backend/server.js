const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
// AUTH MIDDLEWARE
// ==========================================

function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Token necessário' });
    }
    try {
        const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch {
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
}

function equipeMiddleware(req, res, next) {
    if (!req.usuario || !['editor', 'admin'].includes(req.usuario.role)) {
        return res.status(403).json({ erro: 'Acesso restrito à equipe' });
    }
    next();
}

// ==========================================
// ROTAS - PROGRAMAS
// ==========================================

app.get('/api/programas', async (req, res) => {
    try {
        const programas = await db.collection('programas').find({}).toArray();
        res.json(programas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.get('/api/programas/:id', async (req, res) => {
    try {
        const programa = await db.collection('programas').findOne({ _id: new ObjectId(req.params.id) });
        if (!programa) return res.status(404).json({ erro: 'Programa não encontrado' });
        res.json(programa);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.post('/api/programas', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const { titulo, descricao, categoria, videoUrl, dataPublicacao } = req.body;
        if (!titulo) return res.status(400).json({ erro: 'Título obrigatório' });
        const novo = { titulo, descricao, categoria, videoUrl, dataPublicacao: dataPublicacao || new Date(), dataCriacao: new Date() };
        const resultado = await db.collection('programas').insertOne(novo);
        res.status(201).json({ _id: resultado.insertedId, ...novo });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ==========================================
// ROTAS - PAUTAS
// ==========================================

// GET pautas do usuário logado
app.get('/api/pautas/minhas', authMiddleware, async (req, res) => {
    try {
        const pautas = await db.collection('pautas')
            .find({ email: req.usuario.email })
            .sort({ dataCriacao: -1 })
            .toArray();
        res.json(pautas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// PUT atualizar status de uma pauta (equipe only)
app.put('/api/pautas/:id/status', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const { status, observacao } = req.body;
        const validos = ['pendente', 'em_analise', 'aprovada', 'rejeitada'];
        if (!validos.includes(status)) {
            return res.status(400).json({ erro: 'Status inválido' });
        }
        await db.collection('pautas').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status, observacao: observacao || '', dataAtualizacao: new Date() } }
        );
        res.json({ mensagem: 'Status atualizado' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// GET todas as pautas (equipe only)
app.get('/api/pautas', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const pautas = await db.collection('pautas').find({}).sort({ dataCriacao: -1 }).toArray();
        res.json(pautas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// POST criar nova pauta (público)
app.post('/api/pautas', async (req, res) => {
    try {
        const { titulo, descricao, autor, email } = req.body;
        if (!titulo || !autor || !email) {
            return res.status(400).json({ erro: 'Título, autor e email são obrigatórios' });
        }
        const novaPauta = {
            titulo,
            descricao: descricao || '',
            autor,
            email,
            status: 'pendente',
            observacao: '',
            dataCriacao: new Date(),
            dataAtualizacao: new Date()
        };
        const resultado = await db.collection('pautas').insertOne(novaPauta);
        res.status(201).json({ _id: resultado.insertedId, ...novaPauta });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ==========================================
// ROTAS - USUÁRIOS
// ==========================================

// GET todos os usuários (admin only)
app.get('/api/usuarios', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const usuarios = await db.collection('usuarios')
            .find({}, { projection: { senha: 0 } })
            .toArray();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// POST registrar usuário (público)
app.post('/api/usuarios/registro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
        }
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
            role: 'participante',
            dataCriacao: new Date()
        };
        const resultado = await db.collection('usuarios').insertOne(novoUsuario);
        res.status(201).json({ _id: resultado.insertedId, nome, email, role: 'participante' });
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
// ROTAS - CONTATO
// ==========================================

// POST mensagem de contato (público)
app.post('/api/contato', async (req, res) => {
    try {
        const { nome, email, assunto, mensagem } = req.body;
        if (!nome || !email || !mensagem) {
            return res.status(400).json({ erro: 'Nome, email e mensagem são obrigatórios' });
        }
        const novaMsg = {
            nome,
            email,
            assunto: assunto || '',
            mensagem,
            dataCriacao: new Date(),
            lida: false
        };
        const resultado = await db.collection('contato').insertOne(novaMsg);
        res.status(201).json({ mensagem: 'Mensagem enviada com sucesso', _id: resultado.insertedId });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// GET mensagens de contato (equipe only)
app.get('/api/contato', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const mensagens = await db.collection('contato')
            .find({})
            .sort({ dataCriacao: -1 })
            .toArray();
        res.json(mensagens);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ==========================================
// ROTAS - ADMIN
// ==========================================

// GET estatísticas gerais (equipe only)
app.get('/api/admin/stats', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const [totalPautas, pendentes, em_analise, aprovadas, rejeitadas, totalUsuarios, totalMensagens] = await Promise.all([
            db.collection('pautas').countDocuments(),
            db.collection('pautas').countDocuments({ status: 'pendente' }),
            db.collection('pautas').countDocuments({ status: 'em_analise' }),
            db.collection('pautas').countDocuments({ status: 'aprovada' }),
            db.collection('pautas').countDocuments({ status: 'rejeitada' }),
            db.collection('usuarios').countDocuments(),
            db.collection('contato').countDocuments()
        ]);
        res.json({ totalPautas, pendentes, em_analise, aprovadas, rejeitadas, totalUsuarios, totalMensagens });
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

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 API rodando na porta ${PORT}`);
    });
});
