// Navigation commune - bannières cliquables
function navigateTo(page) {
  window.location.href = page + '.html';
}

// Ajout event listeners bannières sur toutes pages
document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('.header-glow, .header, h1');
  headers.forEach(header => {
    header.style.cursor = 'pointer';
    header.onclick = () => navigateTo('index-complete');
  });
  
  // Bouton logout global
  const logoutBtns = document.querySelectorAll('.logout-btn');
  logoutBtns.forEach(btn => {
    btn.onclick = () => {
      if (confirm('Déconnexion?')) {
        localStorage.removeItem('currentUser');
        navigateTo('login');
      }
    };
  });
});
