// Obter programas
const programas = await obterProgramas();

// Enviar pauta
await enviarPauta('Minha pauta', 'Descrição', 'João', 'joao@email.com');

// Login
await loginUsuario('email@tvelos.com.br', 'senha');

// Função para abrir e fechar o Modal
function toggleModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.toggle('active');
    }
}

// Lógica de interação por Hover suave (Crossfade de camadas)
document.addEventListener('DOMContentLoaded', function() {
    const heroWrapper = document.getElementById('hero-title-wrapper');
    
    if (heroWrapper) {
        let isGlitching = false; 

        heroWrapper.addEventListener('mouseenter', () => {
            if (isGlitching) return; // Trava a execução se a animação já estiver ocorrendo
            
            isGlitching = true;
            
            // Adiciona a classe que engatilha o fade-in do glitch e fade-out do elástico no CSS
            heroWrapper.classList.add('is-glitching');

            // Mantém a animação por 3 segundos
            setTimeout(() => {
                // Inicia o crossfade reverso (volta ao original)
                heroWrapper.classList.remove('is-glitching');
                
                // Aguarda 600ms (o tempo da transição no CSS) antes de liberar um novo hover
                setTimeout(() => {
                    isGlitching = false; 
                }, 600); 
            }, 3000); 
        });
    }
});
