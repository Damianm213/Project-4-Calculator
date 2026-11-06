const display = document.querySelector("#display");
const buttons = document.querySelector(".calculator-buttons");

let currentInput = "0";
let storedValue = null;
let pendingOperator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function clearCalculator() {
  currentInput = "0";
  storedValue = null;
  pendingOperator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function enterNumber(number) {
  if (currentInput === "Error" || shouldResetDisplay) {
    currentInput = number;
    shouldResetDisplay = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else if (currentInput.length < 14) {
    currentInput += number;
  }
  updateDisplay();
}

function chooseOperator(operator) {
  if (currentInput === "Error") return;

  const inputValue = Number(currentInput);

  if (pendingOperator !== null && !shouldResetDisplay) {
    const result = calculate(storedValue, inputValue, pendingOperator);
    if (!Number.isFinite(result)) {
      showError();
      return;
    }
    currentInput = formatResult(result);
    storedValue = result;
    updateDisplay();
  } else {
    storedValue = inputValue;
  }

  pendingOperator = operator;
  shouldResetDisplay = true;
}

function calculate(first, second, operator) {
  switch (operator) {
    case "+": return first + second;
    case "-": return first - second;
    case "*": return first * second;
    case "/": return second === 0 ? NaN : first / second;
    default: return second;
  }
}

function formatResult(number) {
  if (!Number.isFinite(number)) return "Error";
  // Avoid long floating-point results such as 0.30000000000000004.
  return String(Number(number.toPrecision(10)));
}

function showError() {
  currentInput = "Error";
  storedValue = null;
  pendingOperator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function getResult() {
  if (pendingOperator === null || storedValue === null || currentInput === "Error") {
    return;
  }

  const result = calculate(storedValue, Number(currentInput), pendingOperator);
  if (!Number.isFinite(result)) {
    showError();
    return;
  }

  currentInput = formatResult(result);
  storedValue = null;
  pendingOperator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function backspace() {
  if (currentInput === "Error" || shouldResetDisplay) {
    currentInput = "0";
    shouldResetDisplay = false;
  } else {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    if (currentInput === "-") currentInput = "0";
  }
  updateDisplay();
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    enterNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "clear") {
    clearCalculator();
  } else if (button.dataset.action === "backspace") {
    backspace();
  } else if (button.dataset.action === "equals") {
    getResult();
  }
});

updateDisplay();
