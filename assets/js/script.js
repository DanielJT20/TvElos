// Função para abrir e fechar o Modal
function toggleModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.toggle('active');
}

// Alterna entre as abas de Login e Cadastro
function switchTab(tab) {
    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');
    document.querySelectorAll('.modal-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    if (formLogin)    formLogin.style.display    = tab === 'login'    ? 'block' : 'none';
    if (formCadastro) formCadastro.style.display = tab === 'cadastro' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', function () {

    // ── Abas do modal ──
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // ── LOGIN ──
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

    // ── CADASTRO ──
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function (e) {
            e.preventDefault();
            const nome     = document.getElementById('cadastro-nome').value.trim();
            const email    = document.getElementById('cadastro-email').value.trim();
            const senha    = document.getElementById('cadastro-senha').value;
            const confirmar = document.getElementById('cadastro-confirmar').value;
            const btn = formCadastro.querySelector('.submit-btn');
            if (senha !== confirmar) { alert('As senhas não coincidem.'); return; }
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
                    alert(`Conta criada! Bem-vindo(a), ${data.nome}. Faça login para continuar.`);
                    formCadastro.reset();
                    switchTab('login');
                } else {
                    alert(data.erro || 'Erro ao criar conta.');
                }
            } catch (err) {
                alert('Não foi possível conectar ao servidor.');
            } finally {
                btn.textContent = 'Criar Conta';
                btn.disabled = false;
            }
        });
    }

    // ── ENVIAR PAUTA ──
    const formPauta = document.getElementById('form-pauta');
    if (formPauta) {
        formPauta.addEventListener('submit', async function (e) {
            e.preventDefault();
            const titulo    = document.getElementById('pauta-titulo').value.trim();
            const descricao = document.getElementById('pauta-descricao').value.trim();
            const autor     = document.getElementById('pauta-autor').value.trim();
            const email     = document.getElementById('pauta-email').value.trim();
            const btn = formPauta.querySelector('.submit-btn');
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            try {
                const res = await fetch('/api/pautas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ titulo, descricao, autor, email })
                });
                const data = await res.json();
                if (res.ok) {
                    formPauta.reset();
                    document.getElementById('pauta-success').style.display = 'block';
                    setTimeout(() => { document.getElementById('pauta-success').style.display = 'none'; }, 6000);
                } else {
                    alert(data.erro || 'Erro ao enviar pauta.');
                }
            } catch (err) {
                alert('Não foi possível conectar ao servidor.');
            } finally {
                btn.textContent = 'Enviar Pauta';
                btn.disabled = false;
            }
        });
    }

    // ── FORMULÁRIO DE CONTATO ──
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', async function (e) {
            e.preventDefault();
            const nome     = document.getElementById('contato-nome').value.trim();
            const email    = document.getElementById('contato-email').value.trim();
            const assunto  = document.getElementById('contato-assunto').value.trim();
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
                const data = await res.json();
                if (res.ok) {
                    formContato.reset();
                    document.getElementById('contato-success').style.display = 'block';
                    setTimeout(() => { document.getElementById('contato-success').style.display = 'none'; }, 6000);
                } else {
                    alert(data.erro || 'Erro ao enviar mensagem.');
                }
            } catch (err) {
                alert('Não foi possível conectar ao servidor.');
            } finally {
                btn.textContent = 'Enviar Mensagem';
                btn.disabled = false;
            }
        });
    }

    // ── Animação Hero ──
    const heroWrapper = document.getElementById('hero-title-wrapper');
    if (heroWrapper) {
        let isGlitching = false;
        heroWrapper.addEventListener('mouseenter', () => {
            if (isGlitching) return;
            isGlitching = true;
            heroWrapper.classList.add('is-glitching');
            setTimeout(() => {
                heroWrapper.classList.remove('is-glitching');
                setTimeout(() => { isGlitching = false; }, 600);
            }, 3000);
        });
    }

    // ── Restaura estado de login ──
    const usuarioSalvo = localStorage.getItem('tvelos_usuario');
    if (usuarioSalvo) {
        try { atualizarBotaoLogin(JSON.parse(usuarioSalvo)); }
        catch (e) {
            localStorage.removeItem('tvelos_usuario');
            localStorage.removeItem('tvelos_token');
        }
    }
});

function atualizarBotaoLogin(usuario) {
    const isEquipe = ['editor', 'admin'].includes(usuario.role);
    const primeiroNome = usuario.nome.split(' ')[0];

    // Atualiza o botão de login em todos os headers
    document.querySelectorAll('.login-btn').forEach(btn => {
        btn.textContent = primeiroNome;
        btn.onclick = function () {
            if (confirm('Deseja sair da plataforma?')) {
                localStorage.removeItem('tvelos_token');
                localStorage.removeItem('tvelos_usuario');
                location.reload();
            }
        };
    });

    // Injeta link "Meu Painel" na nav se ainda não existir
    const navLists = document.querySelectorAll('nav ul');
    navLists.forEach(ul => {
        if (!ul.querySelector('.painel-link')) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="painel.html" class="painel-link" style="color: var(--accent-color); font-weight:700">${isEquipe ? 'Painel Admin' : 'Meu Painel'}</a>`;
            // Insere antes do botão de login
            const loginLi = ul.querySelector('.login-btn')?.parentElement;
            if (loginLi) ul.insertBefore(li, loginLi);
            else ul.appendChild(li);
        }
    });
}
