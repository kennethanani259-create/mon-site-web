// SkinGlow Beauty - Script Complet & Auth-Ready ✨💖

let data = {};
let currentAnalysis = {};
let currentProfile = { history: [] };
let roi = { x: 0, y: 0, w: 100, h: 100 };

// Init magique
document.addEventListener('DOMContentLoaded', initGlow);

async function initGlow() {
  await loadMagicData();
  checkAuth();
  setupGlowEvents();
  loadUserProfile();
  renderGlowJourney();
}

// Chargement data complète
async function loadMagicData() {
  try {
    const res = await fetch('data-extended-complete.json');
    data = await res.json();
    console.log('✅ Data magique chargée:', data.products.length, 'produits');
  } catch (e) {
    console.error('❌ Erreur data:', e);
    data = { products: [], routines: { matin: [], soir: [] }, skinTones: {} };
  }
}

// Auth check
function checkAuth() {
  const userId = localStorage.currentUser;
  if (!userId) {
    alert('🔐 Connectez-vous pour utiliser SkinGlow Beauty!');
    window.location.href = 'login.html';
    return false;
  }
  console.log('✅ Utilisateur connecté');
  return true;
}

// Load profil user-spécifique
function loadUserProfile() {
  const userId = localStorage.currentUser;
  const saved = localStorage.getItem(`glowProfile_${userId}`);
  if (saved) {
    currentProfile = JSON.parse(saved);
    showGlowResults();
    showGlowProfile();
    generateGlowRecos();
  }
}


// Events glow (touch + click)
function setupGlowEvents() {
  document.getElementById('photo-input').addEventListener('change', glowPhoto);
  document.getElementById('analyze-btn').addEventListener('click', analyzeGlow);
  document.getElementById('profile-form').addEventListener('submit', saveGlowProfile);
  document.getElementById('apply-filters').addEventListener('click', filterMagic);
  document.getElementById('clear-history').addEventListener('click', resetJourney);
  
  const canvas = document.getElementById('analysis-canvas');
  canvas.addEventListener('click', setGlowROI);
  canvas.addEventListener('touchstart', handleTouchROI, { passive: false });
}


// Photo glow
function glowPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;

  const canvas = document.getElementById('analysis-canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    canvas.style.display = 'block';
    document.getElementById('analyze-btn').disabled = false;
    canvas.style.maxWidth = '90vw';
    canvas.style.maxHeight = '50vh';
  };
  img.src = URL.createObjectURL(file);
}

// ROI glow (click + touch)
function setGlowROI(e) {
  e.preventDefault();
  const canvas = document.getElementById('analysis-canvas');
  const rect = canvas.getBoundingClientRect();
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);
  roi.x = (clientX - rect.left) * (canvas.width / rect.width);
  roi.y = (clientY - rect.top) * (canvas.height / rect.height);
  roi.w = 120;
  roi.h = 120;

  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#ff6b9d';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.strokeRect(roi.x, roi.y, roi.w, roi.h);
}

function handleTouchROI(e) {
  setGlowROI(e.touches[0]);
}


// Analyse teint magique
function analyzeGlow() {
  const canvas = document.getElementById('analysis-canvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(roi.x, roi.y, roi.w, roi.h);
  const pixels = imageData.data;

  // Stats pixels glow
  let r = 0, g = 0, b = 0, brightness = 0, saturation = 0, count = 0;
  
  for (let i = 0; i < pixels.length; i += 4) {
    r += pixels[i];
    g += pixels[i + 1];
    b += pixels[i + 2];
    const hsv = rgbToHsv(pixels[i], pixels[i + 1], pixels[i + 2]);
    brightness += (r + g + b) / 3 / 255;
    saturation += hsv[1];
    count++;
  }

  const avgR = r / count;
  const avgG = g / count;
  const avgB = b / count;
  const avgBright = brightness / count;
  const avgSat = saturation / count;

  // Teint magique
  const teint = avgBright > 0.65 ? 'fair' : avgBright > 0.45 ? 'medium' : 'dark';
  const sousTon = avgR > avgG && avgR > avgB ? 'rose chaud' : avgB > avgR ? 'mauve froid' : 'neutre rosé';

  // Type & problèmes
  const skinType = avgSat > 0.55 ? 'grasse satinée' : avgBright < 0.4 ? 'sèche veloutée' : 'mixte glowy';
  const issues = detectGlowIssues(imageData.data, avgBright, avgSat);

  currentAnalysis = { teint, sousTon, skinType, issues };
  showGlowResults();
  document.querySelector('label[for="goals"]').innerHTML = `Type détecté: <strong>${skinType}</strong>`;
}

// Détection problèmes glow
function detectGlowIssues(pixels, avgBright, avgSat) {
  const issues = [];
  let variance = 0, redLevel = 0, count = pixels.length / 4;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const bright = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3 / 255;
    variance += Math.pow(bright - avgBright, 2);
    redLevel += pixels[i] / 255;
  }
  
  variance = Math.sqrt(variance / count);
  redLevel /= count;
  
  if (variance > 0.18) issues.push('rides fines');
  if (avgSat > 0.6) issues.push('brillance');
  if (redLevel > 0.48) issues.push('rougeurs');
  if (avgSat < 0.28) issues.push('sécheresse');
  
  return issues.length ? issues.slice(0, 2) : ['parfaite'];
}

