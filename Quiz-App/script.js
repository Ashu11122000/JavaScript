const loadingScreen = document.getElementById('loading-screen');
const toastContainer = document.getElementById('toast-container');

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const themeToggle = document.getElementById('theme-toggle');
const soundToggle = document.getElementById('sound-toggle');

const playerNameInput = document.getElementById('player-name');
const categorySelect = document.getElementById('quiz-category');
const difficultySelect = document.getElementById('quiz-difficulty');
const questionCountSelect = document.getElementById('question-count');

const instantFeedbackToggle = document.getElementById('instant-feedback');
const shuffleQuestionsToggle = document.getElementById('shuffle-questions');
const shuffleAnswersToggle = document.getElementById('shuffle-answers');
const enableTimerToggle = document.getElementById('enable-timer');
const showHintsToggle = document.getElementById('show-hints');

const startQuizBtn = document.getElementById('start-quiz-btn');

const questionCounter = document.getElementById('question-counter');
const progressPercent = document.getElementById('progress-percent');
const progressBar = document.getElementById('progress-bar');
const timerDisplay = document.getElementById('timer-display');

const liveScore = document.getElementById('live-score');
const correctCount = document.getElementById('correct-count');
const wrongCount = document.getElementById('wrong-count');
const unansweredCount = document.getElementById('unanswered-count');

const questionCategoryBadge = document.getElementById('question-category-badge');
const difficultyBadge = document.getElementById('difficulty-badge');
const questionText = document.getElementById('question-text');
const hintBox = document.getElementById('hint-box');
const hintText = document.getElementById('hint-text');
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message');

const lifeline5050Btn = document.getElementById('lifeline-5050');
const lifelineSkipBtn = document.getElementById('lifeline-skip');
const lifelineExtraTimeBtn = document.getElementById('lifeline-extra-time');
const showHintBtn = document.getElementById('show-hint-btn');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitQuizBtn = document.getElementById('submit-quiz-btn');

const questionGrid = document.getElementById('question-grid');
const flagQuestionBtn = document.getElementById('flag-question-btn');
const reviewAnswersBtn = document.getElementById('review-answers-btn');
const bestScore = document.getElementById('best-score');

const resultTitle = document.getElementById('result-title');
const resultSubtitle = document.getElementById('result-subtitle');
const finalPercentage = document.getElementById('final-percentage');
const playerResultName = document.getElementById('player-result-name');
const gradeDisplay = document.getElementById('grade-display');
const passFailStatus = document.getElementById('pass-fail-status');

const totalQuestionsResult = document.getElementById('total-questions-result');
const correctResult = document.getElementById('correct-result');
const wrongResult = document.getElementById('wrong-result');
const unansweredResult = document.getElementById('unanswered-result');
const finalScorePoints = document.getElementById('final-score-points');
const bestScoreResult = document.getElementById('best-score-result');

const reviewResultBtn = document.getElementById('review-result-btn');
const downloadResultBtn = document.getElementById('download-result-btn');
const restartQuizBtn = document.getElementById('restart-quiz-btn');

const leaderboardList = document.getElementById('leaderboard-list');
const clearLeaderboardBtn = document.getElementById('clear-leaderboard-btn');

const reviewModal = document.getElementById('review-modal');
const closeReviewModal = document.getElementById('close-review-modal');
const reviewList = document.getElementById('review-list');

const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const completeSound = document.getElementById('complete-sound');
const clickSound = document.getElementById('click-sound');

const STORAGE_KEYS = {
    THEME: 'quiz_theme',
    BEST_SCORE: 'quiz_best_score',
    LEADERBOARD: 'quiz_leaderboard',
    SETTINGS: 'quiz_settings'
};

const DEFAULT_TIME_PER_QUESTION = 15;

const appState = {
    playerName: '',
    category: 'javascript',
    difficulty: 'easy',
    questionCount: 10,
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [],
    flaggedQuestions: [],
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    timer: null,
    timeLeft: DEFAULT_TIME_PER_QUESTION,
    isMuted: false,
    quizCompleted: false,
    settings: {
        instantFeedback: false,
        shuffleQuestions: true,
        shuffleAnswers: true,
        enableTimer: true,
        showHints: true
    },
    lifelinesUsed: {
        fiftyFifty: false,
        skip: false,
        extraTime: false
    }
};

