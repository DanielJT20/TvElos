/**
 * TV ELOS - Backend API
 * =======================
 * Node.js + Express + MongoDB Atlas
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
    max: 150, // Aumentado um pouco para acomodar pings de telemetria de acessos
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
    const rolesPermitidos = ['editor', 'admin'];
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.role)) {
        return res.status(403).json({ erro: 'Acesso restrito à equipe' });
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
   ROTAS - PROGRAMAS (vídeos / episódios)
   ===================================================================== */
app.get('/api/programas', async (req, res) => {
    try {
        const programas = await db.collection('programas').find({}).toArray();
        res.json(programas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.post('/api/programas', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const { titulo, tag, descricao, categoria, videoUrl } = req.body;
        if (!titulo) return res.status(400).json({ erro: 'Título obrigatório' });
        const novo = {
            titulo,
            tag: tag || '',
            descricao: descricao || '',
            categoria: categoria || 'Geral',
            videoUrl: videoUrl || '',
            visualizacoes: 0, // Inicializado seguro para contagem de cliques
            dataCriacao: new Date()
        };
        const resultado = await db.collection('programas').insertOne(novo);
        res.status(201).json({ _id: resultado.insertedId, ...novo });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// POST Incrementar cliques/views de um vídeo de forma pública
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

app.delete('/api/programas/:id', authMiddleware, equipeMiddleware, async (req, res) => {
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
   ROTAS - PAUTAS
   ===================================================================== */
app.get('/api/pautas/minhas', authMiddleware, async (req, res) => {
    try {
        const pautas = await db.collection('pautas').find({ email: req.usuario.email }).sort({ dataCriacao: -1 }).toArray();
        res.json(pautas);
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.put('/api/pautas/:id/status', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const { status, observacao } = req.body;
        const validos = ['pendente', 'em_analise', 'aprovada', 'rejeitada'];
        if (!validos.includes(status)) return res.status(400).json({ erro: 'Status inválido' });
        await db.collection('pautas').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status, observacao: observacao || '', dataAtualizacao: new Date() } }
        );
        res.json({ mensagem: 'Status updated' });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/pautas', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const pautas = await db.collection('pautas').find({}).sort({ dataCriacao: -1 }).toArray();
        res.json(pautas);
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.post('/api/pautas', async (req, res) => {
    try {
        const { titulo, descricao, autor, email } = req.body;
        if (!titulo || !autor || !email) return res.status(400).json({ erro: 'Campos obrigatórios ausentes' });
        const novaPauta = { titulo, descricao: descricao || '', autor, email, status: 'pendente', observacao: '', dataCriacao: new Date(), dataAtualizacao: new Date() };
        const resultado = await db.collection('pautas').insertOne(novaPauta);
        res.status(201).json({ _id: resultado.insertedId, ...novaPauta });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

/* =====================================================================
   ROTAS - USUÁRIOS
   ===================================================================== */
app.get('/api/usuarios', authMiddleware, equipeMiddleware, async (req, res) => {
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
        if (existente) return res.status(400).json({ erro: 'Email já registrado' });

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
        if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });

        const bcrypt = require('bcryptjs');
        const valida = await bcrypt.compare(senha, usuario.senha);
        if (!valida) return res.status(401).json({ erro: 'Credenciais inválidas' });

        const token = jwt.sign({ id: usuario._id, email: usuario.email, role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, usuario: { _id: usuario._id, nome: usuario.nome, email: usuario.email, role: usuario.role } });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/usuarios/me', authMiddleware, async (req, res) => {
    try {
        const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(req.usuario.id) }, { projection: { senha: 0 } });
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json({ _id: usuario._id, nome: usuario.nome, email: usuario.email, role: usuario.role });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

/* =====================================================================
   ROTAS - CONTATO
   ===================================================================== */
app.post('/api/contato', async (req, res) => {
    try {
        const { nome, email, assunto, mensagem } = req.body;
        const novaMsg = { nome, email, assunto: assunto || '', mensagem, dataCriacao: new Date(), lida: false };
        const resultado = await db.collection('contato').insertOne(novaMsg);
        res.status(201).json({ mensagem: 'Sucesso', _id: resultado.insertedId });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/contato', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const mensagens = await db.collection('contato').find({}).sort({ dataCriacao: -1 }).toArray();
        res.json(mensagens);
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

/* =====================================================================
   NOVA SEÇÃO DE ROTAS - TELEMETRIA DE ACESSOS E COMPORTAMENTO
   ===================================================================== */

// POST Salvar log de acesso de página do site — público
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
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// GET Consolidação de métricas completas de acessos e cliques — equipe only
app.get('/api/admin/acessos', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const topPaginas = await db.collection('acessos').aggregate([
            { $group: { _id: "$pagina", cliques: { $sum: 1 } } },
            { $sort: { cliques: -1 } },
            { $limit: 6 },
            { $project: { pagina: "$_id", cliques: 1, _id: 0 } }
        ]).toArray();

        const topVideos = await db.collection('programas')
            .find({})
            .sort({ visualizacoes: -1 })
            .limit(6)
            .toArray();

        const ultimosAcessos = await db.collection('acessos')
            .find({})
            .sort({ dataAcesso: -1 })
            .limit(8)
            .toArray();

        res.json({ topPaginas, topVideos, ultimosAcessos });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}); // <-- AGORA A ROTA DE ACESSOS FECHA AQUI CORRETAMENTE

// GET Exportar todo o histórico de tráfego e acessos em formato CSV
app.get('/api/admin/acessos/csv', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const logs = await db.collection('acessos')
            .find({})
            .sort({ dataAcesso: -1 })
            .toArray();
        
        let csvContent = "Data,Horario,Pagina,URL_Completa,Usuario_Nome,Usuario_Email\n";
        
        logs.forEach(log => {
            const dataObj = new Date(log.dataAcesso);
            const dataStr = dataObj.toLocaleDateString('pt-BR');
            const horaStr = dataObj.toLocaleTimeString('pt-BR');
            
            const pagina = `"${(log.pagina || '').replace(/"/g, '""')}"`;
            const url    = `"${(log.url || '').replace(/"/g, '""')}"`;
            const nome   = `"${(log.usuarioNome || '').replace(/"/g, '""')}"`;
            const email  = `"${(log.usuarioEmail || '').replace(/"/g, '""')}"`;
            
            csvContent += `${dataStr},${horaStr},${pagina},${url},${nome},${email}\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=tvelos_audiencia_logs.csv');
        res.status(200).send('\uFEFF' + csvContent);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

/* =====================================================================
   ROTAS - ADMIN & EXPORT
   ===================================================================== */
app.get('/api/admin/stats', authMiddleware, equipeMiddleware, async (req, res) => {
    try {
        const [totalPautas, pendentes, em_analise, aprovadas, rejeitadas, totalUsuarios, totalMensagens, totalVideos] = await Promise.all([
            db.collection('pautas').countDocuments(),
            db.collection('pautas').countDocuments({ status: 'pendente' }),
            db.collection('pautas').countDocuments({ status: 'em_analise' }),
            db.collection('pautas').countDocuments({ status: 'aprovada' }),
            db.collection('pautas').countDocuments({ status: 'rejeitada' }),
            db.collection('usuarios').countDocuments(),
            db.collection('contato').countDocuments(),
            db.collection('programas').countDocuments()
        ]);
        res.json({ totalPautas, pendentes, em_analise, aprovadas, rejeitadas, totalUsuarios, totalMensagens, totalVideos });
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/export/pautas', exportMiddleware, async (req, res) => {
    try {
        const docs = await db.collection('pautas').find({}).sort({ dataCriacao: -1 }).toArray();
        res.json(docs.map(p => ({ id: p._id.toString(), titulo: p.titulo, autor: p.autor, email: p.email, status: p.status, dataCriacao: p.dataCriacao })));
    } catch (error) { res.status(500).json({ erro: error.message }); }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', mensagem: 'API TV ELOS rodando!' });
});

module.exports = { app, connectDB, db: () => db };

if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));
    });
}