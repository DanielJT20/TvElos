// Função para abrir e fechar o Modal
function toggleModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.toggle('active');
    }
}

// Alterna entre as abas de Login e Cadastro
function switchTab(tab) {
    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');
    const tabs = document.querySelectorAll('.modal-tab');

    tabs.forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });

    if (formLogin) formLogin.style.display = tab === 'login' ? 'block' : 'none';
    if (formCadastro) formCadastro.style.display = tab === 'cadastro' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', function () {

    // Clique nas abas
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
                    alert(`Bem-vindo(a), ${data.usuario.nome}!`);
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

            const nome = document.getElementById('cadastro-nome').value.trim();
            const email = document.getElementById('cadastro-email').value.trim();
            const senha = document.getElementById('cadastro-senha').value;
            const confirmar = document.getElementById('cadastro-confirmar').value;
            const btn = formCadastro.querySelector('.submit-btn');

            if (senha !== confirmar) {
                alert('As senhas não coincidem.');
                return;
            }

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
                    alert(`Conta criada com sucesso! Bem-vindo(a), ${data.nome}. Faça login para continuar.`);
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

    // Restaura estado de login ao carregar a página
    const usuarioSalvo = localStorage.getItem('tvelos_usuario');
    if (usuarioSalvo) {
        try {
            atualizarBotaoLogin(JSON.parse(usuarioSalvo));
        } catch (e) {
            localStorage.removeItem('tvelos_usuario');
            localStorage.removeItem('tvelos_token');
        }
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
});

function atualizarBotaoLogin(usuario) {
    document.querySelectorAll('.login-btn').forEach(btn => {
        btn.textContent = usuario.nome.split(' ')[0];
        btn.onclick = function () {
            if (confirm('Deseja sair da plataforma?')) {
                localStorage.removeItem('tvelos_token');
                localStorage.removeItem('tvelos_usuario');
                location.reload();
            }
        };
    });
}
