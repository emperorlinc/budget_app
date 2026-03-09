(function () {
  const EXPENSE_CATS = [
    "housing",
    "food",
    "transport",
    "entertainment",
    "utilities",
  ];

  let transactions = [];
  const STORAGE_KEY = "finance_tracker";
  const BUDGET_KEY = "finance_budgets";

  // default budget limits
  let budgetLimits = {
    housing: 1200,
    food: 600,
    transport: 200,
    entertainment: 150,
    utilities: 250,
  };

  //function to get data from the localStorage.
  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        transactions = JSON.parse(saved);
      } catch (e) {
        transactions = [];
      }
    } else {
      transactions = [
        {
          id: "d1",
          amount: 2800,
          category: "income",
          description: "salary",
          date: getTodayString(),
        },
        {
          id: "d2",
          amount: 95.5,
          category: "food",
          description: "whole foods",
          date: getTodayString(),
        },
        {
          id: "d3",
          amount: 45,
          category: "transport",
          description: "gas",
          date: getTodayString(),
        },
        {
          id: "d4",
          amount: 220,
          category: "utilities",
          description: "electricity",
          date: getTodayString(),
        },
        {
          id: "d5",
          amount: 1300,
          category: "housing",
          description: "rent",
          date: getTodayString(),
        },
        {
          id: "d6",
          amount: 60,
          category: "entertainment",
          description: "streaming+games",
          date: getTodayString(),
        },
        {
          id: "d7",
          amount: 320,
          category: "food",
          description: "restaurant",
          date: getTodayString(),
        },
      ];
    }

    // budgets
    const savedBudgets = localStorage.getItem(BUDGET_KEY);
    if (savedBudgets) {
      try {
        const parsed = JSON.parse(savedBudgets);

        EXPENSE_CATS.forEach((cat) => {
          if (
            parsed[cat] !== undefined &&
            !isNaN(parsed[cat]) &&
            parsed[cat] >= 0
          ) {
            budgetLimits[cat] = parsed[cat];
          }
        });
      } catch (e) {}
    }
  }

  function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }

  function saveBudgets() {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budgetLimits));
  }

  // funtion to get current date
  function getTodayString() {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }

  // function to get totals per category.
  function getCategoryTotals() {
    const totals = {};
    EXPENSE_CATS.forEach((cat) => (totals[cat] = 0));
    transactions.forEach((t) => {
      if (t.category !== "income") {
        totals[t.category] += t.amount;
      }
    });
    return totals;
  }

  // function to get total income.
  function getIncomeTotal() {
    return transactions
      .filter((t) => t.category === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  }

  function render() {
    renderTransactionList();
    renderChartAndTotals();
    renderBudgetInputs();
    updateBudgetAlert();
  }

  function renderTransactionList() {
    const container = document.getElementById("transactionList");
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    if (sorted.length === 0) {
      container.innerHTML =
        '<div style="padding: 1rem 0; color: #94a3b8;">no transactions yet — add one </div>';
    } else {
      let html = "";
      sorted.forEach((t) => {
        const isIncome = t.category === "income";
        const amountClass = isIncome ? "income-amount" : "expense-amount";
        const sign = isIncome ? "" : "-";
        html += `
                        <div class="tx-item" data-id="${t.id}">
                            <div class="tx-left">
                                <span class="tx-desc">${t.description || "—"}</span>
                                <div class="tx-meta">
                                    <span>${t.date}</span>
                                    <span class="tx-cat">${t.category}</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items:center; gap:0.8rem;">
                                <span class="tx-amount ${amountClass}">${sign}$${t.amount.toFixed(2)}</span>
                                <button class="delete-btn" data-id="${t.id}" aria-label="delete">✕</button>
                            </div>
                        </div>
                    `;
      });
      container.innerHTML = html;

      container.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          transactions = transactions.filter((t) => t.id !== id);
          saveTransactions();
          render();
        });
      });
    }

    // update the display of the income total
    document.getElementById("incomeTotalDisplay").innerText =
      `$${getIncomeTotal().toFixed(2)}`;
  }

  // function to calculate and render the bar progress of the expenses.
  function renderChartAndTotals() {
    const totals = getCategoryTotals();
    const maxVal = Math.max(...Object.values(totals), 0.01);
    const container = document.getElementById("chartCategories");

    let chartHtml = "";
    EXPENSE_CATS.forEach((cat) => {
      const amount = totals[cat] || 0;
      const percent = maxVal > 0 ? (amount / maxVal) * 100 : 0;
      chartHtml += `
                    <div class="chart-row">
                        <span class="cat-label">${cat}</span>
                        <div class="bar-container">
                            <div class="bar-wrapper"><div class="bar-fill" style="width: ${percent}%;"></div></div>
                            <span class="bar-value">$${amount.toFixed(2)}</span>
                        </div>
                    </div>
                `;
    });
    container.innerHTML = chartHtml;

    const totalExp = Object.values(totals).reduce((a, b) => a + b, 0);
    const income = getIncomeTotal();
    document.getElementById("totalExpenses").innerText =
      `$${totalExp.toFixed(2)}`;
    document.getElementById("netAmount").innerText =
      `$${(income - totalExp).toFixed(2)}`;
  }

  function renderBudgetInputs() {
    const container = document.getElementById("budgetInputs");
    let html = "";
    EXPENSE_CATS.forEach((cat) => {
      const limit = budgetLimits[cat] || 0;
      html += `
                    <div class="budget-item">
                        <label>${cat}</label>
                        <input type="number" id="budget-${cat}" value="${limit.toFixed(2)}" min="0" step="5" data-cat="${cat}">
                    </div>
                `;
    });
    container.innerHTML = html;

    EXPENSE_CATS.forEach((cat) => {
      const input = document.getElementById(`budget-${cat}`);
      if (input) {
        input.addEventListener("input", (e) => {
          const newVal = parseFloat(e.target.value);
          if (!isNaN(newVal) && newVal >= 0) {
            budgetLimits[cat] = newVal;
            saveBudgets();
            updateBudgetAlert();
          }
        });
      }
    });
  }

  // function to update over/under summary per category.
  function updateBudgetAlert() {
    const totals = getCategoryTotals();
    let overCount = 0;
    let totalOver = 0;
    EXPENSE_CATS.forEach((cat) => {
      const spent = totals[cat] || 0;
      const limit = budgetLimits[cat] || 0;
      if (limit > 0 && spent > limit) {
        overCount++;
        totalOver += spent - limit;
      }
    });

    const alertElement = document.getElementById("budgetAlert");
    if (overCount === 0) {
      alertElement.innerHTML = "all categories under budget · good job!";
      alertElement.className = "budget-summary under-budget";
    } else {
      alertElement.innerHTML = `${overCount} category over by $${totalOver.toFixed(2)} total`;
      alertElement.className = "budget-summary over-budget";
    }
  }

  function setupAddButton() {
    document.getElementById("addBtn").onclick = () => {
      const amount = parseFloat(document.getElementById("amountInput").value);
      const category = document.getElementById("categorySelect").value;
      const desc =
        document.getElementById("descInput").value.trim() || "(no description)";
      const date = document.getElementById("dateInput").value;

      if (!amount || amount <= 0) {
        alert("please enter a positive amount");
        return;
      }
      if (!date) {
        alert("please select a date");
        return;
      }

      const newTx = {
        id: Date.now() + "-" + Math.random().toString(36).substring(2, 8),
        amount: amount,
        category: category,
        description: desc,
        date: date,
      };
      transactions.push(newTx);
      saveTransactions();

      // clear out input fields.
      amountInput.value = "";
      document.getElementById("descInput").value = "";
      document.getElementById("dateInput").value = getTodayString();

      render();
    };
  }

  // function to set date to current date by default.
  function setDefaultDate() {
    document.getElementById("dateInput").value = getTodayString();
  }

  loadFromStorage();
  setDefaultDate();
  render();
  setupAddButton();
})();
