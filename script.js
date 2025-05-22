// Menu mobile toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('closed');
});

// Salvar/recuperar favoritos no localStorage
const tasks = document.querySelectorAll('.task');
const favoritesList = document.getElementById('favoritesList');
const clearFavoritesBtn = document.getElementById('clearFavorites');

function loadFavorites() {
  const saved = JSON.parse(localStorage.getItem('hortaFavorites')) || [];
  tasks.forEach(task => {
    if (saved.includes(task.dataset.id)) {
      task.checked = true;
    }
  });
  updateFavoritesUI();
}

function saveFavorites() {
  const checked = [...tasks].filter(t => t.checked).map(t => t.dataset.id);
  localStorage.setItem('hortaFavorites', JSON.stringify(checked));
  updateFavoritesUI();
}

function updateFavoritesUI() {
  favoritesList.innerHTML = '';
  const saved = JSON.parse(localStorage.getItem('hortaFavorites')) || [];
  if (saved.length === 0) {
    favoritesList.innerHTML = '<li>Você ainda não favoritou nenhuma dica.</li>';
    return;
  }
  saved.forEach(id => {
    const task = [...tasks].find(t => t.dataset.id === id);
    if (task) {
      const li = document.createElement('li');
      li.textContent = task.parentElement.textContent.trim();
      favoritesList.appendChild(li);
    }
  });
}

tasks.forEach(task => {
  task.addEventListener('change', saveFavorites);
});

clearFavoritesBtn.addEventListener('click', () => {
  tasks.forEach(t => (t.checked = false));
  saveFavorites();
});

// Botão voltar ao topo
const btnTop = document.getElementById('btnTop');
window.addEventListener('scroll', () => {
  btnTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});
btnTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// FAQ interativo acessível
const faqButtons = document.querySelectorAll('.faq-question');
faqButtons.forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    // Fecha todas as respostas
    faqButtons.forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      document.getElementById(btn.getAttribute('aria-controls')).hidden = true;
      document.getElementById(btn.getAttribute('aria-controls')).classList.remove('open');
    });
    if (!expanded) {
      button.setAttribute('aria-expanded', 'true');
      const answer = document.getElementById(button.getAttribute('aria-controls'));
      answer.hidden = false;
      answer.classList.add('open');
      answer.focus();
    }
  });
});

// Formulário contato com validação simples e feedback
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!contactForm.nome.value.trim() || !contactForm.mensagem.value.trim()) {
    formFeedback.textContent = 'Por favor, preencha todos os campos.';
    formFeedback.style.color = 'red';
    return;
  }
  formFeedback.style.color = '#2E7D32';
  formFeedback.textContent = 'Mensagem enviada com sucesso! Obrigado pelo contato.';
  contactForm.reset();
});

// Citações dinâmicas
const quotes = [
  "Plantar uma horta é cultivar esperança e saúde.",
  "Cada semente é um sonho que pode florescer.",
  "Cuide da sua horta como você cuidaria de um amigo.",
  "A natureza nos ensina a paciência e a gratidão.",
  "O verde é o caminho para um corpo e mente saudáveis."
];

const quoteContainer = document.createElement('blockquote');
quoteContainer.style.fontStyle = 'italic';
quoteContainer.style.textAlign = 'center';
quoteContainer.style.marginBottom = '20px';
quoteContainer.textContent = quotes[Math.floor(Math.random() * quotes.length)];
document.querySelector('main').insertBefore(quoteContainer, document.querySelector('main').firstChild);

// Calendário simples
const calendar = document.getElementById('calendar');
const plantioTips = {
  0: ['Semeie alface, rúcula e cenoura'],
  1: ['Prepare o solo para ervas e hortaliças'],
  2: ['Ideal para plantar tomates e pimentas'],
  3: ['Cuide da irrigação constante'],
  4: ['Colheita de folhas verdes'],
  5: ['Fertilize com composto orgânico'],
  6: ['Rotacione culturas para melhorar o solo'],
  7: ['Semear feijão e ervilha'],
  8: ['Podar e limpar a horta'],
  9: ['Preparo para plantar alho e cebola'],
  10: ['Colheita de raízes'],
  11: ['Faça compostagem com restos']
};

function createCalendar() {
  calendar.innerHTML = '';
  const now = new Date();
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  // Header dias da semana
  days.forEach(d => {
    const dayHeader = document.createElement('div');
    dayHeader.textContent = d;
    dayHeader.style.fontWeight = 'bold';
    calendar.appendChild(dayHeader);
  });
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Espaços vazios antes do primeiro dia
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    calendar.appendChild(emptyDiv);
  }
  // Dias do mês
  for (let d = 1; d <= daysInMonth; d++) {
    const dayDiv = document.createElement('div');
    dayDiv.textContent = d;
    dayDiv.classList.add('day');
    // Destaque para o dia atual
    if (d === now.getDate()) {
      dayDiv.classList.add('today');
    }
    // Dica de plantio no dia correspondente (ex: um por mês só para exemplo)
    if (plantioTips[month]) {
      dayDiv.title = plantioTips[month][0];
      dayDiv.classList.add('task-day');
      dayDiv.tabIndex = 0;
      dayDiv.setAttribute('aria-label', `Dia ${d}: ${plantioTips[month][0]}`);
    }
    calendar.appendChild(dayDiv);
  }
}

createCalendar();

// Clima: API OpenWeather (requiere chave própria para produção)
// Vou usar fetch para localização por IP e API pública de demo

const weatherDiv = document.getElementById('weather');
const getWeatherBtn = document.getElementById('getWeather');

async function fetchWeather() {
  weatherDiv.textContent = 'Carregando previsão do tempo...';
  try {
    // Obtém localização aproximada por IP via API pública
    const ipRes = await fetch('https://ipapi.co/json/');
    const ipData = await ipRes.json();
    const lat = ipData.latitude;
    const lon = ipData.longitude;

    // Consulta OpenWeather API com chave demo (replace com sua chave para produção)
    const apiKey = 'b6907d289e10d714a6e88b30761fae22'; // API demo openweather.org
    const url = `https://samples.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    const weatherRes = await fetch(url);
    const weatherData = await weatherRes.json();

    weatherDiv.innerHTML = `
      <p><strong>Localização:</strong> ${weatherData.name}</p>
      <p><strong>Temperatura:</strong> ${weatherData.main.temp}°C</p>
      <p><strong>Condição:</strong> ${weatherData.weather[0].description}</p>
      <p><strong>Vento:</strong> ${weatherData.wind.speed} m/s</p>
    `;
  } catch (error) {
    weatherDiv.textContent = 'Não foi possível obter a previsão do tempo.';
  }
}

getWeatherBtn.addEventListener('click', fetchWeather);

// Carrega clima automaticamente ao abrir
fetchWeather();
