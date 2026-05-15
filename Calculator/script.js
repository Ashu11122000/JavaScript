const expressionDisplay =
    document.getElementById("expressionDisplay");

const resultDisplay =
    document.getElementById("resultDisplay");

const calculatorButtons =
    document.querySelector(".calculator-buttons");

let currentExpression = "";
let currentResult = "0";

function updateDisplay() {
    expressionDisplay.textContent =
        currentExpression || "0";

    resultDisplay.textContent = currentResult;
}

function appendNumber(value) {
    if (
        currentExpression === "0" &&
        value !== "."
    ) {
        currentExpression = value;
    } else {
        currentExpression += value;
    }

    updateDisplay();
}

function appendOperator(operator) {
    if (!currentExpression) {
        return;
    }

    const lastChar =
        currentExpression[currentExpression.length - 1];

    const operators = ["+", "-", "*", "/"];

    if (operators.includes(lastChar)) {
        currentExpression =
            currentExpression.slice(0, -1) + operator;
    } else {
        currentExpression += operator;
    }

    updateDisplay();
}

function clearCalculator() {
    currentExpression = "";
    currentResult = "0";
    updateDisplay();
}

function deleteLastCharacter() {
    currentExpression =
        currentExpression.slice(0, -1);

    if (!currentExpression) {
        currentResult = "0";
    }

    updateDisplay();
}

function calculateResult() {
    if (!currentExpression) {
        return;
    }

    try {
        const result = eval(currentExpression);

        if (!isFinite(result)) {
            currentResult = "Error";
        } else {
            currentResult = result.toString();
            currentExpression = result.toString();
        }
    } catch {
        currentResult = "Error";
    }

    updateDisplay();
}

function handleCalculatorClick(event) {
    const clickedButton =
        event.target.closest("button");

    if (!clickedButton) {
        return;
    }

    const value =
        clickedButton.dataset.value;

    const action =
        clickedButton.dataset.action;

    if (value) {
        if (
            clickedButton.classList.contains(
                "number-btn"
            )
        ) {
            appendNumber(value);
        }

        if (
            clickedButton.classList.contains(
                "operator-btn"
            )
        ) {
            appendOperator(value);
        }
    }

    if (action === "clear") {
        clearCalculator();
    }

    if (action === "delete") {
        deleteLastCharacter();
    }

    if (action === "equals") {
        calculateResult();
    }
}

calculatorButtons.addEventListener(
    "click",
    handleCalculatorClick
);

updateDisplay();

function previewCalculation() {
    if (!currentExpression) {
        currentResult = "0";
        updateDisplay();
        return;
    }

    const lastChar =
        currentExpression[currentExpression.length - 1];

    const operators = ["+", "-", "*", "/"];

    if (operators.includes(lastChar)) {
        return;
    }

    try {
        const previewResult = eval(currentExpression);

        if (isFinite(previewResult)) {
            currentResult =
                previewResult.toString();
        }
    } catch {}
    
    updateDisplay();
}

function togglePlusMinus() {
    if (!currentExpression) {
        return;
    }

    try {
        const value = eval(currentExpression);

        currentExpression = (-value).toString();
        currentResult = currentExpression;

        updateDisplay();
    } catch {}
}

function applyPercentage() {
    if (!currentExpression) {
        return;
    }

    try {
        const value = eval(currentExpression);

        currentExpression =
            (value / 100).toString();

        currentResult = currentExpression;

        updateDisplay();
    } catch {}
}

function appendNumber(value) {
    const lastNumber =
        currentExpression.split(/[+\-*/]/).pop();

    if (value === "." && lastNumber.includes(".")) {
        return;
    }

    if (
        currentExpression === "0" &&
        value !== "."
    ) {
        currentExpression = value;
    } else {
        currentExpression += value;
    }

    previewCalculation();
}

function handleCalculatorClick(event) {
    const clickedButton =
        event.target.closest("button");

    if (!clickedButton) {
        return;
    }

    const value =
        clickedButton.dataset.value;

    const action =
        clickedButton.dataset.action;

    if (value) {
        if (
            clickedButton.classList.contains(
                "number-btn"
            )
        ) {
            appendNumber(value);
        }

        if (
            clickedButton.classList.contains(
                "operator-btn"
            )
        ) {
            appendOperator(value);
        }
    }

    if (action === "clear") {
        clearCalculator();
    }

    if (action === "delete") {
        deleteLastCharacter();
        previewCalculation();
    }

    if (action === "equals") {
        calculateResult();
    }

    if (action === "percent") {
        applyPercentage();
    }

    if (action === "plusminus") {
        togglePlusMinus();
    }
}