const questionBank = {
    javascript: [
        {
            question: 'Which keyword is used to declare a block-scoped variable?',
            options: ['var', 'let', 'define', 'constvar'],
            answer: 'let',
            hint: 'Introduced in ES6.'
        },
        {
            question: 'Which method converts JSON string into JavaScript object?',
            options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.objectify()'],
            answer: 'JSON.parse()',
            hint: 'Used when reading stored JSON.'
        },
        {
            question: 'Which array method creates a new filtered array?',
            options: ['map()', 'reduce()', 'filter()', 'find()'],
            answer: 'filter()',
            hint: 'Returns elements matching condition.'
        },
        {
            question: 'What does DOM stand for?',
            options: ['Document Object Model', 'Data Object Management', 'Document Oriented Method', 'Dynamic Object Mapping'],
            answer: 'Document Object Model',
            hint: 'Browser page structure.'
        },
        {
            question: 'Which operator checks both value and type?',
            options: ['==', '=', '===', '!='],
            answer: '===',
            hint: 'Strict comparison.'
        }
    ],

    html: [
        {
            question: 'Which HTML tag creates a hyperlink?',
            options: ['<link>', '<a>', '<href>', '<url>'],
            answer: '<a>',
            hint: 'Anchor tag.'
        },
        {
            question: 'Which semantic tag represents navigation links?',
            options: ['<section>', '<nav>', '<header>', '<aside>'],
            answer: '<nav>',
            hint: 'Used for menus.'
        },
        {
            question: 'Which tag is used for inserting an image?',
            options: ['<image>', '<img>', '<pic>', '<src>'],
            answer: '<img>',
            hint: 'Self-closing image tag.'
        }
    ],

    css: [
        {
            question: 'Which CSS property changes text color?',
            options: ['font-color', 'text-color', 'color', 'font-style'],
            answer: 'color',
            hint: 'Simple property name.'
        },
        {
            question: 'Which layout system uses rows and columns?',
            options: ['Flexbox', 'Grid', 'Float', 'Position'],
            answer: 'Grid',
            hint: '2D layout system.'
        },
        {
            question: 'Which property creates rounded corners?',
            options: ['corner-radius', 'border-round', 'radius', 'border-radius'],
            answer: 'border-radius',
            hint: 'Very commonly used.'
        }
    ],

    general: [
        {
            question: 'What is the capital of France?',
            options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
            answer: 'Paris',
            hint: 'City of lights.'
        },
        {
            question: 'Which planet is known as the Red Planet?',
            options: ['Mars', 'Earth', 'Jupiter', 'Venus'],
            answer: 'Mars',
            hint: 'Named after Roman god.'
        }
    ],

    aptitude: [
        {
            question: 'What is 25% of 200?',
            options: ['25', '50', '75', '100'],
            answer: '50',
            hint: 'Quarter of 200.'
        },
        {
            question: 'If 5 + 3 × 2 = ?',
            options: ['16', '11', '10', '13'],
            answer: '11',
            hint: 'BODMAS.'
        }
    ]
};

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function playSound(audioElement) {
    if (appState.isMuted || !audioElement) return;

    audioElement.currentTime = 0;
    audioElement.play().catch(() => {});
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key, fallback) {
    const value = localStorage.getItem(key);

    if (!value) return fallback;

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function shuffleArray(array) {
    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];
    }

    return newArray;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function getGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
}

function getQuizQuestions(category, count) {
    let questions = [];

    if (category === 'mixed') {
        questions = [
            ...questionBank.javascript,
            ...questionBank.html,
            ...questionBank.css,
            ...questionBank.general,
            ...questionBank.aptitude
        ];
    } else {
        questions = [...(questionBank[category] || [])];
    }

    if (appState.settings.shuffleQuestions) {
        questions = shuffleArray(questions);
    }

    questions = questions.slice(0, count);

    if (appState.settings.shuffleAnswers) {
        questions = questions.map((question) => ({
            ...question,
            options: shuffleArray(question.options)
        }));
    }

    return questions;
}

function loadSavedPreferences() {
    const savedTheme = getFromStorage(STORAGE_KEYS.THEME, 'light');
    const savedBestScore = getFromStorage(STORAGE_KEYS.BEST_SCORE, 0);
    const savedSettings = getFromStorage(STORAGE_KEYS.SETTINGS, null);

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }

    bestScore.textContent = `${savedBestScore}%`;
    bestScoreResult.textContent = `${savedBestScore}%`;

    if (savedSettings) {
        appState.settings = savedSettings;

        instantFeedbackToggle.checked = savedSettings.instantFeedback;
        shuffleQuestionsToggle.checked = savedSettings.shuffleQuestions;
        shuffleAnswersToggle.checked = savedSettings.shuffleAnswers;
        enableTimerToggle.checked = savedSettings.enableTimer;
        showHintsToggle.checked = savedSettings.showHints;
    }
}

