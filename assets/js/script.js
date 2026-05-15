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
            if (isGlitching) return;
            
            isGlitching = true;
            
            heroWrapper.classList.add('is-glitching');

            setTimeout(() => {
                heroWrapper.classList.remove('is-glitching');
                
                setTimeout(() => {
                    isGlitching = false; 
                }, 600); 
            }, 3000); 
        });
    }
});
