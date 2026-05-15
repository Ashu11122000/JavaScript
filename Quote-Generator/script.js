const loadingScreen = document.getElementById('loading-screen');
const toastContainer = document.getElementById('toast-container');

const themeToggle = document.getElementById('theme-toggle');
const voiceBtn = document.getElementById('voice-btn');

const quoteCategory = document.getElementById('quote-category');
const quoteCount = document.getElementById('quote-count');
const loadingQuote = document.getElementById('loading-quote');

const quoteContent = document.getElementById('quote-content');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteLength = document.getElementById('quote-length');

const newQuoteBtn = document.getElementById('new-quote-btn');
const copyBtn = document.getElementById('copy-btn');
const favoriteBtn = document.getElementById('favorite-btn');
const downloadBtn = document.getElementById('download-btn');

const twitterShareBtn = document.getElementById('twitter-share-btn');
const whatsappShareBtn = document.getElementById('whatsapp-share-btn');
const nativeShareBtn = document.getElementById('native-share-btn');

const categorySelect = document.getElementById('category-select');
const searchInput = document.getElementById('search-input');
const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
const themeSwitch = document.getElementById('theme-switch');

const favoritesList = document.getElementById('favorites-list');
const historyList = document.getElementById('history-list');

const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');

const errorModal = document.getElementById('error-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const retryBtn = document.getElementById('retry-btn');
const errorMessage = document.getElementById('error-message');

const STORAGE_KEYS = {
    THEME: 'quote_theme',
    FAVORITES: 'quote_favorites',
    HISTORY: 'quote_history',
    VIEW_COUNT: 'quote_view_count'
};

const QUOTE_API_URL = 'https://dummyjson.com/quotes/random';

const fallbackQuotes = [
    {
        quote: 'Success is the sum of small efforts repeated daily.',
        author: 'Robert Collier',
        category: 'success'
    },
    {
        quote: 'Discipline is choosing what you want most over what you want now.',
        author: 'Unknown',
        category: 'motivation'
    },
    {
        quote: 'Life is what happens while you are busy making other plans.',
        author: 'John Lennon',
        category: 'life'
    },
    {
        quote: 'Knowledge speaks, but wisdom listens.',
        author: 'Jimi Hendrix',
        category: 'wisdom'
    },
    {
        quote: 'Technology is best when it brings people together.',
        author: 'Matt Mullenweg',
        category: 'technology'
    },
    {
        quote: 'Love all, trust a few, do wrong to none.',
        author: 'William Shakespeare',
        category: 'love'
    },
    {
        quote: 'I am not arguing, I am just explaining why I am right.',
        author: 'Unknown',
        category: 'funny'
    }
];

const appState = {
    currentQuote: null,
    favorites: [],
    history: [],
    viewCount: 0,
    autoRefreshTimer: null,
    isDarkMode: false,
    isSpeaking: false
};

function showToast(message, type = 'success') {
    const toast = document.createElement('div');

    toast.className = 'toast';
    toast.textContent = message;

    if (type === 'error') {
        toast.style.borderLeftColor = '#dc2626';
    }

    if (type === 'success') {
        toast.style.borderLeftColor = '#16a34a';
    }

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function saveToStorage(key, value) {
    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}

function getFromStorage(key, fallback) {
    const data = localStorage.getItem(key);

    if (!data) return fallback;

    try {
        return JSON.parse(data);
    } catch {
        return fallback;
    }
}

function capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function getRandomFallbackQuote(category = 'random') {
    let quotes = [...fallbackQuotes];

    if (category !== 'random') {
        quotes = quotes.filter(
            (item) => item.category === category
        );
    }

    if (!quotes.length) {
        quotes = fallbackQuotes;
    }

    const randomIndex = Math.floor(
        Math.random() * quotes.length
    );

    return quotes[randomIndex];
}

function showLoadingState() {
    loadingQuote.classList.remove('hidden');
    quoteContent.classList.add('hidden');
}

function hideLoadingState() {
    loadingQuote.classList.add('hidden');
    quoteContent.classList.remove('hidden');
}

function showErrorModal(message) {
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden');
}

function hideErrorModal() {
    errorModal.classList.add('hidden');
}

async function fetchRandomQuote() {
    showLoadingState();

    const selectedCategory = categorySelect.value;

    try {
        const response = await fetch(QUOTE_API_URL);

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();

        const quoteData = {
            quote: data.quote,
            author: data.author || 'Unknown Author',
            category:
                selectedCategory === 'random'
                    ? 'random'
                    : selectedCategory
        };

        appState.currentQuote = quoteData;

        updateQuoteUI(quoteData);
        addToHistory(quoteData);
        incrementViewCount();

        hideLoadingState();
    } catch (error) {
        const fallback =
            getRandomFallbackQuote(selectedCategory);

        appState.currentQuote = fallback;

        updateQuoteUI(fallback);
        addToHistory(fallback);
        incrementViewCount();

        hideLoadingState();

        showToast(
            'Using offline fallback quote.',
            'error'
        );
    }
}

function updateQuoteUI(quoteData) {
    quoteText.textContent = `"${quoteData.quote}"`;

    quoteAuthor.textContent =
        `— ${quoteData.author || 'Unknown Author'}`;

    quoteCategory.textContent =
        capitalize(quoteData.category);

    quoteLength.textContent =
        `Length: ${quoteData.quote.length} characters`;

    quoteContent.style.animation = 'none';

    setTimeout(() => {
        quoteContent.style.animation =
            'fadeIn 0.4s ease';
    }, 10);
}

function incrementViewCount() {
    appState.viewCount++;

    quoteCount.textContent =
        appState.viewCount;

    saveToStorage(
        STORAGE_KEYS.VIEW_COUNT,
        appState.viewCount
    );
}

function addToHistory(quoteData) {
    const exists =
        appState.history.some(
            (item) =>
                item.quote === quoteData.quote
        );

    if (exists) return;

    appState.history.unshift(quoteData);

    if (appState.history.length > 10) {
        appState.history.pop();
    }

    saveToStorage(
        STORAGE_KEYS.HISTORY,
        appState.history
    );

    renderHistory();
}

function loadSavedData() {
    appState.favorites = getFromStorage(
        STORAGE_KEYS.FAVORITES,
        []
    );

    appState.history = getFromStorage(
        STORAGE_KEYS.HISTORY,
        []
    );

    appState.viewCount = getFromStorage(
        STORAGE_KEYS.VIEW_COUNT,
        0
    );

    appState.isDarkMode =
        getFromStorage(
            STORAGE_KEYS.THEME,
            false
        );

    quoteCount.textContent =
        appState.viewCount;

    if (appState.isDarkMode) {
        document.body.classList.add('dark-theme');
        themeSwitch.checked = true;
        themeToggle.textContent = '☀️';
    }

    renderFavorites();
    renderHistory();
}

function getQuoteTextForSharing() {
    if (!appState.currentQuote) return '';

    return `"${appState.currentQuote.quote}" — ${appState.currentQuote.author}`;
}

function getFilteredFallbackQuotes(keyword = '') {
    const selectedCategory = categorySelect.value;

    let quotes = [...fallbackQuotes];

    if (selectedCategory !== 'random') {
        quotes = quotes.filter(
            (item) => item.category === selectedCategory
        );
    }

    if (keyword.trim()) {
        const searchTerm = keyword.toLowerCase();

        quotes = quotes.filter(
            (item) =>
                item.quote.toLowerCase().includes(searchTerm) ||
                item.author.toLowerCase().includes(searchTerm)
        );
    }

    return quotes;
}

function fetchFilteredQuote() {
    const keyword = searchInput.value.trim();
    const filteredQuotes = getFilteredFallbackQuotes(keyword);

    if (!filteredQuotes.length) {
        showToast('No matching quotes found.', 'error');
        return;
    }

    const randomIndex = Math.floor(
        Math.random() * filteredQuotes.length
    );

    const selectedQuote = filteredQuotes[randomIndex];

    appState.currentQuote = selectedQuote;

    updateQuoteUI(selectedQuote);
    addToHistory(selectedQuote);
    incrementViewCount();

    showToast('Filtered quote loaded.');
}

async function copyQuote() {
    if (!appState.currentQuote) return;

    try {
        await navigator.clipboard.writeText(
            getQuoteTextForSharing()
        );

        showToast('Quote copied successfully.');
    } catch {
        showToast('Copy failed.', 'error');
    }
}

function toggleFavorite() {
    if (!appState.currentQuote) return;

    const exists =
        appState.favorites.some(
            (item) =>
                item.quote === appState.currentQuote.quote
        );

    if (exists) {
        appState.favorites =
            appState.favorites.filter(
                (item) =>
                    item.quote !== appState.currentQuote.quote
            );

        showToast('Removed from favorites.');
    } else {
        appState.favorites.unshift(appState.currentQuote);

        showToast('Added to favorites.');
    }

    saveToStorage(
        STORAGE_KEYS.FAVORITES,
        appState.favorites
    );

    renderFavorites();
}

function renderFavorites() {
    favoritesList.innerHTML = '';

    if (!appState.favorites.length) {
        favoritesList.innerHTML =
            '<div class="empty-state">No favorite quotes yet.</div>';
        return;
    }

    appState.favorites.forEach((quote) => {
        const item = document.createElement('div');

        item.className = 'favorite-item';

        item.innerHTML = `
            <p>"${quote.quote}"</p>
            <span>— ${quote.author}</span>
        `;

        item.addEventListener('click', () => {
            appState.currentQuote = quote;
            updateQuoteUI(quote);
        });

        favoritesList.appendChild(item);
    });
}

function renderHistory() {
    historyList.innerHTML = '';

    if (!appState.history.length) {
        historyList.innerHTML =
            '<div class="empty-state">No quote history yet.</div>';
        return;
    }

    appState.history.forEach((quote) => {
        const item = document.createElement('div');

        item.className = 'history-item';

        item.innerHTML = `
            <p>"${quote.quote}"</p>
            <span>— ${quote.author}</span>
        `;

        item.addEventListener('click', () => {
            appState.currentQuote = quote;
            updateQuoteUI(quote);
        });

        historyList.appendChild(item);
    });
}

function clearFavorites() {
    appState.favorites = [];

    saveToStorage(
        STORAGE_KEYS.FAVORITES,
        []
    );

    renderFavorites();

    showToast('Favorites cleared.');
}

function clearHistory() {
    appState.history = [];

    saveToStorage(
        STORAGE_KEYS.HISTORY,
        []
    );

    renderHistory();

    showToast('History cleared.');
}

function toggleTheme() {
    appState.isDarkMode =
        !appState.isDarkMode;

    document.body.classList.toggle(
        'dark-theme'
    );

    themeSwitch.checked =
        appState.isDarkMode;

    themeToggle.textContent =
        appState.isDarkMode ? '☀️' : '🌙';

    saveToStorage(
        STORAGE_KEYS.THEME,
        appState.isDarkMode
    );

    showToast('Theme updated.');
}

function startAutoRefresh() {
    clearInterval(
        appState.autoRefreshTimer
    );

    appState.autoRefreshTimer =
        setInterval(() => {
            fetchRandomQuote();
        }, 10000);

    showToast('Auto refresh enabled.');
}

function stopAutoRefresh() {
    clearInterval(
        appState.autoRefreshTimer
    );

    showToast('Auto refresh disabled.');
}

function handleAutoRefreshToggle() {
    if (autoRefreshToggle.checked) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
}

function shareOnTwitter() {
    const text =
        encodeURIComponent(
            getQuoteTextForSharing()
        );

    window.open(
        `https://twitter.com/intent/tweet?text=${text}`,
        '_blank'
    );
}

function shareOnWhatsApp() {
    const text =
        encodeURIComponent(
            getQuoteTextForSharing()
        );

    window.open(
        `https://wa.me/?text=${text}`,
        '_blank'
    );
}

async function nativeShareQuote() {
    if (!navigator.share) {
        showToast(
            'Native sharing not supported.',
            'error'
        );
        return;
    }

    try {
        await navigator.share({
            title: 'Quote',
            text: getQuoteTextForSharing()
        });
    } catch {}
}

function speakQuote() {
    if (!appState.currentQuote) return;

    if (appState.isSpeaking) {
        speechSynthesis.cancel();
        appState.isSpeaking = false;
        voiceBtn.textContent = '🔊';
        return;
    }

    const utterance =
        new SpeechSynthesisUtterance(
            getQuoteTextForSharing()
        );

    appState.isSpeaking = true;
    voiceBtn.textContent = '⏹️';

    utterance.onend = () => {
        appState.isSpeaking = false;
        voiceBtn.textContent = '🔊';
    };

    speechSynthesis.speak(utterance);
}

function downloadQuote() {
    if (!appState.currentQuote) return;

    const content =
        getQuoteTextForSharing();

    const blob = new Blob(
        [content],
        { type: 'text/plain' }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement('a');

    link.href = url;
    link.download = 'quote.txt';
    link.click();

    URL.revokeObjectURL(url);

    showToast('Quote downloaded.');
}

function handleSearch() {
    const keyword = searchInput.value.trim();

    if (!keyword) {
        fetchRandomQuote();
        return;
    }

    fetchFilteredQuote();
}

function handleCategoryChange() {
    searchInput.value = '';
    fetchRandomQuote();
}

function retryFetch() {
    hideErrorModal();
    fetchRandomQuote();
}

function initializeApp() {
    loadSavedData();

    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1500);

    fetchRandomQuote();
}

newQuoteBtn.addEventListener(
    'click',
    fetchRandomQuote
);

copyBtn.addEventListener(
    'click',
    copyQuote
);

favoriteBtn.addEventListener(
    'click',
    toggleFavorite
);

downloadBtn.addEventListener(
    'click',
    downloadQuote
);

twitterShareBtn.addEventListener(
    'click',
    shareOnTwitter
);

whatsappShareBtn.addEventListener(
    'click',
    shareOnWhatsApp
);

nativeShareBtn.addEventListener(
    'click',
    nativeShareQuote
);

voiceBtn.addEventListener(
    'click',
    speakQuote
);

themeToggle.addEventListener(
    'click',
    toggleTheme
);

themeSwitch.addEventListener(
    'change',
    toggleTheme
);

categorySelect.addEventListener(
    'change',
    handleCategoryChange
);

searchInput.addEventListener(
    'input',
    handleSearch
);

autoRefreshToggle.addEventListener(
    'change',
    handleAutoRefreshToggle
);

clearFavoritesBtn.addEventListener(
    'click',
    clearFavorites
);

clearHistoryBtn.addEventListener(
    'click',
    clearHistory
);

closeModalBtn.addEventListener(
    'click',
    hideErrorModal
);

retryBtn.addEventListener(
    'click',
    retryFetch
);

window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    if (key === 'n') {
        fetchRandomQuote();
    }

    if (key === 'c') {
        copyQuote();
    }

    if (key === 'f') {
        toggleFavorite();
    }

    if (key === 't') {
        toggleTheme();
    }

    if (key === 'v') {
        speakQuote();
    }
});

window.addEventListener('beforeunload', () => {
    clearInterval(appState.autoRefreshTimer);

    if (appState.isSpeaking) {
        speechSynthesis.cancel();
    }
});

window.addEventListener(
    'load',
    initializeApp
);