function showScreen(screen) {
    startScreen.classList.remove('active-screen');
    quizScreen.classList.remove('active-screen');
    resultScreen.classList.remove('active-screen');

    screen.classList.add('active-screen');
}

function resetQuizState() {
    clearInterval(appState.timer);

    appState.questions = [];
    appState.currentQuestionIndex = 0;
    appState.selectedAnswers = [];
    appState.flaggedQuestions = [];
    appState.score = 0;
    appState.correctAnswers = 0;
    appState.wrongAnswers = 0;
    appState.timeLeft = DEFAULT_TIME_PER_QUESTION;
    appState.quizCompleted = false;

    appState.lifelinesUsed = {
        fiftyFifty: false,
        skip: false,
        extraTime: false
    };

    feedbackMessage.classList.add('hidden');
    hintBox.classList.add('hidden');

    lifeline5050Btn.disabled = false;
    lifelineSkipBtn.disabled = false;
    lifelineExtraTimeBtn.disabled = false;
    showHintBtn.disabled = false;
}

function saveSettings() {
    appState.settings = {
        instantFeedback: instantFeedbackToggle.checked,
        shuffleQuestions: shuffleQuestionsToggle.checked,
        shuffleAnswers: shuffleAnswersToggle.checked,
        enableTimer: enableTimerToggle.checked,
        showHints: showHintsToggle.checked
    };

    saveToStorage(STORAGE_KEYS.SETTINGS, appState.settings);
}

function initializeQuiz() {
    saveSettings();

    const playerName = playerNameInput.value.trim();

    if (!playerName) {
        showToast('Please enter your name.', 'warning');
        return;
    }

    resetQuizState();

    appState.playerName = playerName;
    appState.category = categorySelect.value;
    appState.difficulty = difficultySelect.value;
    appState.questionCount = Number(questionCountSelect.value);

    appState.questions = getQuizQuestions(
        appState.category,
        appState.questionCount
    );

    if (!appState.questions.length) {
        showToast('No questions available for selected category.', 'error');
        return;
    }

    appState.selectedAnswers = new Array(appState.questions.length).fill(null);

    updateLiveStats();
    generateQuestionNavigator();
    renderQuestion();
    showScreen(quizScreen);

    playSound(clickSound);
    showToast(`Welcome ${appState.playerName}! Quiz started.`);
}

function renderQuestion() {
    clearInterval(appState.timer);

    const currentQuestion =
        appState.questions[appState.currentQuestionIndex];

    if (!currentQuestion) return;

    questionCategoryBadge.textContent =
        capitalize(appState.category);

    difficultyBadge.textContent =
        capitalize(appState.difficulty);

    questionText.textContent = currentQuestion.question;

    hintText.textContent = currentQuestion.hint || 'No hint available.';
    hintBox.classList.add('hidden');

    feedbackMessage.classList.add('hidden');
    feedbackMessage.classList.remove('error');

    renderOptions(currentQuestion);
    updateProgress();
    updateNavigationButtons();
    updateQuestionNavigator();

    if (appState.settings.enableTimer) {
        startTimer();
    } else {
        timerDisplay.textContent = '--';
    }
}

function renderOptions(question) {
    optionsContainer.innerHTML = '';

    const savedAnswer =
        appState.selectedAnswers[appState.currentQuestionIndex];

    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');

        optionBtn.className = 'option-btn';
        optionBtn.dataset.option = index;
        optionBtn.textContent = option;

        if (savedAnswer === option) {
            optionBtn.classList.add('selected');
        }

        optionBtn.addEventListener('click', () => {
            selectAnswer(option, optionBtn);
        });

        optionsContainer.appendChild(optionBtn);
    });
}