function handleKeyboardInput(event) {
    const key = event.key;

    if (
        key >= "0" &&
        key <= "9"
    ) {
        appendNumber(key);
    }

    if (key === ".") {
        appendNumber(".");
    }

    if (
        ["+", "-", "*", "/"].includes(key)
    ) {
        appendOperator(key);
    }

    if (key === "Enter") {
        event.preventDefault();
        calculateResult();
    }

    if (key === "Backspace") {
        deleteLastCharacter();
        previewCalculation();
    }

    if (key === "Escape") {
        clearCalculator();
    }

    if (key === "%") {
        applyPercentage();
    }
}

document.addEventListener(
    "keydown",
    handleKeyboardInput
);

const scientificPanel =
    document.getElementById("scientificPanel");

const modeToggle =
    document.getElementById("modeToggle");

const degRadToggle =
    document.getElementById("degRadToggle");

const angleMode =
    document.getElementById("angleMode");

let isScientificMode = true;
let currentAngleMode = "DEG";

function toRadians(value) {
    return currentAngleMode === "DEG"
        ? value * (Math.PI / 180)
        : value;
}

function factorial(number) {
    if (number < 0 || !Number.isInteger(number)) {
        return NaN;
    }

    let result = 1;

    for (let i = 2; i <= number; i++) {
        result *= i;
    }

    return result;
}

function applyScientificFunction(type) {
    if (!currentExpression) {
        return;
    }

    const value = eval(currentExpression);
    let result;

    switch (type) {
        case "sin":
            result = Math.sin(toRadians(value));
            break;

        case "cos":
            result = Math.cos(toRadians(value));
            break;

        case "tan":
            result = Math.tan(toRadians(value));
            break;

        case "log":
            result = Math.log10(value);
            break;

        case "ln":
            result = Math.log(value);
            break;

        case "sqrt":
            result = Math.sqrt(value);
            break;

        case "square":
            result = Math.pow(value, 2);
            break;

        case "factorial":
            result = factorial(value);
            break;

        case "pi":
            result = Math.PI;
            break;

        case "e":
            result = Math.E;
            break;

        case "abs":
            result = Math.abs(value);
            break;

        case "inverse":
            result = 1 / value;
            break;

        case "exp":
            result = Math.exp(value);
            break;

        case "mod":
            currentExpression += "%";
            previewCalculation();
            return;

        case "power":
            currentExpression += "**";
            updateDisplay();
            return;

        case "open-bracket":
            currentExpression += "(";
            updateDisplay();
            return;

        case "close-bracket":
            currentExpression += ")";
            previewCalculation();
            return;

        default:
            return;
    }

    if (!isFinite(result) || Number.isNaN(result)) {
        currentResult = "Error";
    } else {
        currentExpression = result.toString();
        currentResult = result.toString();
    }

    updateDisplay();
}

function toggleScientificMode() {
    isScientificMode = !isScientificMode;

    scientificPanel.style.display =
        isScientificMode ? "grid" : "none";

    modeToggle.textContent = isScientificMode
        ? "Normal Mode"
        : "Scientific Mode";
}

function toggleAngleMode() {
    currentAngleMode =
        currentAngleMode === "DEG"
            ? "RAD"
            : "DEG";

    angleMode.textContent = currentAngleMode;
    degRadToggle.textContent = currentAngleMode;
}

function handleScientificClick(event) {
    const clickedButton =
        event.target.closest("button");

    if (!clickedButton) {
        return;
    }

    const scientificAction =
        clickedButton.dataset.scientific;

    if (!scientificAction) {
        return;
    }

    applyScientificFunction(scientificAction);
}

scientificPanel.addEventListener(
    "click",
    handleScientificClick
);

modeToggle.addEventListener(
    "click",
    toggleScientificMode
);

degRadToggle.addEventListener(
    "click",
    toggleAngleMode
);

const historyList =
    document.getElementById("historyList");

const emptyHistory =
    document.querySelector(".empty-history");

const memoryStatus =
    document.getElementById("memoryStatus");

const copyResult =
    document.getElementById("copyResult");

const clearHistory =
    document.getElementById("clearHistory");

const themeToggle =
    document.getElementById("themeToggle");

