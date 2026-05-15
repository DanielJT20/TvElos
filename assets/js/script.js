// Função para abrir e fechar o Modal
function toggleModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.toggle('active');
    }
}

// Lógica de Login - conecta com a API do backend
document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.querySelector('#loginModal form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            const submitBtn = loginForm.querySelector('.submit-btn');

            const email = emailInput.value.trim();
            const senha = passwordInput.value;

            submitBtn.textContent = 'Entrando...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('tvelos_token', data.token);
                    localStorage.setItem('tvelos_usuario', JSON.stringify(data.usuario));
                    toggleModal();
                    alert(`Bem-vindo(a), ${data.usuario.nome}!`);
                    atualizarBotaoLogin(data.usuario);
                } else {
                    alert(data.erro || 'Erro ao fazer login. Verifique suas credenciais.');
                }
            } catch (err) {
                alert('Não foi possível conectar ao servidor. Tente novamente.');
            } finally {
                submitBtn.textContent = 'Entrar na Plataforma';
                submitBtn.disabled = false;
            }
        });
    }

    // Atualiza o botão de login se já estiver autenticado
    const usuarioSalvo = localStorage.getItem('tvelos_usuario');
    if (usuarioSalvo) {
        try {
            const usuario = JSON.parse(usuarioSalvo);
            atualizarBotaoLogin(usuario);
        } catch(e) {
            localStorage.removeItem('tvelos_usuario');
            localStorage.removeItem('tvelos_token');
        }
    }

    // Lógica de interação por Hover suave (Crossfade de camadas)
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
    const loginBtns = document.querySelectorAll('.login-btn');
    loginBtns.forEach(btn => {
        btn.textContent = usuario.nome.split(' ')[0];
        btn.onclick = function() {
            if (confirm('Deseja sair da plataforma?')) {
                localStorage.removeItem('tvelos_token');
                localStorage.removeItem('tvelos_usuario');
                location.reload();
            }
        };
    });
}
