/**
 * TV ELOS - Backend API
 * =======================
 * Node.js + Express + MongoDB Atlas
 * Permissões: Visitantes não-logados (Leitura apenas), Participantes (Ações), Admin (Gerenciamento)
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/* =====================================================================
   MIDDLEWARES DE SEGURANÇA
   ===================================================================== */
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: { erro: 'Muitas requisições. Tente novamente mais tarde.' }
});
app.use('/api/', limiter);

app.use(mongoSanitize());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

/* =====================================================================
   CONEXÃO MONGODB ATLAS
   ===================================================================== */
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
        console.log('✅ Conectado ao MongoDB Atlas');
    } catch (error) {
        console.error('❌ Erro ao conectar MongoDB:', error);
        process.exit(1);
    }
}

/* =====================================================================
   MIDDLEWARES DE AUTENTICAÇÃO / AUTORIZAÇÃO
   ===================================================================== */
function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Você precisa estar logado para realizar esta ação.' });
    }
    try {
        const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch {
        return res.status(401).json({ erro: 'Sua sessão expirou. Faça login novamente.' });
    }
}

// ALTERADO: Apenas o Administrador agora gerencia o sistema
function adminMiddleware(req, res, next) {
    if (!req.usuario || req.usuario.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso restrito apenas ao Administrador Gerente.' });
    }
    next();
}

function exportMiddleware(req, res, next) {
    const token = req.query.token;
    const exportToken = process.env.EXPORT_TOKEN;
    if (!exportToken) {
        return res.status(503).json({ erro: 'EXPORT_TOKEN não configurado.' });
    }
    if (!token || token !== exportToken) {
        return res.status(401).json({ erro: 'Token inválido.' });
    }
    next();
}

/* =====================================================================
   ROTAS - PROGRAMAS (VÍDEOS) - ACESSO PÚBLICO MANTIDO
   ===================================================================== */