function selectAnswer(selectedOption, clickedButton) {
    const currentQuestion =
        appState.questions[appState.currentQuestionIndex];

    const previousAnswer =
        appState.selectedAnswers[appState.currentQuestionIndex];

    appState.selectedAnswers[appState.currentQuestionIndex] =
        selectedOption;

    document
        .querySelectorAll('.option-btn')
        .forEach((btn) => btn.classList.remove('selected'));

    clickedButton.classList.add('selected');

    if (
        appState.settings.instantFeedback &&
        previousAnswer === null
    ) {
        if (selectedOption === currentQuestion.answer) {
            clickedButton.classList.add('correct');
            feedbackMessage.textContent = 'Correct Answer!';
            feedbackMessage.classList.remove('hidden');
            playSound(correctSound);
        } else {
            clickedButton.classList.add('wrong');
            feedbackMessage.textContent =
                `Wrong! Correct answer: ${currentQuestion.answer}`;
            feedbackMessage.classList.add('error');
            feedbackMessage.classList.remove('hidden');
            playSound(wrongSound);
        }
    }

    updateLiveStats();
    updateQuestionNavigator();
}

function updateProgress() {
    const current = appState.currentQuestionIndex + 1;
    const total = appState.questions.length;
    const percent = Math.round((current / total) * 100);

    questionCounter.textContent =
        `Question ${current} / ${total}`;

    progressPercent.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
}

function updateNavigationButtons() {
    prevBtn.disabled = appState.currentQuestionIndex === 0;

    nextBtn.disabled =
        appState.currentQuestionIndex ===
        appState.questions.length - 1;
}

function updateLiveStats() {
    let correct = 0;
    let wrong = 0;

    appState.questions.forEach((question, index) => {
        const answer = appState.selectedAnswers[index];

        if (answer === null) return;

        if (answer === question.answer) {
            correct++;
        } else {
            wrong++;
        }
    });

    const unanswered =
        appState.questions.length - (correct + wrong);

    appState.correctAnswers = correct;
    appState.wrongAnswers = wrong;
    appState.score = correct * 10;

    liveScore.textContent = appState.score;
    correctCount.textContent = correct;
    wrongCount.textContent = wrong;
    unansweredCount.textContent = unanswered;
}

function startTimer() {
    appState.timeLeft = getTimeByDifficulty();
    timerDisplay.textContent = `${appState.timeLeft}s`;

    appState.timer = setInterval(() => {
        appState.timeLeft--;

        timerDisplay.textContent =
            `${appState.timeLeft}s`;

        if (appState.timeLeft <= 0) {
            clearInterval(appState.timer);
            handleTimeUp();
        }
    }, 1000);
}

function getTimeByDifficulty() {
    switch (appState.difficulty) {
        case 'easy':
            return 20;
        case 'medium':
            return 15;
        case 'hard':
            return 10;
        default:
            return DEFAULT_TIME_PER_QUESTION;
    }
}

function handleTimeUp() {
    playSound(wrongSound);
    showToast('Time up! Moving to next question.', 'warning');

    if (
        appState.currentQuestionIndex <
        appState.questions.length - 1
    ) {
        appState.currentQuestionIndex++;
        renderQuestion();
    } else {
        finishQuiz();
    }
}

function generateQuestionNavigator() {
    questionGrid.innerHTML = '';

    appState.questions.forEach((_, index) => {
        const pill = document.createElement('button');

        pill.className = 'question-pill';
        pill.textContent = index + 1;

        pill.addEventListener('click', () => {
            appState.currentQuestionIndex = index;
            renderQuestion();
        });

        questionGrid.appendChild(pill);
    });
}

function updateQuestionNavigator() {
    const pills =
        document.querySelectorAll('.question-pill');

    pills.forEach((pill, index) => {
        pill.className = 'question-pill';

        if (index === appState.currentQuestionIndex) {
            pill.classList.add('active');
            return;
        }

        if (appState.flaggedQuestions.includes(index)) {
            pill.classList.add('flagged');
            return;
        }

        if (appState.selectedAnswers[index] !== null) {
            pill.classList.add('answered');
        } else {
            pill.classList.add('unanswered');
        }
    });
}

function goToNextQuestion() {
    if (
        appState.currentQuestionIndex <
        appState.questions.length - 1
    ) {
        appState.currentQuestionIndex++;
        renderQuestion();
        playSound(clickSound);
    }
}

function goToPreviousQuestion() {
    if (appState.currentQuestionIndex > 0) {
        appState.currentQuestionIndex--;
        renderQuestion();
        playSound(clickSound);
    }
}

function toggleFlagQuestion() {
    const currentIndex = appState.currentQuestionIndex;
    const flagIndex =
        appState.flaggedQuestions.indexOf(currentIndex);

    if (flagIndex > -1) {
        appState.flaggedQuestions.splice(flagIndex, 1);
        showToast('Question unflagged.', 'success');
    } else {
        appState.flaggedQuestions.push(currentIndex);
        showToast('Question flagged for review.', 'warning');
    }

    updateQuestionNavigator();
    playSound(clickSound);
}

