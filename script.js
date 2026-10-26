(() => {
  const expressionDisplay = document.getElementById("expression");
  const resultDisplay = document.getElementById("result");
  const dialog = document.getElementById("premium-dialog");
  const closeButton = document.getElementById("close-button");
  const checkoutNote = document.getElementById("checkout-note");
  let expression = "";
  let isLocked = false;

  const render = () => {
    expressionDisplay.textContent = expression
      .replace(/\*/g, " × ")
      .replace(/\//g, " ÷ ")
      .replace(/\+/g, " + ")
      .replace(/-/g, " − ");
    resultDisplay.textContent = isLocked ? "NA" : (expression || "0");
    resultDisplay.classList.toggle("locked", isLocked);
  };

  const enterValue = (value) => {
    if (isLocked) {
      expression = "";
      isLocked = false;
    }
    if (value === ".") {
      const currentNumber = expression.split(/[+\-*/%]/).pop();
      if (currentNumber.includes(".")) return;
      if (!currentNumber) expression += "0";
    }
    if ("+-*/%".includes(value)) {
      if (!expression && value !== "-") return;
      if (/[+\-*/%]$/.test(expression)) {
        expression = expression.slice(0, -1);
      }
    }
    expression += value;
    render();
  };

  const showPremium = () => {
    if (!expression || /[+\-*/%.]$/.test(expression)) return;
    isLocked = true;
    render();
    checkoutNote.textContent = "";
    dialog.hidden = false;
    closeButton.focus();
  };

  document.querySelector(".keypad").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const { action, value } = button.dataset;
    if (action === "equals") {
      showPremium();
    } else if (action === "clear") {
      expression = "";
      isLocked = false;
      render();
    } else if (action === "backspace") {
      if (isLocked) isLocked = false;
      expression = expression.slice(0, -1);
      render();
    } else if (value) {
      enterValue(value);
    }
  });

  closeButton.addEventListener("click", () => {
    dialog.hidden = true;
  });

  document.querySelectorAll(".plan .upgrade").forEach((button) => {
    button.addEventListener("click", () => {
      checkoutNote.textContent = `${button.dataset.plan} Premium checkout is not connected yet.`;
    });
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.hidden = true;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dialog.hidden) {
      dialog.hidden = true;
      return;
    }
    if (!dialog.hidden || event.ctrlKey || event.metaKey || event.altKey) return;
    if (/^[0-9.]$/.test(event.key)) enterValue(event.key);
    else if ("+-*/%".includes(event.key)) enterValue(event.key);
    else if (event.key === "Enter" || event.key === "=") showPremium();
    else if (event.key === "Backspace") {
      expression = expression.slice(0, -1);
      isLocked = false;
      render();
    } else if (event.key === "Escape") {
      expression = "";
      isLocked = false;
      render();
    }
  });
})();