app.get('/api/programas', async (req, res) => {
    try {
        const programas = await db.collection('programas').find({}).toArray();
        res.json(programas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Apenas admin cria vídeos
app.post('/api/programas', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { titulo, tag, descricao, categoria, videoUrl } = req.body;
        if (!titulo) return res.status(400).json({ erro: 'Título obrigatório' });
        const novo = {
            titulo,
            tag: tag || '',
            descricao: descricao || '',
            categoria: categoria || 'Geral',
            videoUrl: videoUrl || '',
            visualizacoes: 0,
            dataCriacao: new Date()
        };
        const resultado = await db.collection('programas').insertOne(novo);
        res.status(201).json({ _id: resultado.insertedId, ...novo });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.post('/api/programas/:id/clique', async (req, res) => {
    try {
        await db.collection('programas').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $inc: { visualizacoes: 1 } }
        );
        res.json({ status: 'OK' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.delete('/api/programas/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const resultado = await db.collection('programas').deleteOne({
            _id: new ObjectId(req.params.id)
        });
        if (resultado.deletedCount === 0) return res.status(404).json({ erro: 'Vídeo não encontrado' });
        res.json({ mensagem: 'Vídeo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

/* =====================================================================
   ROTAS - PAUTAS (RESTRITO A USUÁRIOS LOGADOS)
   ===================================================================== */
app.get('/api/pautas/minhas', authMiddleware, async (req, res) => {
    try {
        const pautas = await db.collection('pautas').find({ email: req.usuario.email }).sort({ dataCriacao: -1 }).toArray();
        res.json(pautas);
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.put('/api/pautas/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status, observacao } = req.body;
        const validos = ['pendente', 'em_analise', 'aprovada', 'rejeitada'];
        if (!validos.includes(status)) return res.status(400).json({ erro: 'Status inválido' });
        await db.collection('pautas').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status, observacao: observacao || '', dataAtualizacao: new Date() } }
        );
        res.json({ mensagem: 'Status atualizado pelo gerente admin' });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/pautas', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const pautas = await db.collection('pautas').find({}).sort({ dataCriacao: -1 }).toArray();
        res.json(pautas);
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

// ALTERADO: Adicionado authMiddleware para bloquear envios anônimos de pauta
app.post('/api/pautas', authMiddleware, async (req, res) => {
    try {
        const { titulo, descricao } = req.body;
        if (!titulo) return res.status(400).json({ erro: 'O título da pauta é obrigatório.' });
        
        // Coleta os metadados do token de autenticação seguro do usuário logado
        const novaPauta = { 
            titulo, 
            descricao: descricao || '', 
            autor: req.usuario.nome || 'Usuário Cadastrado', 
            email: req.usuario.email, 
            status: 'pendente', 
            observacao: '', 
            dataCriacao: new Date(), 
            dataAtualizacao: new Date() 
        };
        const resultado = await db.collection('pautas').insertOne(novaPauta);
        res.status(201).json({ _id: resultado.insertedId, ...novaPauta });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

/* =====================================================================
   ROTAS - USUÁRIOS
   ===================================================================== */
app.get('/api/usuarios', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const usuarios = await db.collection('usuarios').find({}, { projection: { senha: 0 } }).toArray();
        res.json(usuarios);
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.post('/api/usuarios/registro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) return res.status(400).json({ erro: 'Campos obrigatórios ausentes' });
        const existente = await db.collection('usuarios').findOne({ email });
        if (existente) return res.status(400).json({ erro: 'Este email já está cadastrado.' });

        const bcrypt = require('bcryptjs');
        const senhaHash = await bcrypt.hash(senha, 10);
        const novo = { nome, email, senha: senhaHash, role: 'participante', dataCriacao: new Date() };
        const resultado = await db.collection('usuarios').insertOne(novo);
        res.status(201).json({ _id: resultado.insertedId, nome, email, role: 'participante' });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.post('/api/usuarios/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await db.collection('usuarios').findOne({ email });
        if (!usuario) return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });

        const bcrypt = require('bcryptjs');
        const valida = await bcrypt.compare(senha, usuario.senha);
        if (!valida) return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });

        // Se por ventura um usuário antigo estivesse com o role 'editor', ele age de forma segura como participante
        const roleFinal = usuario.role === 'admin' ? 'admin' : 'participante';

        const token = jwt.sign({ id: usuario._id, email: usuario.email, role: roleFinal, nome: usuario.nome }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, usuario: { _id: usuario._id, nome: usuario.nome, email: usuario.email, role: roleFinal } });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

/* =====================================================================
   ROTAS - CONTATO (RESTRITO A USUÁRIOS LOGADOS)
   ===================================================================== */
// ALTERADO: Adicionado authMiddleware para impedir envios anônimos de mensagens de contato
app.post('/api/contato', authMiddleware, async (req, res) => {
    try {
        const { assunto, mensagem } = req.body;
        if (!mensagem) return res.status(400).json({ erro: 'A mensagem não pode estar vazia.' });

        const novaMsg = { 
            nome: req.usuario.nome || 'Usuário Cadastrado', 
            email: req.usuario.email, 
            assunto: assunto || 'Geral', 
            mensagem, 
            dataCriacao: new Date(), 
            lida: false 
        };
        const resultado = await db.collection('contato').insertOne(novaMsg);
        res.status(201).json({ mensagem: 'Sucesso', _id: resultado.insertedId });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/contato', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const mensagens = await db.collection('contato').find({}).sort({ dataCriacao: -1 }).toArray();
        res.json(mensagens);
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

/* =====================================================================
   TELEMETRIA DE ACESSOS E COMPORTAMENTO
   ===================================================================== */
app.post('/api/acessos', async (req, res) => {
    try {
        const { pagina, url, email, nome } = req.body;
        const novoLog = {
            pagina: pagina || 'Página sem título',
            url: url || '',
            usuarioEmail: email || 'Anônimo',
            usuarioNome: nome || 'Visitante Anônimo',
            dataAcesso: new Date()
        };
        await db.collection('acessos').insertOne(novoLog);
        res.status(201).json({ status: 'OK' });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/admin/acessos', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const topPaginas = await db.collection('acessos').aggregate([
            { $group: { _id: "$pagina", cliques: { $sum: 1 } } },
            { $sort: { cliques: -1 } },
            { $limit: 6 },
            { $project: { pagina: "$_id", cliques: 1, _id: 0 } }
        ]).toArray();

        const topVideos = await db.collection('programas').find({}).sort({ visualizacoes: -1 }).limit(6).toArray();
        const ultimosAcessos = await db.collection('acessos').find({}).sort({ dataAcesso: -1 }).limit(8).toArray();

        res.json({ topPaginas, topVideos, ultimosAcessos });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/admin/acessos/csv', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const logs = await db.collection('acessos').find({}).sort({ dataAcesso: -1 }).toArray();
        let csvContent = "Data,Horario,Pagina,URL_Completa,Usuario_Nome,Usuario_Email\n";
        logs.forEach(log => {
            const dataObj = new Date(log.dataAcesso);
            csvContent += `${dataObj.toLocaleDateString('pt-BR')},${dataObj.toLocaleTimeString('pt-BR')},"${(log.pagina || '').replace(/"/g, '""')}"` +
                          `,"${(log.url || '').replace(/"/g, '""')}","${(log.usuarioNome || '').replace(/"/g, '""')}","${(log.usuarioEmail || '').replace(/"/g, '""')}"\n`;
        });
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=tvelos_audiencia_logs.csv');
        res.status(200).send('\uFEFF' + csvContent);
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

/* =====================================================================
   MÉTRICAS DO CONSOLE MANAGER
   ===================================================================== */
app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [pendentes, em_analise, aprovadas, rejeitadas, totalUsuarios, totalMensagens, totalVideos] = await Promise.all([
            db.collection('pautas').countDocuments({ status: 'pendente' }),
            db.collection('pautas').countDocuments({ status: 'em_analise' }),
            db.collection('pautas').countDocuments({ status: 'aprovada' }),
            db.collection('pautas').countDocuments({ status: 'rejeitada' }),
            db.collection('usuarios').countDocuments(),
            db.collection('contato').countDocuments(),
            db.collection('programas').countDocuments()
        ]);
        res.json({ pendentes, em_analise, aprovadas, rejeitadas, totalUsuarios, totalMensagens, totalVideos });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/export/pautas', exportMiddleware, async (req, res) => {
    try {
        const docs = await db.collection('pautas').find({}).sort({ dataCriacao: -1 }).toArray();
        res.json(docs.map(p => ({ id: p._id.toString(), titulo: p.titulo, autor: p.autor, email: p.email, status: p.status, dataCriacao: p.dataCriacao })));
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/health', (req, res) => { res.json({ status: 'OK' }); });

module.exports = { app, connectDB };

if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));
    });
}