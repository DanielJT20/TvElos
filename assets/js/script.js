/**
 * TV ELOS - Scripts do Frontend
 * ================================
 */

function toggleMenu() {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
}

function toggleModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.toggle('active');
}

function switchTab(tab) {
    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');
    document.querySelectorAll('.modal-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    if (formLogin)    formLogin.style.display    = tab === 'login'    ? 'block' : 'none';
    if (formCadastro) formCadastro.style.display = tab === 'cadastro' ? 'block' : 'none';
}

// NOVA FUNÇÃO: Rastrear cliques em links de vídeos externamente
async function registrarCliqueVideo(id) {
    try {
        await fetch(`/api/programas/${id}/clique`, { method: 'POST' });
    } catch (e) {
        console.error("Erro ao computar clique no vídeo:", e);
    }
}

document.addEventListener('DOMContentLoaded', function () {

    // ── TELEMETRIA DE AUDIÊNCIA AUTOMÁTICA ──
    setTimeout(async () => {
        try {
            const usuarioSalvo = localStorage.getItem('tvelos_usuario');
            let email = null;
            let nome = null;
            if (usuarioSalvo) {
                const u = JSON.parse(usuarioSalvo);
                email = u.email;
                nome = u.nome;
            }
            await fetch('/api/acessos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pagina: document.title || window.location.pathname,
                    url: window.location.href,
                    email: email,
                    nome: nome
                })
            });
        } catch (err) {
            console.error("Erro ao processar tracking de acesso:", err);
        }
    }, 600);

    // Abas do modal
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // LOGIN
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const senha = document.getElementById('login-password').value;
            const btn = formLogin.querySelector('.submit-btn');
            btn.textContent = 'Entrando...';
            btn.disabled = true;
            try {
                const res = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('tvelos_token', data.token);
                    localStorage.setItem('tvelos_usuario', JSON.stringify(data.usuario));
                    toggleModal();
                    atualizarBotaoLogin(data.usuario);
                    location.reload();
                } else {
                    alert(data.erro || 'Credenciais inválidas.');
                }
            } catch (err) {
                alert('Não foi possível conectar ao servidor.');
            } finally {
                btn.textContent = 'Entrar na Plataforma';
                btn.disabled = false;
            }
        });
    }

    // CADASTRO
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function (e) {
            e.preventDefault();
            const nome = document.getElementById('cadastro-nome').value.trim();
            const email = document.getElementById('cadastro-email').value.trim();
            const senha = document.getElementById('cadastro-senha').value;
            const confirmar = document.getElementById('cadastro-confirmar').value;
            if (senha !== confirmar) { alert('As senhas não coincidem.'); return; }
            const btn = formCadastro.querySelector('.submit-btn');
            btn.textContent = 'Criando conta...';
            btn.disabled = true;
            try {
                const res = await fetch('/api/usuarios/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });
                const data = await res.json();
                if (res.ok) {
                    alert(`Conta criada! Bem-vindo(a), ${data.nome}. Faça login.`);
                    formCadastro.reset();
                    switchTab('login');
                } else {
                    alert(data.erro || 'Erro ao criar conta.');
                }
            } catch (err) {
                alert('Conexão falhou.');
            } finally {
                btn.textContent = 'Criar Conta';
                btn.disabled = false;
            }
        });
    }

    // ENVIAR PAUTA
    const formPauta = document.getElementById('form-pauta');
    if (formPauta) {
        formPauta.addEventListener('submit', async function (e) {
            e.preventDefault();
            const titulo = document.getElementById('pauta-titulo').value.trim();
            const descricao = document.getElementById('pauta-descricao').value.trim();
            const autor = document.getElementById('pauta-autor').value.trim();
            const email = document.getElementById('pauta-email').value.trim();
            const btn = formPauta.querySelector('.submit-btn');
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            try {
                const res = await fetch('/api/pautas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ titulo, descricao, autor, email })
                });
                if (res.ok) {
                    formPauta.reset();
                    document.getElementById('pauta-success').style.display = 'block';
                    setTimeout(() => { document.getElementById('pauta-success').style.display = 'none'; }, 6000);
                } else {
                    const d = await res.json();
                    alert(d.erro || 'Erro.');
                }
            } catch (err) { alert('Erro de servidor.'); }
            finally { btn.textContent = 'Enviar Pauta'; btn.disabled = false; }
        });
    }

    // FORM CONTATO
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', async function (e) {
            e.preventDefault();
            const nome = document.getElementById('contato-nome').value.trim();
            const email = document.getElementById('contato-email').value.trim();
            const assunto = document.getElementById('contato-assunto').value.trim();
            const mensagem = document.getElementById('contato-mensagem').value.trim();
            const btn = formContato.querySelector('.submit-btn');
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            try {
                const res = await fetch('/api/contato', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, assunto, mensagem })
                });
                if (res.ok) {
                    formContato.reset();
                    document.getElementById('contato-success').style.display = 'block';
                    setTimeout(() => { document.getElementById('contato-success').style.display = 'none'; }, 6000);
                }
            } catch (e) {}
            finally { btn.textContent = 'Enviar Mensagem'; btn.disabled = false; }
        });
    }

    const usuarioSalvo = localStorage.getItem('tvelos_usuario');
    if (usuarioSalvo) {
        try { atualizarBotaoLogin(JSON.parse(usuarioSalvo)); } catch (e) {}
    }
});

function atualizarBotaoLogin(usuario) {
    const isEquipe = ['editor', 'admin'].includes(usuario.role);
    const primeiroNome = usuario.nome ? usuario.nome.split(' ')[0] : 'Usuário';

    document.querySelectorAll('.login-btn').forEach(btn => {
        btn.textContent = primeiroNome;
        btn.onclick = function () {
            if (confirm('Deseja sair da plataforma?')) {
                localStorage.removeItem('tvelos_token');
                localStorage.removeItem('tvelos_usuario');
                window.location.href = 'index.html';
            }
        };
    });

    const navLists = document.querySelectorAll('nav ul');
    navLists.forEach(ul => {
        if (!ul.querySelector('.painel-link')) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="painel.html" class="painel-link" style="color: var(--accent-color); font-weight:700">${isEquipe ? 'Painel Admin' : 'Meu Painel'}</a>`;
            const loginLi = ul.querySelector('.login-btn')?.parentElement;
            if (loginLi) ul.insertBefore(li, loginLi);
            else ul.appendChild(li);
        }
    });
}