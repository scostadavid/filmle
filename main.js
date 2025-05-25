const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.has("lang") ? (urlParams.get("lang") === "pt" ? "pt" : "en") : "pt";

const i18n = {
  pt: {
    correct: "🎉 Você acertou meu nobre!",
    incorrect: "❌ Errou!",
    close: "Você está quase lá! 💪",
    solved_status: "🎉 Você acertou o desafio de hoje, volte amanhã para um novo desafio no Filmle",
    tweet_text: "🎬 Eu acertei o desafio de hoje no Filmle:",
    next_challenge: "Próximo desafio em: ",
    new_available: "Novo desafio disponível!",
    solved_btn: "Compartilhar no Twitter",
    already_solved: "Você já venceu o desafio de hoje.",
    share_popup: "🎉 Você acertou!",
    about_title: "Sobre o Desafio Filmle",
    about_text: "Adivinhe o filme pelos emojis e dicas! Um novo desafio está disponível todos os dias. Melhore seu conhecimento de cultura pop e desafie seus amigos!",
    input_placeholder: "Digite o nome do filme...",
    popup_title: "🎉 Você acertou!",
    guess_input: "🎯 Adivinhar",
    shutdown_notice: "📅 O Filmle será encerrado no dia 1º de junho de 2025. Obrigado a todos que jogaram!",
  },
  en: {
    correct: "🎉 You guessed my champ!",
    incorrect: "❌ Incorrect!",
    close: "You're so close! 💪",
    solved_status: "🎉 You solved today's challenge, come back tomorrow for a new challenge on Filmle",
    tweet_text: "🎬 I solved today's movie challenge at Filmle:",
    next_challenge: "Next challenge in: ",
    new_available: "New challenge available!",
    solved_btn: "Share on Twitter",
    already_solved: "You already win today challenge.",
    share_popup: "🎉 You guessed it!",
    about_title: "About Filmle Challenge",
    about_text: "Guess the movie from emojis and hints! A new film puzzle is available every day. Improve your pop culture skills and challenge your friends to beat your streak!",
    input_placeholder: "Type the movie name...",
    popup_title: "🎉 You guessed it!",
    guess_input: "🎯 Guess",
    shutdown_notice: "📅 Filmle will shut down on June 1, 2025. Thank you to everyone who played!",
  }
};

function t(key) {
  return i18n[lang][key] || key;
}

let challenge;

const state = {
  currentHint: 0,
  solved: false,
  attempted: false
};

const emojisEl = document.getElementById("emojis");
const hintsEl = document.getElementById("hints");
const inputEl = document.getElementById("guessInput");
const feedbackEl = document.getElementById("feedback");
const submitBtn = document.getElementById("submitGuess");
const countdownEl = document.getElementById("countdown");
// const popup = document.getElementById("winPopup");

function renderEmojis(emojis) {
  emojisEl.innerHTML = "";
  emojis.forEach(emoji => {
    const card = document.createElement("div");
    card.className = "emoji-card";
    card.textContent = emoji;
    emojisEl.appendChild(card);
  });
}

function showHint() {
  const hints = challenge.hints[lang];
  if (state.currentHint < hints.length) {
    const hint = document.createElement("p");
    hint.textContent = hints[state.currentHint];
    hintsEl.appendChild(hint);
    state.currentHint++;
  } else if (state.currentHint === hints.length) {
    const msg = document.createElement("p");
    msg.textContent = t("close");
    hintsEl.appendChild(msg);
    state.currentHint++;
  }
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : 1),
        matrix[i][j - 1] + 1,
        matrix[i - 1][j] + 1
      );
    }
  }
  return matrix[b.length][a.length];
}