const STORAGE_CALCULATOR =
    "advanced_calculator_state";

const STORAGE_THEME =
    "advanced_calculator_theme";

let calculationHistory = [];
let memoryValue = 0;

function saveCalculatorState() {
    const state = {
        history: calculationHistory,
        memory: memoryValue,
        angleMode: currentAngleMode,
        scientificMode: isScientificMode
    };

    localStorage.setItem(
        STORAGE_CALCULATOR,
        JSON.stringify(state)
    );
}

function loadCalculatorState() {
    const savedState =
        localStorage.getItem(STORAGE_CALCULATOR);

    if (!savedState) {
        return;
    }

    const parsedState = JSON.parse(savedState);

    calculationHistory =
        parsedState.history || [];

    memoryValue =
        parsedState.memory || 0;

    currentAngleMode =
        parsedState.angleMode || "DEG";

    isScientificMode =
        parsedState.scientificMode ?? true;

    angleMode.textContent =
        currentAngleMode;

    degRadToggle.textContent =
        currentAngleMode;

    scientificPanel.style.display =
        isScientificMode ? "grid" : "none";

    modeToggle.textContent =
        isScientificMode
            ? "Normal Mode"
            : "Scientific Mode";

    updateMemoryIndicator();
    renderHistory();
}

function updateMemoryIndicator() {
    memoryStatus.style.opacity =
        memoryValue !== 0 ? "1" : "0.3";
}

function renderHistory() {
    if (calculationHistory.length === 0) {
        historyList.innerHTML = "";
        emptyHistory.style.display = "flex";
        return;
    }

    emptyHistory.style.display = "none";

    historyList.innerHTML =
        calculationHistory
            .slice()
            .reverse()
            .map(
                (item) => `
            <li>
                <span>${item.expression}</span>
                <strong>${item.result}</strong>
            </li>
        `
            )
            .join("");
}

function addToHistory(expression, result) {
    calculationHistory.push({
        expression,
        result
    });

    if (calculationHistory.length > 50) {
        calculationHistory.shift();
    }

    renderHistory();
    saveCalculatorState();
}

function calculateResult() {
    if (!currentExpression) {
        return;
    }

    try {
        const result = eval(currentExpression);

        if (!isFinite(result)) {
            currentResult = "Error";
        } else {
            addToHistory(
                currentExpression,
                result.toString()
            );

            currentResult = result.toString();
            currentExpression =
                result.toString();
        }
    } catch {
        currentResult = "Error";
    }

    updateDisplay();
}

function handleMemoryAction(action) {
    const currentValue =
        parseFloat(currentResult) || 0;

    switch (action) {
        case "mc":
            memoryValue = 0;
            break;

        case "mr":
            currentExpression =
                memoryValue.toString();

            currentResult =
                memoryValue.toString();
            break;

        case "mplus":
            memoryValue += currentValue;
            break;

        case "mminus":
            memoryValue -= currentValue;
            break;

        case "ms":
            memoryValue = currentValue;
            break;

        default:
            return;
    }

    updateMemoryIndicator();
    saveCalculatorState();
    updateDisplay();
}

function handleMemoryClick(event) {
    const clickedButton =
        event.target.closest("button");

    if (!clickedButton) {
        return;
    }

    const action =
        clickedButton.dataset.action;

    handleMemoryAction(action);
}

async function copyCurrentResult() {
    try {
        await navigator.clipboard.writeText(
            currentResult
        );

        copyResult.textContent = "Copied";

        setTimeout(() => {
            copyResult.textContent = "Copy";
        }, 1200);
    } catch {}
}

function clearCalculationHistory() {
    calculationHistory = [];
    renderHistory();
    saveCalculatorState();
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const theme =
        document.body.classList.contains(
            "dark-theme"
        )
            ? "dark"
            : "light";

    localStorage.setItem(
        STORAGE_THEME,
        theme
    );
}

function loadTheme() {
    const savedTheme =
        localStorage.getItem(STORAGE_THEME);

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }
}

copyResult.addEventListener(
    "click",
    copyCurrentResult
);

clearHistory.addEventListener(
    "click",
    clearCalculationHistory
);

document
    .querySelector(".memory-controls")
    .addEventListener(
        "click",
        handleMemoryClick
    );

themeToggle.addEventListener(
    "click",
    toggleTheme
);

loadTheme();
loadCalculatorState();
updateMemoryIndicator();
renderHistory();