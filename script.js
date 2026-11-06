// Get the calculator screen and all the calculator buttons
const display = document.querySelector("#display");
const buttons = document.querySelector(".calculator-buttons");

// These variables keep track of the numbers and operator being used
let currentInput = "0";
let storedValue = null;
let pendingOperator = null;
let shouldResetDisplay = false;

// Updates the calculator screen with the current number
function updateDisplay() {
  display.textContent = currentInput;
}

// Resets everything back to the starting state
function clearCalculator() {
  currentInput = "0";
  storedValue = null;
  pendingOperator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

// Adds a number when one of the number buttons is clicked
function enterNumber(number) {
  // Start a new number if an operation was just completed
  if (currentInput === "Error" || shouldResetDisplay) {
    currentInput = number;
    shouldResetDisplay = false;
  } 
  // Replace the starting zero with the number clicked
  else if (currentInput === "0") {
    currentInput = number;
  } 
  // Keep adding numbers until the display reaches 14 characters
  else if (currentInput.length < 14) {
    currentInput += number;
  }

  updateDisplay();
}

// Handles which math operation the user wants to perform
function chooseOperator(operator) {
  if (currentInput === "Error") return;

  const inputValue = Number(currentInput);

  // If another operator was already selected, calculate that first
  if (pendingOperator !== null && !shouldResetDisplay) {
    const result = calculate(storedValue, inputValue, pendingOperator);

    // Show an error if the calculation is invalid
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

  // Save the new operator for the next calculation
  pendingOperator = operator;
  shouldResetDisplay = true;
}

// Performs the actual math depending on which operator was selected
function calculate(first, second, operator) {
  switch (operator) {
    case "+": return first + second;
    case "-": return first - second;
    case "*": return first * second;
    case "/": return second === 0 ? NaN : first / second;
    default: return second;
  }
}

// Formats the answer so it doesn't show too many decimal places
function formatResult(number) {
  if (!Number.isFinite(number)) return "Error";

  // Prevents long decimal answers caused by JavaScript calculations
  return String(Number(number.toPrecision(10)));
}

// Displays an error and resets the calculation if something goes wrong
function showError() {
  currentInput = "Error";
  storedValue = null;
  pendingOperator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

// Calculates and displays the final answer when equals is clicked
function getResult() {
  // Do nothing if there isn't an operation to finish
  if (pendingOperator === null || storedValue === null || currentInput === "Error") {
    return;
  }

  const result = calculate(storedValue, Number(currentInput), pendingOperator);

  // Check if the answer is valid before displaying it
  if (!Number.isFinite(result)) {
    showError();
    return;
  }

  currentInput = formatResult(result);

  // Clear the saved operation after getting the answer
  storedValue = null;
  pendingOperator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

// Removes the last digit from the current number
function backspace() {
  if (currentInput === "Error" || shouldResetDisplay) {
    currentInput = "0";
    shouldResetDisplay = false;
  } else {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";

    // Make sure the display doesn't get left with just a minus sign
    if (currentInput === "-") currentInput = "0";
  }

  updateDisplay();
}

// Checks which calculator button was clicked and runs the matching function
buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  // Ignore clicks that aren't on a button
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

// Make sure the calculator starts by displaying zero
updateDisplay();