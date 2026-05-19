/**
 * TV ELOS - Scripts Globais do Frontend e Telemetria Ativa
 * =======================================================
 */

function alternarTemaGlobal() {
    const atual = localStorage.getItem('tvelos_theme') || 'dark';
    const novo = atual === 'dark' ? 'light' : 'dark';
    localStorage.setItem('tvelos_theme', novo);
    aplicarTemaGlobal(novo);
}

function aplicarTemaGlobal(tema) {
    if (tema === 'light') {
        document.body.classList.add('light-theme');
        document.querySelectorAll('.theme-toggle-btn').forEach(b => b.innerHTML = '🌙');
    } else {
        document.body.classList.remove('light-theme');
        document.querySelectorAll('.theme-toggle-btn').forEach(b => b.innerHTML = '☀️');
    }
    window.dispatchEvent(new CustomEvent('tvelosThemeChanged', { detail: { tema } }));
}

function toggleMenu() {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.toggle('active');
}

function toggleModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}

async function registrarCliqueVideo(id) {
    try {
        await fetch(`/api/programas/${id}/clique`, { method: 'POST' });
    } catch (e) {
        console.error("Erro ao computar clique de engajamento do vídeo:", e);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const temaSalvo = localStorage.getItem('tvelos_theme') || 'dark';
    aplicarTemaGlobal(temaSalvo);

    const token = localStorage.getItem('tvelos_token');
    const usuarioSalvo = localStorage.getItem('tvelos_usuario');

    // ── TELEMETRIA SILENCIOSA DE AUDIÊNCIA E HISTÓRICO DE ACESSOS ──
    setTimeout(async () => {
        try {
            let email = null, nome = null;
            if (usuarioSalvo) {
                const u = JSON.parse(usuarioSalvo);
                email = u.email; nome = u.nome;
            }
            await fetch('/api/acessos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pagina: document.title || window.location.pathname,
                    url: window.location.href,
                    email: email || 'Anônimo',
                    nome: nome || 'Visitante Anônimo'
                })
            });
        } catch (err) {}
    }, 800);

    // ── SUBMISSÃO DE PAUTAS COM VALIDAÇÃO DE ROLE LOGADO ──
    const formPauta = document.getElementById('form-pauta');
    if (formPauta) {
        formPauta.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            // CORREÇÃO DOS ROLES: Bloqueia envio de pauta se não estiver logado
            if (!token) {
                alert('Ação restrita! Por favor, faça login clicando em "Entrar" no topo da página para poder enviar uma pauta.');
                return;
            }

            const titulo = document.getElementById('pauta-titulo').value.trim();
            const descricao = document.getElementById('pauta-descricao').value.trim();
            const btn = formPauta.querySelector('.submit-btn');
            
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            try {
                const res = await fetch('/api/pautas', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ titulo, descricao })
                });
                
                const data = await res.json();
                if (res.ok) {
                    formPauta.reset();
                    const successEl = document.getElementById('pauta-success');
                    if (successEl) {
                        successEl.style.display = 'block';
                        setTimeout(() => { successEl.style.display = 'none'; }, 6000);
                    }
                } else {
                    alert(data.erro || 'Falha ao processar envio.');
                }
            } catch (err) { 
                alert('Erro na comunicação com o servidor.'); 
            } finally { 
                btn.textContent = 'Enviar Pauta'; 
                btn.disabled = false; 
            }
        });
    }

    // ── SUBMISSÃO DE FORMULÁRIO DE CONTATO COM VALIDAÇÃO DE ROLE LOGADO ──
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', async function (e) {
            e.preventDefault();

            // CORREÇÃO DOS ROLES: Bloqueia envio de mensagem se não estiver logado
            if (!token) {
                alert('Ação restrita! É necessário estar logado na plataforma para enviar mensagens de contato.');
                return;
            }

            const assunto = document.getElementById('contato-assunto').value.trim();
            const mensagem = document.getElementById('contato-mensagem').value.trim();
            const btn = formContato.querySelector('.submit-btn');
            
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            try {
                const res = await fetch('/api/contato', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ assunto, mensagem })
                });
                
                if (res.ok) {
                    formContato.reset();
                    const successEl = document.getElementById('contato-success');
                    if (successEl) {
                        successEl.style.display = 'block';
                        setTimeout(() => { successEl.style.display = 'none'; }, 6000);
                    }
                } else {
                    const data = await res.json();
                    alert(data.erro || 'Falha ao enviar mensagem.');
                }
            } catch (e) {
                alert('Erro de rede.');
            } finally { 
                btn.textContent = 'Enviar Mensagem'; 
                btn.disabled = false; 
            }
        });
    }

    if (usuarioSalvo) {
        try { atualizarBotaoLogin(JSON.parse(usuarioSalvo)); } catch (e) {}
    }
});

function atualizarBotaoLogin(usuario) {
    const isAdmin = usuario.role === 'admin';
    const primeiroNome = usuario.nome ? usuario.nome.split(' ')[0] : 'Usuário';

    document.querySelectorAll('.login-btn').forEach(btn => {
        btn.textContent = primeiroNome;
        btn.onclick = function () {
            if (confirm('Deseja encerrar a sua sessão na plataforma?')) {
                localStorage.clear();
                window.location.href = 'index.html';
            }
        };
    });

    const navLists = document.querySelectorAll('nav ul');
    navLists.forEach(ul => {
        if (!ul.querySelector('.painel-link')) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="painel.html" class="painel-link" style="color: var(--accent-color); font-weight:700">${isAdmin ? 'Painel Gerente Admin' : 'Meu Painel'}</a>`;
            const loginLi = ul.querySelector('.login-btn')?.parentElement;
            if (loginLi) ul.insertBefore(li, loginLi);
            else ul.appendChild(li);
        }
    });
}