function useFiftyFifty() {
    if (appState.lifelinesUsed.fiftyFifty) return;

    const currentQuestion =
        appState.questions[appState.currentQuestionIndex];

    const optionButtons =
        document.querySelectorAll('.option-btn');

    const wrongButtons = [];

    optionButtons.forEach((button) => {
        if (button.textContent !== currentQuestion.answer) {
            wrongButtons.push(button);
        }
    });

    const shuffledWrongButtons =
        shuffleArray(wrongButtons);

    shuffledWrongButtons.slice(0, 2).forEach((button) => {
        button.style.visibility = 'hidden';
    });

    appState.lifelinesUsed.fiftyFifty = true;
    lifeline5050Btn.disabled = true;

    showToast('50/50 lifeline used.', 'success');
    playSound(clickSound);
}

function useSkipQuestion() {
    if (appState.lifelinesUsed.skip) return;

    appState.lifelinesUsed.skip = true;
    lifelineSkipBtn.disabled = true;

    showToast('Question skipped.', 'warning');
    playSound(clickSound);

    goToNextQuestion();
}

function useExtraTime() {
    if (
        appState.lifelinesUsed.extraTime ||
        !appState.settings.enableTimer
    ) {
        return;
    }

    appState.timeLeft += 10;
    timerDisplay.textContent = `${appState.timeLeft}s`;

    appState.lifelinesUsed.extraTime = true;
    lifelineExtraTimeBtn.disabled = true;

    showToast('10 seconds added.', 'success');
    playSound(clickSound);
}

function showHint() {
    if (!appState.settings.showHints) {
        showToast('Hints are disabled.', 'warning');
        return;
    }

    hintBox.classList.remove('hidden');
    showHintBtn.disabled = true;

    playSound(clickSound);
}

function calculatePercentage() {
    if (!appState.questions.length) return 0;

    return Math.round(
        (appState.correctAnswers / appState.questions.length) * 100
    );
}

function finishQuiz() {
    clearInterval(appState.timer);

    appState.quizCompleted = true;

    updateLiveStats();

    const percentage = calculatePercentage();
    const grade = getGrade(percentage);
    const best = getFromStorage(
        STORAGE_KEYS.BEST_SCORE,
        0
    );

    if (percentage > best) {
        saveToStorage(
            STORAGE_KEYS.BEST_SCORE,
            percentage
        );
    }

    updateLeaderboard(percentage);
    renderResults(percentage, grade);

    showScreen(resultScreen);

    playSound(completeSound);
    showToast('Quiz completed successfully!');
}

function renderResults(percentage, grade) {
    const unanswered =
        appState.questions.length -
        (appState.correctAnswers + appState.wrongAnswers);

    resultTitle.textContent = 'Quiz Completed!';
    resultSubtitle.textContent =
        'Here is your final performance summary.';

    finalPercentage.textContent = `${percentage}%`;

    playerResultName.textContent =
        `Great job, ${appState.playerName}!`;

    gradeDisplay.textContent = `Grade: ${grade}`;

    passFailStatus.textContent =
        percentage >= 40 ? 'Status: PASS' : 'Status: FAIL';

    totalQuestionsResult.textContent =
        appState.questions.length;

    correctResult.textContent =
        appState.correctAnswers;

    wrongResult.textContent =
        appState.wrongAnswers;

    unansweredResult.textContent =
        unanswered;

    finalScorePoints.textContent =
        appState.score;

    const updatedBest = getFromStorage(
        STORAGE_KEYS.BEST_SCORE,
        0
    );

    bestScoreResult.textContent = `${updatedBest}%`;
    bestScore.textContent = `${updatedBest}%`;

    renderLeaderboard();
}

function updateLeaderboard(score) {
    const leaderboard =
        getFromStorage(
            STORAGE_KEYS.LEADERBOARD,
            []
        );

    leaderboard.push({
        name: appState.playerName,
        score
    });

    leaderboard.sort((a, b) => b.score - a.score);

    const topFive = leaderboard.slice(0, 5);

    saveToStorage(
        STORAGE_KEYS.LEADERBOARD,
        topFive
    );
}

