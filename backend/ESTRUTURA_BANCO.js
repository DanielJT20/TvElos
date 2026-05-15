// ==========================================
// ESTRUTURA DO BANCO DE DADOS - TV ELOS
// ==========================================

/*
Coleções MongoDB:
1. programas
2. pautas
3. usuarios
4. episodios
5. comentarios
*/

// ==========================================
// COLEÇÃO: PROGRAMAS
// ==========================================

db.programas.insertOne({
    _id: ObjectId(),
    titulo: "O Que Rolou?",
    descricao: "Programa de atualidades focado em pautas sociais",
    slug: "o-que-rolou",
    imagem: "programas/o-que-rolou.jpg",
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    status: "ativo", // ativo, inativo, arquivado
    episodios: [
        ObjectId() // IDs dos episódios
    ]
});

// ==========================================
// COLEÇÃO: EPISÓDIOS
// ==========================================

db.episodios.insertOne({
    _id: ObjectId(),
    programaId: ObjectId(), // Referência ao programa
    numero: 1,
    titulo: "Primeira Transmissão",
    descricao: "Episódio inaugural do programa",
    dataTransmissao: new Date(),
    duracao: 45, // em minutos
    videoUrl: "https://youtube.com/embed/xxx",
    thumbnail: "episodios/ep1.jpg",
    tags: ["pauta", "comunidade", "participação"],
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    status: "publicado" // rascunho, publicado, arquivado
});

// ==========================================
// COLEÇÃO: PAUTAS
// ==========================================

db.pautas.insertOne({
    _id: ObjectId(),
    titulo: "Protagonismo Jovem na Educação",
    descricao: "Explorar como jovens estão transformando a educação",
    autor: "João Silva",
    email: "joao@email.com",
    telefone: "+55 11 99999-9999",
    conteudo: "Descrição detalhada da pauta...",
    tags: ["educação", "juventude", "inovação"],
    status: "pendente", // pendente, aprovada, rejeitada, produzindo
    prioridade: 1, // 1-5, sendo 5 a maior
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    dataAprovacao: null,
    observacoes: "Feedback da equipe"
});

// ==========================================
// COLEÇÃO: USUÁRIOS
// ==========================================

db.usuarios.insertOne({
    _id: ObjectId(),
    nome: "Maria Silva",
    email: "maria@tvelos.com.br",
    senha: "$2a$10$...", // Hash bcrypt
    role: "editor", // participante, editor, produtor, admin
    bio: "Produtora audiovisual",
    avatar: "usuarios/maria.jpg",
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    ultimoLogin: new Date(),
    ativo: true,
    permissoes: {
        criarPrograma: true,
        editarPrograma: true,
        publicarConteudo: true,
        gerenciarUsuarios: false
    }
});

// ==========================================
// COLEÇÃO: COMENTÁRIOS
// ==========================================

db.comentarios.insertOne({
    _id: ObjectId(),
    episodioId: ObjectId(),
    usuarioId: ObjectId(),
    nome: "João",
    email: "joao@email.com",
    conteudo: "Excelente episódio!",
    dataCriacao: new Date(),
    aprovado: true,
    respostas: [
        {
            _id: ObjectId(),
            usuarioId: ObjectId(),
            nome: "Equipe TV ELOS",
            conteudo: "Obrigado pelo feedback!",
            dataCriacao: new Date()
        }
    ]
});

// ==========================================
// QUERIES ÚTEIS PARA DESENVOLVIMENTO
// ==========================================

// Criar índices para melhor performance
db.programas.createIndex({ titulo: 1 });
db.programas.createIndex({ slug: 1 });
db.usuarios.createIndex({ email: 1 });
db.pautas.createIndex({ status: 1 });
db.pautas.createIndex({ dataCriacao: -1 });

// Listar todas as coleções
show collections;

// Limpar dados (CUIDADO - deleta tudo!)
db.programas.deleteMany({});
db.episodios.deleteMany({});
db.usuarios.deleteMany({});
db.pautas.deleteMany({});
db.comentarios.deleteMany({});

// Contar documentos
db.programas.countDocuments();

// Buscar com filtros
db.pautas.find({ status: "pendente" });
db.usuarios.find({ role: "editor" });

// Atualizar múltiplos documentos
db.pautas.updateMany(
    { status: "pendente" },
    { $set: { prioridade: 2 } }
);

// Deletar com filtro
db.pautas.deleteMany({ status: "rejeitada" });

// Agregar dados (exemplo: contar pautas por status)
db.pautas.aggregate([
    {
        $group: {
            _id: "$status",
            total: { $sum: 1 }
        }
    }
]);

// ==========================================
// SCRIPT DE SEEDING (Dados Iniciais)
// ==========================================

// Copie e execute em: mongo tvelos < seed.js

// Criar programas padrão
db.programas.insertMany([
    {
        titulo: "O Que Rolou?",
        descricao: "Programa de atualidades e análise de pautas",
        slug: "o-que-rolou",
        status: "ativo",
        episodios: [],
        dataCriacao: new Date()
    },
    {
        titulo: "Conexão Elos",
        descricao: "Programa focado em conexões humanas",
        slug: "conexao-elos",
        status: "ativo",
        episodios: [],
        dataCriacao: new Date()
    },
    {
        titulo: "Cortes da Semana",
        descricao: "Compilação de melhores momentos",
        slug: "cortes-semana",
        status: "ativo",
        episodios: [],
        dataCriacao: new Date()
    }
]);

// Criar usuário admin
const bcrypt = require("bcryptjs");
const senhaHash = bcrypt.hashSync("admin123", 10);

db.usuarios.insertOne({
    nome: "Admin TV ELOS",
    email: "admin@tvelos.com.br",
    senha: senhaHash,
    role: "admin",
    dataCriacao: new Date(),
    ativo: true
});

console.log("✅ Seeding concluído!");
