/**
 * TV ELOS - Testes de Integração da API
 * =====================================
 * Mocha + Chai (expect) + Supertest
 *
 * Como rodar:
 *   cd backend && npm test
 */

const request = require('supertest');
const { expect } = require('chai');

// Importa app e conexão do banco (o server.js não inicia sozinho nos testes)
const { app, connectDB, db } = require('../server.js');

describe('API TV ELOS', function () {
    this.timeout(15000);          // timeout maior para conectar MongoDB

    // Conecta ao banco ANTES de rodar os testes
    before(async function () {
        await connectDB();
    });

    // ================================================================
    // 1. HEALTH CHECK
    // ================================================================
    describe('GET /api/health', function () {
        it('deve retornar status OK', async function () {
            const res = await request(app).get('/api/health');
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('OK');
        });
    });

    // ================================================================
    // 2. ROTAS PÚBLICAS (sem auth)
    // ================================================================
    describe('Rotas públicas', function () {

        it('GET /api/programas deve retornar array', async function () {
            const res = await request(app).get('/api/programas');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });

        it('POST /api/pautas deve criar pauta', async function () {
            const timestamp = Date.now();
            const res = await request(app)
                .post('/api/pautas')
                .send({
                    titulo: `Pauta Teste ${timestamp}`,
                    descricao: 'Descrição de teste',
                    autor: 'Tester',
                    email: 'test@tvelos.com'
                });
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('_id');
            expect(res.body.status).to.equal('pendente');
        });

        it('POST /api/contato deve criar mensagem', async function () {
            const timestamp = Date.now();
            const res = await request(app)
                .post('/api/contato')
                .send({
                    nome: `João ${timestamp}`,
                    email: 'joao@tvelos.com',
                    assunto: 'Dúvida',
                    mensagem: 'Olá, tudo bem?'
                });
            expect(res.status).to.equal(201);
            expect(res.body.mensagem).to.include('sucesso');
        });

        it('POST /api/usuarios/registro deve cadastrar usuário', async function () {
            const timestamp = Date.now();
            const res = await request(app)
                .post('/api/usuarios/registro')
                .send({
                    nome: `Usuário Teste ${timestamp}`,
                    email: `test_${timestamp}@tvelos.com`,
                    senha: 'senha123'
                });
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('role', 'participante');
        });

        it('POST /api/usuarios/login deve retornar JWT', async function () {
            const timestamp = Date.now();
            const email = `login_${timestamp}@tvelos.com`;
            // cadastra primeiro
            await request(app)
                .post('/api/usuarios/registro')
                .send({ nome: 'Login Test', email, senha: 'senha123' });
            // loga
            const res = await request(app)
                .post('/api/usuarios/login')
                .send({ email, senha: 'senha123' });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
            expect(res.body.usuario).to.have.property('role');
        });
    });

    // ================================================================
    // 3. ROTAS PROTEGIDAS (sem token = 401)
    // ================================================================
    describe('Rotas protegidas (401 sem auth)', function () {

        it('GET /api/pautas deve retornar 401', async function () {
            const res = await request(app).get('/api/pautas');
            expect(res.status).to.equal(401);
        });

        it('GET /api/admin/stats deve retornar 401', async function () {
            const res = await request(app).get('/api/admin/stats');
            expect(res.status).to.equal(401);
        });

        it('POST /api/programas deve retornar 401', async function () {
            const res = await request(app)
                .post('/api/programas')
                .send({ titulo: 'Test' });
            expect(res.status).to.equal(401);
        });

        it('GET /api/export/pautas sem token deve retornar 401 ou 503', async function () {
            const res = await request(app).get('/api/export/pautas');
            // 503 se EXPORT_TOKEN não estiver configurado nos testes
            expect([401, 503]).to.include(res.status);
        });
    });

    // ================================================================
    // 4. NOSQL INJECTION SANITIZATION
    // ================================================================
    describe('Proteção NoSQL Injection', function () {

        it('deve sanitizar operadores de query no login', async function () {
            const res = await request(app)
                .post('/api/usuarios/login')
                .send({ email: { $ne: null }, senha: { $ne: null } });
            // mongoSanitize converte $ para _
            // espera-se que o banco não encontre e retorne erro
            expect([400, 401, 500]).to.include(res.status);
        });
    });
});