function renderLeaderboard() {
    const leaderboard =
        getFromStorage(
            STORAGE_KEYS.LEADERBOARD,
            []
        );

    leaderboardList.innerHTML = '';

    if (!leaderboard.length) {
        leaderboardList.innerHTML =
            '<div class="leaderboard-item"><span>No scores yet</span><span>--</span></div>';
        return;
    }

    leaderboard.forEach((entry, index) => {
        const item = document.createElement('div');

        item.className = 'leaderboard-item';

        item.innerHTML = `
            <span>#${index + 1} ${entry.name}</span>
            <span>${entry.score}%</span>
        `;

        leaderboardList.appendChild(item);
    });
}

function clearLeaderboard() {
    saveToStorage(
        STORAGE_KEYS.LEADERBOARD,
        []
    );

    renderLeaderboard();

    showToast('Leaderboard cleared.', 'warning');
}

function openReviewModal() {
    reviewList.innerHTML = '';

    appState.questions.forEach((question, index) => {
        const userAnswer =
            appState.selectedAnswers[index];

        const reviewItem =
            document.createElement('div');

        reviewItem.className = 'review-item';

        reviewItem.innerHTML = `
            <h4>Q${index + 1}. ${question.question}</h4>
            <p>
                Your Answer:
                <span class="${
                    userAnswer === question.answer
                        ? 'correct-answer'
                        : 'wrong-answer'
                }">
                    ${userAnswer || 'Not Answered'}
                </span>
            </p>
            <p>
                Correct Answer:
                <span class="correct-answer">
                    ${question.answer}
                </span>
            </p>
        `;

        reviewList.appendChild(reviewItem);
    });

    reviewModal.classList.remove('hidden');
}

function closeModal() {
    reviewModal.classList.add('hidden');
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    const isDark =
        document.body.classList.contains('dark-theme');

    saveToStorage(
        STORAGE_KEYS.THEME,
        isDark ? 'dark' : 'light'
    );

    themeToggle.textContent =
        isDark ? '☀️' : '🌙';

    playSound(clickSound);
}

function toggleSound() {
    appState.isMuted = !appState.isMuted;

    soundToggle.textContent =
        appState.isMuted ? '🔇' : '🔊';

    showToast(
        appState.isMuted
            ? 'Sound muted.'
            : 'Sound enabled.',
        'success'
    );
}

function downloadResult() {
    const percentage = calculatePercentage();

    const content = `
Quiz Result
Player: ${appState.playerName}
Category: ${appState.category}
Difficulty: ${appState.difficulty}
Score: ${appState.score}
Percentage: ${percentage}%
Grade: ${getGrade(percentage)}
`;

    const blob = new Blob(
        [content],
        { type: 'text/plain' }
    );

    const url = URL.createObjectURL(blob);

    const link =
        document.createElement('a');

    link.href = url;
    link.download = 'quiz-result.txt';
    link.click();

    URL.revokeObjectURL(url);

    showToast('Result downloaded.');
}

function restartQuiz() {
    showScreen(startScreen);
    playSound(clickSound);
}

startQuizBtn.addEventListener(
    'click',
    initializeQuiz
);

nextBtn.addEventListener(
    'click',
    goToNextQuestion
);

prevBtn.addEventListener(
    'click',
    goToPreviousQuestion
);

submitQuizBtn.addEventListener(
    'click',
    finishQuiz
);

flagQuestionBtn.addEventListener(
    'click',
    toggleFlagQuestion
);

lifeline5050Btn.addEventListener(
    'click',
    useFiftyFifty
);

lifelineSkipBtn.addEventListener(
    'click',
    useSkipQuestion
);

lifelineExtraTimeBtn.addEventListener(
    'click',
    useExtraTime
);

showHintBtn.addEventListener(
    'click',
    showHint
);

themeToggle.addEventListener(
    'click',
    toggleTheme
);

soundToggle.addEventListener(
    'click',
    toggleSound
);

reviewAnswersBtn.addEventListener(
    'click',
    openReviewModal
);

reviewResultBtn.addEventListener(
    'click',
    openReviewModal
);

closeReviewModal.addEventListener(
    'click',
    closeModal
);

clearLeaderboardBtn.addEventListener(
    'click',
    clearLeaderboard
);

downloadResultBtn.addEventListener(
    'click',
    downloadResult
);

restartQuizBtn.addEventListener(
    'click',
    restartQuiz
);

window.addEventListener('load', () => {
    loadSavedPreferences();
    renderLeaderboard();

    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1500);
});