function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(the|a|an|o|a|um|uma|os|as|uns|umas)\b/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isCloseEnough(guess, answers) {
  const normGuess = normalize(guess);

  return answers.some(ans => {
    const normAns = normalize(ans);

    // 1. Resposta exata normalizada
    if (normGuess === normAns) return true;

    // 2. Distância de Levenshtein tolerável
    const dist = levenshtein(normGuess, normAns);
    if (dist <= 2) return true;

    // 3. Substring razoável
    if (normGuess.length >= 5 && normAns.includes(normGuess)) return true;

    return false;
  });
}

function checkAnswer() {
  const guess = inputEl.value.trim();
  const answers = challenge.answers[lang];

  if (isCloseEnough(guess, answers)) {
    state.solved = true;
    feedbackEl.textContent = t("correct");
    saveStatus("solved");
    freezeInput();
  } else {
    feedbackEl.textContent = t("incorrect");
    showHint(); 
    if (state.currentHint > challenge.hints[lang].length) {
      saveStatus("failed");
    }
  }

  state.attempted = true;
  inputEl.value = "";
}

function freezeInput() {
  inputEl.disabled = true;
  inputEl.value = challenge.answers[lang][0];
  submitBtn.textContent = t("solved_btn");

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  submitBtn.onclick = () => {
    const text = encodeURIComponent(t("tweet_text"));
    const url = encodeURIComponent(window.location.href);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };
}

function saveStatus(status) {
  document.cookie = `played=${challenge.date}; path=/; expires=${challenge.expiresAt}`;
  document.cookie = `status=${status}; path=/; expires=${challenge.expiresAt}`;
  // if (status === "solved") showWinPopup();
}
function loadStatus() {
  const cookies = Object.fromEntries(
    document.cookie.split("; ").map(c => c.split("="))
  );

  if (cookies.played === challenge.date) {
    const solved = cookies.status === "solved";
    feedbackEl.textContent = solved ? t("solved_status") : "";
    if (solved) {
      freezeInput();
    }
  }
  startCountdown();
}


function startCountdown() {
  const end = new Date(challenge.expiresAt);
  const interval = setInterval(() => {
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) {
      clearInterval(interval);
      countdownEl.textContent = t("new_available");
      localStorage.removeItem("challenge");
    } else {
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      countdownEl.textContent = `${t("next_challenge")}${hours}h ${minutes}m`;
    }
  }, 60000);
}

function updateStaticText() {
  document.getElementById("aboutTitle").textContent = t("about_title");
  document.getElementById("aboutText").textContent = t("about_text");
  document.getElementById("guessInput").placeholder = t("input_placeholder");
  document.getElementById("submitGuess").textContent = t("guess_input");
  document.getElementById("metaDescription").setAttribute("content", t("about_text"));

}

async function loadChallenge() {
  try {
    const res = await fetch("data/challenges.json");
    const data = await res.json();
    const today = new Date().toISOString().split("T")[0];
    challenge = data.find(ch => ch.date === today);
    startGame();
  } catch (err) {
    console.error("Erro ao carregar desafio:", err);
  }
}

function startGame() {
  updateStaticText();
  renderEmojis(challenge.emojis);
  loadStatus(); 
  submitBtn.addEventListener("click", checkAnswer);
}

function setupLanguageSelector() {
  const langSelect = document.getElementById("languageSelect");
  const url = new URL(window.location.href);
  const currentLang = url.searchParams.get("lang") || "pt";
  langSelect.value = currentLang;

  langSelect.onchange = () => {
    url.searchParams.set("lang", langSelect.value);
    window.location.href = url.toString();
  };
}

function showShutdownNotice() {
  const noticeEl = document.getElementById("shutdownNotice");
  noticeEl.textContent = t("shutdown_notice");
  noticeEl.style.background = "#fff3cd";
  noticeEl.style.border = "1px solid #ffeeba";
  noticeEl.style.color = "#856404";
  noticeEl.style.padding = "10px";
  noticeEl.style.margin = "10px auto";
  noticeEl.style.textAlign = "center";
  noticeEl.style.maxWidth = "600px";
  noticeEl.style.borderRadius = "8px";
}


document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSelector();
  showShutdownNotice();
  loadChallenge();
});
