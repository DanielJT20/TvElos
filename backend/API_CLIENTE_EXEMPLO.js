// ==========================================
// API.js - Cliente para comunicação com backend
// Coloque em: assets/js/api.js
// ==========================================

const API_URL = 'http://localhost:5000/api';

// ==========================================
// PROGRAMAS
// ==========================================

async function obterProgramas() {
    try {
        const response = await fetch(`${API_URL}/programas`);
        if (!response.ok) throw new Error('Erro ao obter programas');
        return await response.json();
    } catch (error) {
        console.error('❌ Erro:', error);
        return [];
    }
}

async function obterPrograma(id) {
    try {
        const response = await fetch(`${API_URL}/programas/${id}`);
        if (!response.ok) throw new Error('Programa não encontrado');
        return await response.json();
    } catch (error) {
        console.error('❌ Erro:', error);
        return null;
    }
}

async function criarPrograma(titulo, descricao, episodios = []) {
    try {
        const response = await fetch(`${API_URL}/programas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descricao, episodios })
        });
        if (!response.ok) throw new Error('Erro ao criar programa');
        return await response.json();
    } catch (error) {
        console.error('❌ Erro:', error);
        return null;
    }
}

// ==========================================
// PAUTAS
// ==========================================

async function obterPautas() {
    try {
        const response = await fetch(`${API_URL}/pautas`);
        if (!response.ok) throw new Error('Erro ao obter pautas');
        return await response.json();
    } catch (error) {
        console.error('❌ Erro:', error);
        return [];
    }
}

async function enviarPauta(titulo, descricao, autor, email) {
    try {
        const response = await fetch(`${API_URL}/pautas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descricao, autor, email })
        });
        if (!response.ok) throw new Error('Erro ao enviar pauta');
        return await response.json();
    } catch (error) {
        console.error('❌ Erro:', error);
        return null;
    }
}

// ==========================================
// USUÁRIOS
// ==========================================

async function registroUsuario(nome, email, senha) {
    try {
        const response = await fetch(`${API_URL}/usuarios/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        if (!response.ok) throw new Error('Erro ao registrar');
        return await response.json();
    } catch (error) {
        console.error('❌ Erro:', error);
        return null;
    }
}

async function loginUsuario(email, senha) {
    try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        if (!response.ok) throw new Error('Credenciais inválidas');
        const dados = await response.json();
        // Salvar token no localStorage
        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));
        return dados;
    } catch (error) {
        console.error('❌ Erro:', error);
        return null;
    }
}

function logoutUsuario() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
}

function obterTokenArmazenado() {
    return localStorage.getItem('token');
}

// ==========================================
// EXEMPLO DE USO NO FRONTEND
// ==========================================

/*

// Carregar programas quando página carregar
document.addEventListener('DOMContentLoaded', async () => {
    const programas = await obterProgramas();
    console.log('Programas:', programas);
});

// Login
async function fazerLogin() {
    const resultado = await loginUsuario('usuario@tvelos.com.br', 'senha123');
    if (resultado) {
        console.log('Login bem-sucedido!', resultado.usuario);
    }
}

// Enviar pauta
async function enviarMinhapauta() {
    const resultado = await enviarPauta(
        'Título da Pauta',
        'Descrição detalhada',
        'João Silva',
        'joao@email.com'
    );
    if (resultado) {
        console.log('Pauta enviada!', resultado);
    }
}

*/