// Affichage résultats glow
function showGlowResults() {
  const res = document.getElementById('analysis-results');
  const { teint, sousTon, skinType, issues } = currentAnalysis;
  const toneName = data.skinTones[teint]?.[0] || teint;
  
  res.innerHTML = `
    <div class="glow-result">
      <h3>💖 Ton Glow Analysis ✨</h3>
      <div class="glow-badges">
        <span class="glow-badge rose">Teint: ${toneName}</span>
        <span class="glow-badge mauve">Sous-ton: ${sousTon}</span>
        <span class="glow-badge pink">Type: ${skinType}</span>
        <span class="glow-badge sparkle">${issues.join(' + ')}</span>
      </div>
    </div>
  `;
}


// Sauvegarde profil glow (user-specific)
function saveGlowProfile(e) {
  e.preventDefault();
  const userId = localStorage.currentUser;
  currentProfile = {
    ...currentAnalysis,
    goal: document.getElementById('goals').value,
    date: new Date().toLocaleDateString('fr-FR'),
    history: [...(currentProfile.history || []), currentAnalysis].slice(-10)
  };
  
  localStorage.setItem(`glowProfile_${userId}`, JSON.stringify(currentProfile));
  showGlowProfile();
  generateGlowRecos();
}


// Affichage profil
function showGlowProfile() {
  const disp = document.getElementById('profile-display');
  disp.innerHTML = `
    <div class="glow-profile">
      <h3>💕 Ton Glow Actuel ✨</h3>
      <p><strong>Objectif:</strong> ${currentProfile.goal.toUpperCase()} 🌟</p>
      <p><strong>Date:</strong> ${currentProfile.date} 💖</p>
    </div>
  `;
}

// Recommandations magiques
function generateGlowRecos() {
  if (!currentProfile.goal) return;
  
  const { teint, skinType, issues } = currentProfile;
  
  // Routines (fallback)
  const morning = (data.routines?.matin || []).map(step => 
    step.replace('{teint}', data.skinTones[teint]?.[0] || teint)
       .replace('{goal}', currentProfile.goal)
  );
  const evening = (data.routines?.soir || []).map(step => 
    step.replace('{teint}', data.skinTones[teint]?.[0] || teint)
        .replace('{goal}', currentProfile.goal)
  );
  
  const morningEl = document.getElementById('morning-routine');
  const eveningEl = document.getElementById('evening-routine');
  if (morningEl) morningEl.innerHTML = morning.map(item => `<li>${item}</li>`).join('');
  if (eveningEl) eveningEl.innerHTML = evening.map(item => `<li>${item}</li>`).join('');
  
  // Produits magiques (compat new data)
  let recos = data.products.filter(p => 
    (p.tones.includes('all') || p.tones.includes(teint)) && 
    (p.suitableFor.some(t => skinType.toLowerCase().includes(t)) || p.suitableFor.includes('all')) &&
    (p.issues.some(i => issues.map(iss=>iss.toLowerCase()).includes(i.toLowerCase())) || p.issues.includes('all'))
  ).slice(0, 12);
  
  renderGlowProducts(recos);
  renderGlowJourney();
}

// Render produits (new data props)
function renderGlowProducts(products) {
  const productsEl = document.getElementById('products-list');
  if (!productsEl) return;
  productsEl.innerHTML = products.map(p => `
    <div class="glow-product">
      <h4>${p.name}</h4>
      <p><strong>${p.type}</strong> | ${p.brand} | ${p.price === 'low' ? '💸' : p.price === 'medium' ? '💰' : '💎'}</p>
      <p><em>${p.description}</em></p>
    </div>
  `).join('');
}


// Filtre magique
function filterMagic() {
  const price = document.getElementById('price-filter')?.value;
  const brand = document.getElementById('brand-filter')?.value;
  
  let products = data.products.filter(p => 
    (!price || p.price === price) &&
    (!brand || p.brand.toLowerCase().includes(brand.toLowerCase()))
  );
  
  renderGlowProducts(products);
}


// Historique glow
function renderGlowJourney() {
  const tbody = document.querySelector('#history-table tbody');
  tbody.innerHTML = (currentProfile.history || []).map(h => `
    <tr>
      <td>${h.date || '✨'}</td>
      <td>${h.teint || '-'}</td>
      <td>${h.sousTon || '-'}</td>
      <td>${h.skinType || '-'}</td>
      <td>${h.issues?.join(', ') || 'Perfect 💖'}</td>
    </tr>
  `).join('');
}

function resetJourney() {
  currentProfile.history = [];
  localStorage.removeItem('glowProfile');
  renderGlowJourney();
}

// Load profil
function loadMyGlowProfile() {
  const saved = localStorage.getItem('glowProfile');
  if (saved) {
    currentProfile = JSON.parse(saved);
    showGlowResults();
    showGlowProfile();
    generateGlowRecos();
  }
}

// HSV magique
function rgbToHsv(r, g, b) {
  [r, g, b] = [r/255, g/255, b/255];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s = max === 0 ? 0 : (max - min) / max, v = max;
  
  if (max === min) h = 0;
  else if (max === r) h = ((g - b) / (max - min)) * 60;
  else if (max === g) h = ((b - r) / (max - min)) * 60 + 120;
  else h = ((r - g) / (max - min)) * 60 + 240;
  
  return [h < 0 ? h + 360 : h, s, v];
}

