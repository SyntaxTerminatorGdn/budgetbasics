/**
 * BudgetBasics - Universal Application Bundle
 * NextGen BudgetBee | TechWiz 7
 * Zero-dependency, 100% compatible with both file:// (double-click) and http:// servers.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Centralized DataStore
     ========================================================================== */
  const DataStore = {
    currency: '$',
    currencyRates: {
      '$': 1.0,
      '₹': 83.0,
      '€': 0.92,
      '£': 0.78
    },

    formatMoney(amount) {
      const symbol = this.currency;
      const rate = this.currencyRates[symbol] || 1.0;
      const converted = amount * (symbol === '$' ? 1 : rate);
      if (symbol === '₹') {
        return `₹${Math.round(converted).toLocaleString('en-IN')}`;
      }
      return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    budgetProfiles: [
      {
        id: "dorm_student",
        profileName: "On-Campus Dorm Resident",
        monthlyIncome: 800,
        breakdown: [
          { category: "Food & Meal Plan Top-up", amount: 250, type: "Need" },
          { category: "Dorm Supplies & Laundry", amount: 60, type: "Need" },
          { category: "Course Books & Printing", amount: 50, type: "Need" },
          { category: "Transit Pass", amount: 40, type: "Need" },
          { category: "Weekend Dining & Cafes", amount: 120, type: "Want" },
          { category: "Streaming & Music", amount: 20, type: "Want" },
          { category: "Gaming & Tech Gadgets", amount: 60, type: "Want" },
          { category: "Clothing & Social Events", amount: 40, type: "Want" },
          { category: "Emergency Tech Buffer", amount: 100, type: "Savings" },
          { category: "Summer Travel Fund", amount: 60, type: "Savings" }
        ]
      },
      {
        id: "commuter_student",
        profileName: "College Commuter Student",
        monthlyIncome: 650,
        breakdown: [
          { category: "Public Transit / Metro Pass", amount: 110, type: "Need" },
          { category: "Campus Lunches", amount: 120, type: "Need" },
          { category: "Mobile & Data Plan", amount: 45, type: "Need" },
          { category: "Stationery & Textbooks", amount: 50, type: "Need" },
          { category: "Coffee & Snack Runs", amount: 75, type: "Want" },
          { category: "Social Outings & Cinema", amount: 80, type: "Want" },
          { category: "Gym & Sports Gear", amount: 40, type: "Want" },
          { category: "Laptop Upgrade Savings", amount: 80, type: "Savings" },
          { category: "Emergency Buffer", amount: 50, type: "Savings" }
        ]
      },
      {
        id: "intern_student",
        profileName: "Paid Summer Intern",
        monthlyIncome: 1200,
        breakdown: [
          { category: "Shared Apartment Rent", amount: 450, type: "Need" },
          { category: "Groceries & Cooking", amount: 200, type: "Need" },
          { category: "Commute & Train Fare", amount: 80, type: "Need" },
          { category: "Phone & Utility Share", amount: 70, type: "Need" },
          { category: "Team Dinners & Hangouts", amount: 150, type: "Want" },
          { category: "Professional Attire", amount: 110, type: "Want" },
          { category: "Entertainment & Music", amount: 40, type: "Want" },
          { category: "Tuition Semester Buffer", amount: 150, type: "Savings" },
          { category: "High-Yield Student Savings", amount: 100, type: "Savings" }
        ]
      }
    ],

    quizQuestions: [
      {
        question: "Which of the following represents a true student 'Need'?",
        options: [
          "A premium monthly video game subscription",
          "Mandatory university course textbook rental",
          "Daily iced latte from the commercial coffee shop",
          "Branded designer sneakers for weekend campus events"
        ],
        correctIndex: 1,
        explanation: "Correct! Mandatory textbooks are directly required to pass your coursework and earn your degree. The others are lifestyle wants that can be paused or substituted."
      },
      {
        question: "In the 50-30-20 budgeting framework, what does the 20% represent?",
        options: [
          "20% for entertainment and dining out",
          "20% for emergency cushion and future savings",
          "20% for dorm rent and utilities",
          "20% for impulse shopping and sales"
        ],
        correctIndex: 1,
        explanation: "Spot on! 20% is earmarked for your savings, emergency safety cushion, and future financial goals."
      },
      {
        question: "What is the recommended student strategy when facing an impulse buy?",
        options: [
          "Purchase immediately using a credit card before prices change",
          "Apply the 24-Hour Delay Rule to let emotional urge cool down",
          "Borrow money from a classmate to fund the purchase",
          "Skip groceries for a week to afford the item"
        ],
        correctIndex: 1,
        explanation: "Excellent! The 24-hour delay rule disconnects the emotional dopamine spike and allows rational financial logic to take over."
      }
    ],

    classificationItems: [
      {
        id: 1,
        name: "Dorm Room Rent & Campus Housing",
        emoji: "🏠",
        cost: 350,
        type: "need",
        justification: "Essential shelter and safety required for attending college classes securely."
      },
      {
        id: 2,
        name: "Unlimited Video Game Battle Pass",
        emoji: "🎮",
        cost: 20,
        type: "want",
        justification: "Recreational gaming brings fun, but pausing it won't impact your health or college graduation."
      },
      {
        id: 3,
        name: "Weekly Grocery Essentials (Rice, Veggies, Oats)",
        emoji: "🥦",
        cost: 45,
        type: "need",
        justification: "Basic nutrition is a vital physiological need to stay healthy and focused on your studies."
      },
      {
        id: 4,
        name: "Daily Commercial Specialty Coffee Runs",
        emoji: "☕",
        cost: 5,
        type: "want",
        justification: "A luxury lifestyle habit. Dorm brewing or campus water stations meet hydration needs at 90% less cost."
      },
      {
        id: 5,
        name: "Prescription Medicine & Allergy Inhaler",
        emoji: "💊",
        cost: 30,
        type: "need",
        justification: "Direct health requirement. Medical necessities always take top priority in any budget."
      },
      {
        id: 6,
        name: "Weekend Restaurant Delivery / Takeout",
        emoji: "🍕",
        cost: 28,
        type: "want",
        justification: "Convenience dining. Cooking with roommates or eating cafeteria meals fulfills sustenance at a fraction of the cost."
      },
      {
        id: 7,
        name: "Monthly Student Transit / Metro Pass",
        emoji: "🚌",
        cost: 40,
        type: "need",
        justification: "Transportation mobility needed to reach campus, internship sites, and exams."
      },
      {
        id: 8,
        name: "Designer Brand Winter Jacket (Retail $280)",
        emoji: "🧥",
        cost: 280,
        type: "want",
        justification: "Warmth is a need, but a high-end designer logo is a want. An affordable durable coat fulfills the need."
      }
    ],

    faqChatbot: [
      {
        keywords: ["need", "want", "difference", "essential", "grocery", "rent"],
        answer: "A **Need** is an essential requirement for survival and education (basic food, dorm rent, textbooks, essential transit). A **Want** enhances your lifestyle but isn't required to pass your exams (dining out, video games, streaming). Rule of thumb: If your life or studies pause without it, it's a need!"
      },
      {
        keywords: ["how much", "save", "savings", "percentage", "amount", "monthly"],
        answer: "Under the **50-30-20 rule**, aim for **20%** of your monthly allowance. But if money is tight, saving even **$15 to $25 per month** builds powerful momentum. The habit of consistency matters most!"
      },
      {
        keywords: ["overspend", "overspending", "impulse", "control", "stop spending", "delay"],
        answer: "Use the **24-Hour Delay Rule**: when tempted to buy non-essentials, wait a full day. Also: 1) Shop with a strict written list, 2) Remove saved cards from shopping apps, and 3) Check your remaining balance in our Expense Planner before swiping."
      },
      {
        keywords: ["50", "30", "20", "split", "formula", "ratio"],
        answer: "The **50-30-20 rule** divides income into: **50% for Needs** (rent, food, transit), **30% for Wants** (eating out, entertainment), and **20% for Savings** (emergency fund, tech goals). Use our interactive 50-30-20 Calculator above to try your numbers!"
      },
      {
        keywords: ["emergency", "fund", "buffer", "unexpected", "safety"],
        answer: "An emergency buffer protects you from unexpected shocks like phone repairs or medical needs. Start with an achievable **$250 to $500 starter buffer** before pursuing larger goals."
      },
      {
        keywords: ["subscription", "subscriptions", "recurring", "netflix", "spotify", "cancel"],
        answer: "Review your bank statements on the 1st of every month. Cancel services you haven't used in 14 days, rotate streaming services monthly, and always use student discount rates (like Spotify Student)!"
      },
      {
        keywords: ["latte", "coffee", "small", "daily expenses", "micro", "snack"],
        answer: "The 'Latte Factor' shows how small $4 daily habits quietly drain **$120/month or $1,440/year**. Making coffee in your dorm saves hundreds of dollars every semester!"
      },
      {
        keywords: ["goal", "target", "savings goal", "laptop", "months"],
        answer: "Set **SMART goals**: Specific, Measurable, Achievable, Relevant, and Time-bound. For example, saving $600 for a laptop at $100/month takes 6 months. Try our Savings Goals calculator to plan yours!"
      }
    ]
  };

  /* ==========================================================================
     2. Module 1: Budgeting Basics & Quiz
     ========================================================================== */
  function initBudgetBasics() {
    const profileContainer = document.getElementById('budgetProfileButtons');
    const tableBody = document.getElementById('budgetTableBody');
    const budgetIncomeDisplay = document.getElementById('budgetIncomeDisplay');
    const budgetNeedsTotal = document.getElementById('budgetNeedsTotal');
    const budgetWantsTotal = document.getElementById('budgetWantsTotal');
    const budgetSavingsTotal = document.getElementById('budgetSavingsTotal');

    if (!profileContainer || !tableBody) return;

    profileContainer.innerHTML = DataStore.budgetProfiles.map((p, idx) => `
      <button class="profile-pill-btn ${idx === 0 ? 'active' : ''}" data-profile-id="${p.id}">
        ${p.profileName} (${DataStore.formatMoney(p.monthlyIncome)})
      </button>
    `).join('');

    function loadProfile(profileId) {
      const profile = DataStore.budgetProfiles.find(p => p.id === profileId) || DataStore.budgetProfiles[0];
      
      profileContainer.querySelectorAll('.profile-pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.profileId === profile.id);
      });

      if (budgetIncomeDisplay) {
        budgetIncomeDisplay.textContent = DataStore.formatMoney(profile.monthlyIncome);
      }

      let totalNeeds = 0;
      let totalWants = 0;
      let totalSavings = 0;

      tableBody.innerHTML = profile.breakdown.map(item => {
        let badgeClass = 'badge-need';
        if (item.type === 'Need') totalNeeds += item.amount;
        else if (item.type === 'Want') {
          totalWants += item.amount;
          badgeClass = 'badge-want';
        } else {
          totalSavings += item.amount;
          badgeClass = 'badge-savings';
        }

        const percent = Math.round((item.amount / profile.monthlyIncome) * 100);

        return `
          <tr>
            <td><strong>${item.category}</strong></td>
            <td><span class="badge ${badgeClass}">${item.type}</span></td>
            <td>${DataStore.formatMoney(item.amount)}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div class="progress-track" style="height: 6px; width: 80px; margin: 0;">
                  <div class="progress-fill" style="width: ${percent}%;"></div>
                </div>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${percent}%</span>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      if (budgetNeedsTotal) budgetNeedsTotal.textContent = `${DataStore.formatMoney(totalNeeds)} (${Math.round((totalNeeds/profile.monthlyIncome)*100)}%)`;
      if (budgetWantsTotal) budgetWantsTotal.textContent = `${DataStore.formatMoney(totalWants)} (${Math.round((totalWants/profile.monthlyIncome)*100)}%)`;
      if (budgetSavingsTotal) budgetSavingsTotal.textContent = `${DataStore.formatMoney(totalSavings)} (${Math.round((totalSavings/profile.monthlyIncome)*100)}%)`;
    }

    profileContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.profile-pill-btn');
      if (btn) loadProfile(btn.dataset.profileId);
    });

    loadProfile(DataStore.budgetProfiles[0].id);
    initQuiz();
  }

  function initQuiz() {
    const quizContainer = document.getElementById('quizQuestionWrapper');
    const quizScoreEl = document.getElementById('quizScoreTracker');
    if (!quizContainer) return;

    let currentQuestionIndex = 0;
    let score = 0;

    function renderQuestion(index) {
      const q = DataStore.quizQuestions[index];
      if (!q) {
        quizContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎓🎉</div>
            <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">Knowledge Check Complete!</h3>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
              You scored <strong>${score} / ${DataStore.quizQuestions.length}</strong>! You understand core student budgeting fundamentals.
            </p>
            <button id="restartQuizBtn" class="btn btn-primary">Retake Knowledge Check</button>
          </div>
        `;
        document.getElementById('restartQuizBtn')?.addEventListener('click', () => {
          currentQuestionIndex = 0;
          score = 0;
          renderQuestion(0);
        });
        return;
      }

      if (quizScoreEl) {
        quizScoreEl.textContent = `Question ${index + 1} of ${DataStore.quizQuestions.length} • Score: ${score}`;
      }

      quizContainer.innerHTML = `
        <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">${q.question}</h4>
        <div class="quiz-options">
          ${q.options.map((opt, optIdx) => `
            <button class="quiz-option-btn" data-index="${optIdx}">
              <span style="display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%; background:var(--bg-alt); font-size:0.85rem; font-weight:700;">
                ${String.fromCharCode(65 + optIdx)}
              </span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
        <div id="quizFeedbackBox" class="quiz-feedback-box"></div>
        <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
          <button id="nextQuizBtn" class="btn btn-primary btn-sm" style="display: none;">Next Question →</button>
        </div>
      `;

      const feedbackBox = document.getElementById('quizFeedbackBox');
      const nextBtn = document.getElementById('nextQuizBtn');
      const optionBtns = quizContainer.querySelectorAll('.quiz-option-btn');

      optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          optionBtns.forEach(b => b.disabled = true);
          const selectedIdx = parseInt(btn.dataset.index, 10);
          
          if (selectedIdx === q.correctIndex) {
            btn.classList.add('correct');
            score++;
            feedbackBox.className = 'quiz-feedback-box active';
            feedbackBox.style.background = 'var(--success-light)';
            feedbackBox.style.color = '#065F46';
            feedbackBox.innerHTML = `<strong>✨ Correct!</strong> ${q.explanation}`;
          } else {
            btn.classList.add('incorrect');
            optionBtns[q.correctIndex].classList.add('correct');
            feedbackBox.className = 'quiz-feedback-box active';
            feedbackBox.style.background = 'var(--danger-light)';
            feedbackBox.style.color = '#991B1B';
            feedbackBox.innerHTML = `<strong>❌ Not quite.</strong> ${q.explanation}`;
          }

          if (quizScoreEl) {
            quizScoreEl.textContent = `Question ${index + 1} of ${DataStore.quizQuestions.length} • Score: ${score}`;
          }
          nextBtn.style.display = 'inline-flex';
        });
      });

      nextBtn?.addEventListener('click', () => {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
      });
    }

    renderQuestion(0);
  }

  /* ==========================================================================
     3. Module 2: Needs vs Wants Challenge
     ========================================================================== */
  function initNeedsWants() {
    const cardTitle = document.getElementById('gameItemTitle');
    const cardEmoji = document.getElementById('gameItemEmoji');
    const cardCost = document.getElementById('gameItemCost');
    const cardContext = document.getElementById('gameItemContext');
    const feedbackBox = document.getElementById('gameFeedback');
    const currentItemNum = document.getElementById('gameItemNum');
    const scoreCounter = document.getElementById('gameScore');
    const totalItemsCount = document.getElementById('gameTotalCount');
    
    const btnNeed = document.getElementById('btnClassifyNeed');
    const btnWant = document.getElementById('btnClassifyWant');
    const btnNextItem = document.getElementById('btnNextGameItem');

    if (!cardTitle || !btnNeed || !btnWant) return;

    const items = DataStore.classificationItems;
    let currentIndex = 0;
    let correctCount = 0;

    if (totalItemsCount) totalItemsCount.textContent = items.length;

    function loadItem(index) {
      const item = items[index];
      if (!item) {
        document.getElementById('classificationCardArea').innerHTML = `
          <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">🌟🐝</div>
            <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Classification Challenge Complete!</h3>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
              You correctly classified <strong>${correctCount} out of ${items.length}</strong> student expenses!
            </p>
            <button id="resetClassifierBtn" class="btn btn-primary">Try Again With All Items</button>
          </div>
        `;
        document.getElementById('resetClassifierBtn')?.addEventListener('click', () => {
          location.reload();
        });
        return;
      }

      if (currentItemNum) currentItemNum.textContent = index + 1;
      if (scoreCounter) scoreCounter.textContent = correctCount;

      cardEmoji.textContent = item.emoji;
      cardTitle.textContent = item.name;
      cardCost.textContent = `Typical Cost: ${DataStore.formatMoney(item.cost)}`;
      cardContext.textContent = "Consider: Is this necessary for basic student survival/graduation, or is it a lifestyle choice?";

      feedbackBox.className = 'game-feedback-card';
      feedbackBox.innerHTML = '';
      btnNeed.disabled = false;
      btnWant.disabled = false;
      if (btnNextItem) btnNextItem.style.display = 'none';
    }

    function handleClassification(userChoice) {
      const item = items[currentIndex];
      btnNeed.disabled = true;
      btnWant.disabled = true;

      const isCorrect = userChoice === item.type;
      if (isCorrect) {
        correctCount++;
        if (scoreCounter) scoreCounter.textContent = correctCount;
        feedbackBox.className = 'game-feedback-card active';
        feedbackBox.style.background = 'var(--success-light)';
        feedbackBox.style.color = '#065F46';
        feedbackBox.style.border = '1px solid #10B981';
        feedbackBox.innerHTML = `
          <strong>🎉 Spot on! It is a ${item.type.toUpperCase()}.</strong>
          <p style="margin-top: 0.35rem; font-size: 0.9rem;">${item.justification}</p>
        `;
      } else {
        feedbackBox.className = 'game-feedback-card active';
        feedbackBox.style.background = 'var(--danger-light)';
        feedbackBox.style.color = '#991B1B';
        feedbackBox.style.border = '1px solid #EF4444';
        feedbackBox.innerHTML = `
          <strong>💡 Actually, it's considered a ${item.type.toUpperCase()}.</strong>
          <p style="margin-top: 0.35rem; font-size: 0.9rem;">${item.justification}</p>
        `;
      }

      if (btnNextItem) btnNextItem.style.display = 'inline-flex';
    }

    btnNeed.addEventListener('click', () => handleClassification('need'));
    btnWant.addEventListener('click', () => handleClassification('want'));

    btnNextItem?.addEventListener('click', () => {
      currentIndex++;
      loadItem(currentIndex);
    });

    loadItem(0);
  }

  /* ==========================================================================
     4. Module 3: 50-30-20 Budget Calculator
     ========================================================================== */
  function initCalculator503020() {
    const incomeInput = document.getElementById('calcIncomeInput');
    const calculateBtn = document.getElementById('btnCalculate503020');
    const resetBtn = document.getElementById('btnReset503020');
    const errorMsg = document.getElementById('calcErrorMsg');

    const needsDisplay = document.getElementById('calcResultNeeds');
    const wantsDisplay = document.getElementById('calcResultWants');
    const savingsDisplay = document.getElementById('calcResultSavings');
    const donutSvg = document.getElementById('calcDonutSvg');

    if (!incomeInput || !calculateBtn) return;

    function calculate(incomeVal) {
      if (isNaN(incomeVal) || incomeVal === null || incomeVal === '') {
        showError(DataStore.budgetRuleValidation?.empty || DataStore.budgetRuleValidation?.invalid || "Please enter a valid numeric monthly allowance or income.");
        return;
      }

      const income = parseFloat(incomeVal);

      if (income < 0) {
        showError(DataStore.budgetRuleValidation?.negative || "Monthly income cannot be negative.");
        return;
      }
      if (income === 0) {
        showError(DataStore.budgetRuleValidation?.zero || "Monthly income must be greater than zero.");
        return;
      }

      if (income > 100000) {
        showError("Please enter a realistic student monthly budget amount (under $100,000).");
        return;
      }

      clearError();

      const split = DataStore.budgetPercentages || { needs:50, wants:30, savings:20 };
      const pNeeds = Number(split.needs);
      const pWants = Number(split.wants);
      const pSavings = Number(split.savings);
      const needsAmount = income * pNeeds / 100;
      const wantsAmount = income * pWants / 100;
      const savingsAmount = income * pSavings / 100;

      if (needsDisplay) needsDisplay.textContent = DataStore.formatMoney(needsAmount);
      if (wantsDisplay) wantsDisplay.textContent = DataStore.formatMoney(wantsAmount);
      if (savingsDisplay) savingsDisplay.textContent = DataStore.formatMoney(savingsAmount);

      updateDonutChart(pNeeds, pWants, pSavings);
    }

    function showError(msg) {
      if (errorMsg) {
        errorMsg.textContent = msg;
        errorMsg.classList.add('active');
      }
      incomeInput.classList.add('is-invalid');
    }

    function clearError() {
      if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.classList.remove('active');
      }
      incomeInput.classList.remove('is-invalid');
    }

    function updateDonutChart(pNeeds, pWants, pSavings) {
      if (!donutSvg) return;

      const circumference = 226.2;
      const needsLen = (pNeeds / 100) * circumference;
      const wantsLen = (pWants / 100) * circumference;
      const savingsLen = (pSavings / 100) * circumference;

      const needsOffset = 0;
      const wantsOffset = -needsLen;
      const savingsOffset = -(needsLen + wantsLen);

      donutSvg.innerHTML = `
        <svg viewBox="0 0 100 100" class="donut-svg">
          <circle cx="50" cy="50" r="36" fill="transparent" stroke="var(--border-color)" stroke-width="14" />
          <circle cx="50" cy="50" r="36" fill="transparent" stroke="#0D9488" stroke-width="14"
            stroke-dasharray="${needsLen} ${circumference - needsLen}"
            stroke-dashoffset="${needsOffset}"
            transform="rotate(-90 50 50)" />
          <circle cx="50" cy="50" r="36" fill="transparent" stroke="#F59E0B" stroke-width="14"
            stroke-dasharray="${wantsLen} ${circumference - wantsLen}"
            stroke-dashoffset="${wantsOffset}"
            transform="rotate(-90 50 50)" />
          <circle cx="50" cy="50" r="36" fill="transparent" stroke="#8B5CF6" stroke-width="14"
            stroke-dasharray="${savingsLen} ${circumference - savingsLen}"
            stroke-dashoffset="${savingsOffset}"
            transform="rotate(-90 50 50)" />
          <text x="50" y="47" text-anchor="middle" font-family="'Poppins', sans-serif" font-weight="800" font-size="9" fill="var(--text-main)">50 / 30 / 20</text>
          <text x="50" y="58" text-anchor="middle" font-size="6.5" font-weight="600" fill="var(--text-muted)">TARGET SPLIT</text>
        </svg>
      `;
    }

    calculateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculate(incomeInput.value.trim());
    });

    incomeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculate(incomeInput.value.trim());
      }
    });

    resetBtn?.addEventListener('click', () => {
      incomeInput.value = String(DataStore.budgetRuleSample?.monthlyIncome || 600);
      clearError();
      calculate(incomeInput.value);
    });

    const initialIncome = DataStore.budgetRuleSample?.monthlyIncome || 600;
    incomeInput.value = initialIncome;
    calculate(initialIncome);
  }

  /* ==========================================================================
     5. Module 4: Savings Goals Tracker
     ========================================================================== */
  function initSavingsGoals() {
    const form = document.getElementById('savingsGoalForm');
    const goalNameInput = document.getElementById('goalName');
    const targetAmountInput = document.getElementById('goalTargetAmount');
    const currentSavingsInput = document.getElementById('goalCurrentSavings');
    const monthlyContribInput = document.getElementById('goalMonthlyContribution');
    const errorMsg = document.getElementById('goalErrorMsg');

    const goalsListContainer = document.getElementById('savedGoalsList');

    if (!form) return;

    let savedGoals = JSON.parse(localStorage.getItem('budgetbasics_goals') || '[]');

    if (savedGoals.length === 0) {
      const sample = DataStore.savingsSample;
      savedGoals = [
        {
          id: 'goal_default_1',
          name: sample?.goalName || 'New Study Laptop',
          target: sample?.targetAmount || 600,
          current: sample?.currentSavings ?? 200,
          monthly: sample?.monthlyContribution || 80
        }
      ];
    }

    function validate(name, target, current, monthly) {
      if (!name || name.trim().length === 0) {
        return "Please enter a descriptive goal name (e.g., 'Emergency Buffer' or 'Study Laptop').";
      }
      if (isNaN(target) || target <= 0) {
        return "Target amount must be a positive numeric value greater than zero.";
      }
      if (isNaN(current) || current < 0) {
        return "Current savings cannot be negative.";
      }
      if (isNaN(monthly) || monthly <= 0) {
        return "Expected monthly contribution must be greater than zero.";
      }
      return null;
    }

    function calculateGoal(target, current, monthly) {
      const remaining = Math.max(0, target - current);
      const months = remaining === 0 ? 0 : Math.ceil(remaining / monthly);
      const percentage = Math.min(100, Math.round((current / target) * 100));
      return { remaining, months, percentage };
    }

    function getEncouragingTip(percentage, months) {
      if (percentage >= 100) return "🎉 Goal fully reached! Celebrate this milestone and keep building your safety net!";
      if (percentage >= 75) return "🔥 Incredible! You're in the final stretch—over 75% funded! Keep this up!";
      if (percentage >= 50) return "⭐ Halfway milestone reached! Your discipline is turning ambition into reality.";
      if (months <= 3) return "🚀 Just a few short months away! Stay focused on your small weekly wins.";
      return "💡 Small daily trade-offs make this goal achievable faster. Making lunch at home twice a week saves $40+/mo!";
    }

    function renderGoals() {
      if (!goalsListContainer) return;

      if (savedGoals.length === 0) {
        goalsListContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--text-muted); border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
            No saved goals yet. Calculate and add your first student savings goal!
          </div>
        `;
        return;
      }

      goalsListContainer.innerHTML = savedGoals.map(goal => {
        const calc = calculateGoal(goal.target, goal.current, goal.monthly);
        const tip = getEncouragingTip(calc.percentage, calc.months);

        return `
          <div class="goal-card-item" data-id="${goal.id}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <div>
                <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.2rem;">${goal.name}</h4>
                <span style="font-size: 0.82rem; color: var(--text-muted);">
                  Target: ${DataStore.formatMoney(goal.target)} • Saved: ${DataStore.formatMoney(goal.current)}
                </span>
              </div>
              <button class="btn-danger-sm btn-delete-goal" data-id="${goal.id}" title="Remove Goal">✕</button>
            </div>

            <div class="progress-track">
              <div class="progress-fill" style="width: ${calc.percentage}%;"></div>
            </div>

            <div class="goal-milestone-pills" style="margin-bottom: 0.75rem;">
              <span>${calc.percentage}% Funded</span>
              <span>${calc.months === 0 ? 'Goal Completed!' : `Approx. ${calc.months} ${calc.months === 1 ? 'Month' : 'Months'} Left`}</span>
            </div>

            <div style="background: var(--bg-alt); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.82rem; color: var(--text-main); border-left: 3px solid var(--accent-gold);">
              ${tip}
            </div>
          </div>
        `;
      }).join('');

      goalsListContainer.querySelectorAll('.btn-delete-goal').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          savedGoals = savedGoals.filter(g => g.id !== id);
          localStorage.setItem('budgetbasics_goals', JSON.stringify(savedGoals));
          renderGoals();
        });
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = goalNameInput.value.trim();
      const target = parseFloat(targetAmountInput.value);
      const current = parseFloat(currentSavingsInput.value);
      const monthly = parseFloat(monthlyContribInput.value);

      const validationError = validate(name, target, current, monthly);
      if (validationError) {
        if (errorMsg) {
          errorMsg.textContent = validationError;
          errorMsg.classList.add('active');
        }
        return;
      }

      if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.classList.remove('active');
      }

      const newGoal = {
        id: 'goal_' + Date.now(),
        name,
        target,
        current,
        monthly
      };

      savedGoals.unshift(newGoal);
      localStorage.setItem('budgetbasics_goals', JSON.stringify(savedGoals));

      form.reset();
      renderGoals();
    });

    renderGoals();
  }

  /* ==========================================================================
     6. Module 5: Expense Planner Demonstration
     ========================================================================== */
  function initExpensePlanner() {
    const form = document.getElementById('expenseEntryForm');
    const dateInput = document.getElementById('expenseDate');
    const catInput = document.getElementById('expenseCategory');
    const descInput = document.getElementById('expenseDescription');
    const amountInput = document.getElementById('expenseAmount');
    const errorMsg = document.getElementById('expenseErrorMsg');

    const budgetAllowanceInput = document.getElementById('expenseStartingBudget');
    const tableBody = document.getElementById('expenseTableBody');

    const metricTotalBudget = document.getElementById('metricTotalBudget');
    const metricTotalExpenses = document.getElementById('metricTotalExpenses');
    const metricRemainingBalance = document.getElementById('metricRemainingBalance');

    const btnExportCsv = document.getElementById('btnExportExpenseCsv');
    const btnLoadSampleData = document.getElementById('btnLoadSampleExpenses');
    const btnClearAll = document.getElementById('btnClearAllExpenses');

    const editModal = document.getElementById('editExpenseModal');
    const editForm = document.getElementById('editExpenseForm');
    const editIdInput = document.getElementById('editExpenseId');
    const editDateInput = document.getElementById('editExpenseDate');
    const editCatInput = document.getElementById('editExpenseCategory');
    const editDescInput = document.getElementById('editExpenseDescription');
    const editAmountInput = document.getElementById('editExpenseAmount');
    const closeEditModalBtn = document.getElementById('closeEditExpenseModal');

    if (!form || !tableBody) return;

    const today = new Date().toISOString().split('T')[0];
    if (dateInput) dateInput.value = today;

    let startingBudget = parseFloat(budgetAllowanceInput?.value || DataStore.expenseBudget || 500);
    let expenses = DataStore.expenseSamples?.length ? DataStore.expenseSamples.map((item, index) => ({ ...item, id:String(item.id || `sample_${index}`) })) : [
      { id: 'exp_1', date: '2026-09-02', category: 'Food', description: 'Campus Dining Hall Meal Pack', amount: 14.50 },
      { id: 'exp_2', date: '2026-09-05', category: 'Transport', description: 'Monthly Student Bus Pass', amount: 45.00 },
      { id: 'exp_3', date: '2026-09-08', category: 'Education', description: 'Used Textbook & Graphing Notebook', amount: 32.00 },
      { id: 'exp_4', date: '2026-09-12', category: 'Utilities', description: 'Mobile Data Prepaid Recharge', amount: 25.00 },
      { id: 'exp_5', date: '2026-09-15', category: 'Entertainment', description: 'Campus Cinema Night with Friends', amount: 12.00 }
    ];

    function recalculateMetrics() {
      startingBudget = parseFloat(budgetAllowanceInput?.value || 0);
      const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
      const balance = startingBudget - totalExpenses;

      if (metricTotalBudget) metricTotalBudget.textContent = DataStore.formatMoney(startingBudget);
      if (metricTotalExpenses) metricTotalExpenses.textContent = DataStore.formatMoney(totalExpenses);
      if (metricRemainingBalance) {
        metricRemainingBalance.textContent = DataStore.formatMoney(balance);
        const parentCard = metricRemainingBalance.closest('.metric-card');
        if (parentCard) {
          parentCard.className = balance < 0 ? 'metric-card warning' : 'metric-card positive';
        }
      }
    }

    function renderTable() {
      if (expenses.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
              No expense entries logged. Add an entry above or click "Load Sample Data".
            </td>
          </tr>
        `;
        recalculateMetrics();
        return;
      }

      tableBody.innerHTML = expenses.map(exp => `
        <tr data-id="${exp.id}">
          <td><span style="font-size: 0.85rem; color: var(--text-muted);">${exp.date}</span></td>
          <td><span class="expense-category-tag cat-${exp.category}">${exp.category}</span></td>
          <td><strong>${exp.description}</strong></td>
          <td><strong style="color: var(--text-main);">${DataStore.formatMoney(exp.amount)}</strong></td>
          <td style="white-space: nowrap;">
            <button class="btn-edit-sm btn-edit-entry" data-id="${exp.id}" title="Edit Entry">✏️ Edit</button>
            <button class="btn-danger-sm btn-delete-entry" data-id="${exp.id}" title="Remove Entry">🗑️</button>
          </td>
        </tr>
      `).join('');

      recalculateMetrics();

      tableBody.querySelectorAll('.btn-delete-entry').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.closest('button').dataset.id;
          expenses = expenses.filter(x => x.id !== id);
          renderTable();
        });
      });

      tableBody.querySelectorAll('.btn-edit-entry').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.closest('button').dataset.id;
          const entry = expenses.find(x => x.id === id);
          if (entry && editModal) {
            editIdInput.value = entry.id;
            editDateInput.value = entry.date;
            editCatInput.value = entry.category;
            editDescInput.value = entry.description;
            editAmountInput.value = entry.amount;
            editModal.classList.add('active');
          }
        });
      });
    }

    budgetAllowanceInput?.addEventListener('input', recalculateMetrics);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = dateInput.value;
      const category = catInput.value;
      const description = descInput.value.trim();
      const amount = parseFloat(amountInput.value);

      if (!description) {
        showError("Please provide an expense description (e.g., 'Campus Lunch').");
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        showError("Please enter a valid expense amount greater than zero.");
        return;
      }

      clearError();

      expenses.unshift({
        id: 'exp_' + Date.now(),
        date: date || today,
        category,
        description,
        amount
      });
      renderTable();

      descInput.value = '';
      amountInput.value = '';
      descInput.focus();
    });

    editForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = editIdInput.value;
      const entry = expenses.find(x => x.id === id);
      if (entry) {
        entry.date = editDateInput.value;
        entry.category = editCatInput.value;
        entry.description = editDescInput.value.trim();
        entry.amount = parseFloat(editAmountInput.value) || entry.amount;
        renderTable();
        editModal.classList.remove('active');
      }
    });

    closeEditModalBtn?.addEventListener('click', () => {
      editModal.classList.remove('active');
    });

    btnLoadSampleData?.addEventListener('click', () => {
      expenses = DataStore.expenseSamples?.length ? DataStore.expenseSamples.map((item, index) => ({ ...item, id:`sample_${item.id || index}` })) : [
        { id: 's1', date: '2026-09-02', category: 'Food', description: 'Cafeteria Weekly Lunch Pack', amount: 35.00 },
        { id: 's2', date: '2026-09-04', category: 'Transport', description: 'Metro Card Reload', amount: 25.00 },
        { id: 's3', date: '2026-09-06', category: 'Education', description: 'Chemistry Lab Goggles & Notebook', amount: 18.50 },
        { id: 's4', date: '2026-09-10', category: 'Entertainment', description: 'Campus Fest Ticket', amount: 15.00 },
        { id: 's5', date: '2026-09-14', category: 'Shopping', description: 'Dorm Desk Lamp', amount: 22.00 },
        { id: 's6', date: '2026-09-18', category: 'Utilities', description: 'Shared Dorm Wi-Fi Fee', amount: 20.00 },
        { id: 's7', date: '2026-09-21', category: 'Food', description: 'Grocery Staples (Milk, Bread, Fruit)', amount: 28.50 },
        { id: 's8', date: '2026-09-24', category: 'Miscellaneous', description: 'Laundry Machine Card', amount: 10.00 }
      ];
      if (budgetAllowanceInput) budgetAllowanceInput.value = DataStore.expenseBudget || 500;
      renderTable();
    });

    btnClearAllExpenses?.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear all logged expenses for this session?")) {
        expenses = [];
        renderTable();
      }
    });

    btnExportCsv?.addEventListener('click', () => {
      if (expenses.length === 0) {
        alert("No expenses recorded yet to export.");
        return;
      }
      let csvContent = "Date,Category,Description,Amount\n";
      expenses.forEach(row => {
        csvContent += `"${row.date}","${row.category}","${row.description.replace(/"/g, '""')}","${row.amount.toFixed(2)}"\n`;
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `BudgetBasics_Expense_Report_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    function showError(msg) {
      if (errorMsg) {
        errorMsg.textContent = msg;
        errorMsg.classList.add('active');
      }
    }

    function clearError() {
      if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.classList.remove('active');
      }
    }

    renderTable();
  }

  /* ==========================================================================
     7. Module 6: Money Mistakes Accordion & Latte Calculator
     ========================================================================== */
  function initMoneyMistakes() {
    const accordionContainer = document.getElementById('mistakesAccordion');
    const dailyCostInput = document.getElementById('latteDailyAmount');
    const daysPerWeekSelect = document.getElementById('latteDaysPerWeek');
    const monthlyCostDisplay = document.getElementById('latteMonthlyTotal');
    const yearlyCostDisplay = document.getElementById('latteYearlyTotal');

    if (accordionContainer && DataStore.moneyMistakes?.length) {
      accordionContainer.innerHTML = DataStore.moneyMistakes.map((item, index) => `
        <div class="accordion-item ${index === 0 ? 'active' : ''}">
          <button class="accordion-header-btn" aria-expanded="${index === 0}"><span>${index + 1}. ${escapeMarkup(item.title)}</span><span class="accordion-chevron">▼</span></button>
          <div class="accordion-body"><p>${escapeMarkup(item.description)}</p><div class="scenario-box"><strong>Student scenario:</strong> ${escapeMarkup(item.scenario)}</div><div class="solution-box"><strong>Corrective action:</strong> ${escapeMarkup(item.correctiveAction)}</div></div>
        </div>`).join('');
    }

    if (accordionContainer) {
      accordionContainer.addEventListener('click', (e) => {
        const headerBtn = e.target.closest('.accordion-header-btn');
        if (!headerBtn) return;

        const currentItem = headerBtn.closest('.accordion-item');
        const isOpen = currentItem.classList.contains('active');

        accordionContainer.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('active');
          item.querySelector('.accordion-header-btn').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          currentItem.classList.add('active');
          headerBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    function calculateLatteFactor() {
      if (!dailyCostInput || !daysPerWeekSelect) return;
      const daily = parseFloat(dailyCostInput.value) || 0;
      const days = parseInt(daysPerWeekSelect.value, 10) || 5;

      const weekly = daily * days;
      const monthly = weekly * 4.33;
      const yearly = weekly * 52;

      if (monthlyCostDisplay) monthlyCostDisplay.textContent = DataStore.formatMoney(monthly);
      if (yearlyCostDisplay) yearlyCostDisplay.textContent = DataStore.formatMoney(yearly);
    }

    dailyCostInput?.addEventListener('input', calculateLatteFactor);
    daysPerWeekSelect?.addEventListener('change', calculateLatteFactor);

    calculateLatteFactor();
  }

  /* ==========================================================================
     8. Module 7: Infographics & Learning Gallery
     ========================================================================== */
  function initInfographics() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const cards = document.querySelectorAll('.infographic-card');
    const modal = document.getElementById('infographicModal');
    const modalImg = document.getElementById('modalInfographicTarget');
    const modalTitle = document.getElementById('modalInfographicTitle');
    const modalClose = document.getElementById('closeInfographicModal');

    const btnOpenChecklist = document.getElementById('btnOpenChecklistModal');
    const checklistModal = document.getElementById('checklistModal');
    const closeChecklistModal = document.getElementById('closeChecklistModal');
    const btnPrintChecklist = document.getElementById('btnPrintChecklist');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterTopic = btn.dataset.topic;
        cards.forEach(card => {
          if (filterTopic === 'all' || card.dataset.topic === filterTopic) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    document.querySelectorAll('.btn-view-infographic').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.infographic-card');
        const title = card.querySelector('.infographic-card-title').textContent;
        const previewSvg = card.querySelector('.infographic-canvas-preview').innerHTML;

        if (modal && modalImg && modalTitle) {
          modalTitle.textContent = title;
          modalImg.innerHTML = previewSvg;
          modal.classList.add('active');
        }
      });
    });

    modalClose?.addEventListener('click', () => modal.classList.remove('active'));
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    btnOpenChecklist?.addEventListener('click', () => checklistModal?.classList.add('active'));
    closeChecklistModal?.addEventListener('click', () => checklistModal?.classList.remove('active'));
    checklistModal?.addEventListener('click', (e) => {
      if (e.target === checklistModal) checklistModal.classList.remove('active');
    });

    btnPrintChecklist?.addEventListener('click', () => window.print());
  }

  /* ==========================================================================
     9. Module 8: AI Chatbot Assistant ("BeeBuddy")
     ========================================================================== */
  function initChatbot() {
    const chatMessages = document.getElementById('chatMessagesContainer');
    const chatInput = document.getElementById('chatQuestionInput');
    const sendBtn = document.getElementById('btnSendChat');
    const promptChips = document.querySelectorAll('.prompt-chip');
    const btnAiTip = document.getElementById('btnGetAiTip');
    const floatingToggle = document.getElementById('floatingChatToggle');
    const chatbotSection = document.getElementById('chatbot');

    if (!chatMessages || !chatInput || !sendBtn) return;

    const aiTips = DataStore.aiTips?.length ? DataStore.aiTips : [
      "💡 NextGen Tip: Prepare meals in batches on Sunday afternoons! Meal-prepping with roommates slashes food expenses by 35%.",
      "💡 NextGen Tip: Before buying new textbooks, check your campus library reserve desk or online open educational resources (OER).",
      "💡 NextGen Tip: Open a dedicated high-yield student savings account that is separate from your daily checking account to avoid accidental spending.",
      "💡 NextGen Tip: Schedule your automated savings transfers for the morning your allowance or work-study stipend deposits.",
      "💡 NextGen Tip: Use cash or a debit card for weekend leisure activities instead of credit cards to naturally cap your budget.",
      "💡 NextGen Tip: Swap gym memberships for free university campus athletic facilities and recreation center classes!"
    ];

    function appendMessage(sender, text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${sender}`;
      msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function answerQuestion(query) {
      const cleanQuery = query.toLowerCase().trim();
      if (!cleanQuery) return;

      appendMessage('user', query);
      chatInput.value = '';

      setTimeout(() => {
        let matchedAnswer = null;

        for (const item of DataStore.faqChatbot) {
          const matches = item.keywords.some(kw => cleanQuery.includes(kw));
          if (matches) {
            matchedAnswer = item.answer;
            break;
          }
        }

        if (!matchedAnswer) {
          if (cleanQuery.includes('hello') || cleanQuery.includes('hi') || cleanQuery.includes('hey')) {
            matchedAnswer = "Bzz! Hello there! I'm **BeeBuddy**, your NextGen student budgeting companion. What would you like to explore today? You can ask about the 50-30-20 rule, needs vs wants, or how to tackle daily expenses!";
          } else if (cleanQuery.includes('thank')) {
            matchedAnswer = "You're very welcome! Stay buzz-y building great money habits! Feel free to ask any other student budgeting questions.";
          } else if (cleanQuery.includes('investment') || cleanQuery.includes('stock') || cleanQuery.includes('crypto')) {
            matchedAnswer = "⚠️ As an educational student budgeting assistant, I don't give speculative investment or trading advice. For students, mastering budgeting basics, eliminating high-interest debt, and building an emergency safety cushion are the golden first steps!";
          } else {
            matchedAnswer = DataStore.chatFallback || "Bzz! I'm BeeBuddy, your student finance guide. Ask me about student budgeting, saving, expenses, or needs and wants.";
          }
        }

        appendMessage('bot', matchedAnswer);
      }, 350);
    }

    sendBtn.addEventListener('click', () => answerQuestion(chatInput.value));
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        answerQuestion(chatInput.value);
      }
    });

    promptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const promptText = chip.dataset.prompt || chip.textContent.trim();
        answerQuestion(promptText);
      });
    });

    btnAiTip?.addEventListener('click', () => {
      const randomTip = aiTips[Math.floor(Math.random() * aiTips.length)];
      appendMessage('bot', randomTip);
    });

    floatingToggle?.addEventListener('click', () => {
      chatbotSection?.scrollIntoView({ behavior: 'smooth' });
      chatInput.focus();
    });
  }

  /* ==========================================================================
     10. Module 9: Search, Sort, and Filter
     ========================================================================== */
  function initSearchFilter() {
    const searchInput = document.getElementById('globalKeywordSearch');
    const sortSelect = document.getElementById('searchSortSelect');
    const tagChips = document.querySelectorAll('.tag-filter-chips .tag-chip');
    const resultsContainer = document.getElementById('searchResultsGrid');
    const resultCounter = document.getElementById('searchResultCount');

    if (!searchInput || !resultsContainer) return;

    const contentItems = DataStore.searchResources?.length ? DataStore.searchResources : [
      {
        id: 1,
        title: "Master the 24-Hour Delay Rule",
        topic: "spending",
        category: "Spending Habits",
        date: "2026-09-01",
        relevanceScore: 10,
        summary: "When browsing online or shopping on campus, never purchase non-essential items immediately. Give yourself 24 hours.",
        content: "Most impulse urges peak within the first 15 minutes of emotional excitement. By giving yourself 24 hours, you step out of the dopamine loop and evaluate if the item is truly worth your hard-earned allowance."
      },
      {
        id: 2,
        title: "The Student Subscription Audit",
        topic: "expenses",
        category: "Expenses",
        date: "2026-09-05",
        relevanceScore: 9,
        summary: "Audit auto-renewals on streaming, apps, gym memberships, and trial software on the 1st of every month.",
        content: "Students frequently sign up for 7-day free trials and forget to cancel. Make it a habit on the 1st of every month to inspect recurring charges and cancel any service you haven't used in 14 days."
      },
      {
        id: 3,
        title: "Build a $250 Starter Safety Cushion",
        topic: "saving",
        category: "Saving",
        date: "2026-09-10",
        relevanceScore: 8,
        summary: "Start with an achievable $250 emergency buffer before aiming for huge long-term savings goals.",
        content: "A $250 emergency fund protects you when unexpected student mishaps occur—such as needing an emergency textbook code, replacement phone charger, or urgent prescription medicine without borrowing."
      },
      {
        id: 4,
        title: "Distinguish Needs vs Wants with Context",
        topic: "needs",
        category: "Needs vs Wants",
        date: "2026-09-12",
        relevanceScore: 7,
        summary: "A laptop is a student need; the top-tier RGB gaming rig is a want. Context defines your categories.",
        content: "Needs keep your health, safety, and academic enrollment intact. Wants bring pleasure and comfort. Understanding that you can enjoy wants without putting needs in jeopardy is the key to guilt-free budgeting."
      },
      {
        id: 5,
        title: "Tackle the 'Latte Factor' Compounding",
        topic: "expenses",
        category: "Expenses",
        date: "2026-09-15",
        relevanceScore: 8,
        summary: "Buying a $4.50 specialty coffee every weekday equals $90 a month and over $1,000 a year.",
        content: "Small daily micro-purchases feel negligible in the moment, but they create a quiet leak in student wallets. Brewing coffee in your dorm or carrying a thermal flask can preserve nearly $100 every single month."
      },
      {
        id: 6,
        title: "Set SMART Savings Goals",
        topic: "goals",
        category: "Goals",
        date: "2026-09-18",
        relevanceScore: 9,
        summary: "Specific goals like 'Save $400 for a laptop by December' succeed where vague goals fail.",
        content: "Break your target amount into monthly contributions. If you need $400 in 4 months, commit to $100 per month. Tracking your progress on a visual milestone bar boosts dopamine and reinforces positive financial behavior."
      },
      {
        id: 7,
        title: "Zero-Based Student Budgeting",
        topic: "budgeting",
        category: "Budgeting Basics",
        date: "2026-09-20",
        relevanceScore: 10,
        summary: "Give every single dollar a job before the month starts so no money disappears without a trace.",
        content: "Income minus expenses and planned savings should equal zero. If you have $20 left over after planning, intentionally assign that $20 to your savings goal or emergency fund rather than leaving it in checking."
      },
      {
        id: 8,
        title: "Leverage Student Discounts Everywhere",
        topic: "spending",
        category: "Spending Habits",
        date: "2026-09-22",
        relevanceScore: 8,
        summary: "From Spotify to transit passes, Adobe to grocery stores, student discounts save you 20% to 60%.",
        content: "Always carry your university student ID card or verify with UNiDAYS/Student Beans. Never pay full retail price for software, streaming, transit, cinema tickets, or electronics while enrolled in school."
      }
    ];

    let activeTopic = 'all';

    function filterAndRender() {
      const query = searchInput.value.toLowerCase().trim();
      const sortMode = sortSelect ? sortSelect.value : 'relevant';

      let filtered = contentItems.filter(item => {
        const matchesTopic = activeTopic === 'all' || item.topic === activeTopic;
        const matchesQuery = query === '' ||
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query);
        return matchesTopic && matchesQuery;
      });

      if (sortMode === 'newest') {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sortMode === 'az') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
      }

      if (resultCounter) {
        resultCounter.textContent = `Showing ${filtered.length} of ${contentItems.length} resources`;
      }

      if (filtered.length === 0) {
        resultsContainer.innerHTML = `
          <div class="empty-results-state">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍🍃</div>
            <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">No Matching Learning Content Found</h4>
            <p style="color: var(--text-muted); margin-bottom: 1rem; max-width: 500px; margin-left: auto; margin-right: auto;">
              We couldn't find any resources matching "<strong>${query}</strong>" in the selected topic. Try searching for terms like <em>saving</em>, <em>needs</em>, <em>expenses</em>, or <em>goals</em>.
            </p>
            <button id="resetSearchFilterBtn" class="btn btn-secondary btn-sm">Clear Search & Filters</button>
          </div>
        `;

        document.getElementById('resetSearchFilterBtn')?.addEventListener('click', () => {
          searchInput.value = '';
          activeTopic = 'all';
          tagChips.forEach(c => c.classList.toggle('active', c.dataset.topic === 'all'));
          filterAndRender();
        });
        return;
      }

      resultsContainer.innerHTML = filtered.map(item => `
        <div class="card" style="display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <span class="badge badge-info">${item.category}</span>
            <span style="font-size: 0.75rem; color: var(--text-subtle);">${item.date}</span>
          </div>
          <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">
            ${item.title}
          </h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem; flex-grow: 1;">
            ${item.summary}
          </p>
          <div style="background: var(--bg-alt); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.82rem; color: var(--text-main); border-left: 3px solid var(--primary);">
            ${item.content}
          </div>
        </div>
      `).join('');
    }

    searchInput.addEventListener('input', filterAndRender);
    sortSelect?.addEventListener('change', filterAndRender);

    tagChips.forEach(chip => {
      chip.addEventListener('click', () => {
        tagChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeTopic = chip.dataset.topic || 'all';
        filterAndRender();
      });
    });

    filterAndRender();
  }

  /* ==========================================================================
     11. Module 10: Client-side Forms & Validation
     ========================================================================== */
  function initForms() {
    const contactForm = document.getElementById('contactForm');
    const feedbackForm = document.getElementById('feedbackForm');
    const toast = document.getElementById('toastNotice');
    const toastMsg = document.getElementById('toastMessage');

    const starContainer = document.getElementById('starRatingWidget');
    let selectedRating = 0;

    if (starContainer) {
      const stars = starContainer.querySelectorAll('.star-btn');

      stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
          const val = parseInt(star.dataset.value, 10);
          stars.forEach(s => s.classList.toggle('hovered', parseInt(s.dataset.value, 10) <= val));
        });

        star.addEventListener('mouseleave', () => {
          stars.forEach(s => {
            s.classList.remove('hovered');
            s.classList.toggle('selected', parseInt(s.dataset.value, 10) <= selectedRating);
          });
        });

        star.addEventListener('click', () => {
          selectedRating = parseInt(star.dataset.value, 10);
          stars.forEach(s => s.classList.toggle('selected', parseInt(s.dataset.value, 10) <= selectedRating));
          const ratingError = document.getElementById('feedbackRatingError');
          if (ratingError) ratingError.classList.remove('active');
        });
      });
    }

    function showToast(message) {
      if (!toast || !toastMsg) return;
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
    }

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }

    contactForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();

      let hasError = false;
      const nameError = document.getElementById('contactNameError');
      if (!name || name.length < 2) {
        if (nameError) { nameError.textContent = "Please enter your full name (min 2 chars)."; nameError.classList.add('active'); }
        hasError = true;
      } else if (nameError) nameError.classList.remove('active');

      const emailError = document.getElementById('contactEmailError');
      if (!email || !validateEmail(email)) {
        if (emailError) { emailError.textContent = "Please enter a valid email address."; emailError.classList.add('active'); }
        hasError = true;
      } else if (emailError) emailError.classList.remove('active');

      const msgError = document.getElementById('contactMessageError');
      if (!message || message.length < 10) {
        if (msgError) { msgError.textContent = "Message must be at least 10 characters long."; msgError.classList.add('active'); }
        hasError = true;
      } else if (msgError) msgError.classList.remove('active');

      if (hasError) return;

      contactForm.reset();
      showToast(`${DataStore.contactSuccess || `Thank you, ${name}! Your inquiry has been verified and recorded locally.`}`);
    });

    feedbackForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('feedbackName')?.value.trim();
      const email = document.getElementById('feedbackEmail')?.value.trim();
      const comments = document.getElementById('feedbackComments')?.value.trim();

      let hasError = false;
      const nameError = document.getElementById('feedbackNameError');
      if (!name || name.length < 2) {
        if (nameError) { nameError.textContent = "Please provide your name."; nameError.classList.add('active'); }
        hasError = true;
      } else if (nameError) nameError.classList.remove('active');

      const emailError = document.getElementById('feedbackEmailError');
      if (!email || !validateEmail(email)) {
        if (emailError) { emailError.textContent = "Please enter a valid email address."; emailError.classList.add('active'); }
        hasError = true;
      } else if (emailError) emailError.classList.remove('active');

      const ratingError = document.getElementById('feedbackRatingError');
      if (selectedRating === 0) {
        if (ratingError) { ratingError.textContent = "Please select a rating between 1 and 5 stars."; ratingError.classList.add('active'); }
        hasError = true;
      } else if (ratingError) ratingError.classList.remove('active');

      const commentError = document.getElementById('feedbackCommentError');
      if (!comments || comments.length < 5) {
        if (commentError) { commentError.textContent = "Please enter your thoughts (min 5 characters)."; commentError.classList.add('active'); }
        hasError = true;
      } else if (commentError) commentError.classList.remove('active');

      if (hasError) return;

      feedbackForm.reset();
      selectedRating = 0;
      if (starContainer) {
        starContainer.querySelectorAll('.star-btn').forEach(s => s.classList.remove('selected', 'hovered'));
      }
      showToast(`${DataStore.feedbackSuccess || `Thank you for your feedback, ${name}! Your review helps make BudgetBasics better for learners.`}`);
    });
  }

  /* ==========================================================================
     12. Global Layout & Utility Features
     ========================================================================== */
  function initLiveClock() {
    const clockEl = document.getElementById('liveDateTimeDisplay');
    if (!clockEl) return;
    function update() {
      const now = new Date();
      const settings = DataStore.dateTimeSettings || {};
      const parts = [];
      if (settings.showDate !== false) {
        const locale = settings.format === 'DD/MM/YYYY' ? 'en-GB' : 'en-US';
        const dateOptions = settings.format === 'DD/MM/YYYY' ? { day:'2-digit', month:'2-digit', year:'numeric' } : { weekday:'short', year:'numeric', month:'short', day:'numeric' };
        parts.push(now.toLocaleDateString(locale, dateOptions));
      }
      if (settings.showTime !== false) parts.push(now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' }));
      clockEl.textContent = parts.join(' · ');
    }
    update();
    setInterval(update, 1000);
  }

  function initVisitorCounter() {
    const counterEl = document.getElementById('visitorCountDisplay');
    if (!counterEl) return;
    let count = parseInt(localStorage.getItem('budgetbasics_visits') || String(DataStore.visitorStart || 1420), 10);
    if (!sessionStorage.getItem('visited_session')) {
      count++;
      localStorage.setItem('budgetbasics_visits', count);
      sessionStorage.setItem('visited_session', 'true');
    }
    counterEl.textContent = count.toLocaleString();
  }

  function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeToggleIcon');
    const themeText = document.getElementById('themeToggleText');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem('budgetbasics_theme') || 'light';
    applyTheme(savedTheme);

    toggleBtn?.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'light';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    function applyTheme(theme) {
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
        if (themeText) themeText.textContent = 'Light Mode';
      } else {
        root.removeAttribute('data-theme');
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeText) themeText.textContent = 'Dark Mode';
      }
      localStorage.setItem('budgetbasics_theme', theme);
    }
  }

  function initCurrencySwitcher() {
    const currencySelect = document.getElementById('currencySelect');
    if (!currencySelect) return;

    currencySelect.addEventListener('change', (e) => {
      DataStore.currency = e.target.value;
      initBudgetBasics();
      initCalculator503020();
      initSavingsGoals();
      initExpensePlanner();
      initMoneyMistakes();
      initNeedsWants();
    });
  }

  function initNavigation() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');

    function openDrawer() {
      mobileDrawer?.classList.add('open');
      backdrop?.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      mobileDrawer?.classList.remove('open');
      backdrop?.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburgerBtn?.addEventListener('click', openDrawer);
    closeDrawerBtn?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);

    document.querySelectorAll('.mobile-nav-list .nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    window.addEventListener('scroll', () => {
      let currentId = '';
      const scrollPos = window.scrollY + 100;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentId = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('active', href === currentId);
      });
    });
  }

  function initTicker() {
    const tickerTrack = document.getElementById('tickerTrack');
    if (!tickerTrack) return;
    const quotes = DataStore.tickerQuotes?.length ? DataStore.tickerQuotes : [
      "“Do not save what is left after spending, but spend what is left after saving.” – Warren Buffett",
      "“Beware of little expenses; a small leak will sink a great ship.” – Benjamin Franklin",
      "“A budget is telling your money where to go instead of wondering where it went.” – Dave Ramsey",
      "“NextGen Student Tip: Flash your student ID card everywhere you shop—discounts add up fast!”",
      "“The 24-Hour Rule: Wait 24 hours before buying non-essentials to completely wipe out impulse spending.”",
      "“Consistency is king: Saving just $25 each month builds an emergency safety buffer of $300 in one year!”"
    ];
    tickerTrack.textContent = quotes.join('   ✦   ') + '   ✦   ';
  }

  function initSitemapModal() {
    const modal = document.getElementById('sitemapModal');
    const openButtons = document.querySelectorAll('.btn-open-sitemap');
    const closeBtn = document.getElementById('closeSitemapModal');

    openButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal?.classList.add('active');
      });
    });

    closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  function initBackToTop() {
    const backBtn = document.getElementById('backToTopBtn');
    if (!backBtn) return;

    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 400);
    });

    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function applyProjectJsonData() {
    const json = window.budgetBasicsJSON || {};
    const sampleProfiles = json.sample_budget?.profiles;
    if (sampleProfiles?.length) {
      DataStore.budgetProfiles = sampleProfiles.map(profile => ({
        id: profile.id,
        profileName: profile.profileName,
        monthlyIncome: profile.monthlyIncome,
        breakdown: Array.isArray(profile.breakdown) ? profile.breakdown : [
          ...(profile.breakdown?.needs || []), ...(profile.breakdown?.wants || []), ...(profile.breakdown?.savings || [])
        ]
      }));
    }

    const quizQuestions = json.quiz?.quiz?.questions;
    if (quizQuestions?.length) {
      DataStore.quizQuestions = quizQuestions.map(item => ({
        question: item.question,
        options: item.options,
        correctIndex: item.options.indexOf(item.correctAnswer),
        explanation: item.feedback
      }));
    }

    const gameQuestions = json["needs-wants"]?.needsVsWants?.questions;
    if (gameQuestions?.length) {
      const defaultGameItems = DataStore.classificationItems;
      DataStore.classificationItems = gameQuestions.map((item, index) => ({
        id: item.id,
        name: item.item,
        emoji: defaultGameItems[index]?.emoji || ["🛒", "🎮", "🚌", "🧥", "📚", "🎬", "🌐", "📱"][index % 8],
        cost: defaultGameItems[index]?.cost || 0,
        type: String(item.correctAnswer).toLowerCase(),
        justification: item.feedback
      }));
    }

    const rule = json["50-30-20"]?.budgetRule;
    if (rule?.percentages) {
      DataStore.budgetPercentages = rule.percentages;
      DataStore.budgetRuleSample = rule.calculator?.sampleCalculation;
      DataStore.budgetRuleValidation = rule.validation;
      ["needs", "wants", "savings"].forEach(key => {
        const label = document.querySelector(`#calc503020 .split-result-card.${key} h4`);
        if (label) label.textContent = `${rule.percentages[key]}% for ${key === "needs" ? "Essential Needs" : key === "wants" ? "Lifestyle Wants" : "Future Savings"}`;
      });
    }

    const currentBot = json.chatbot;
    const referenceBot = json.faq_chatbot;
    if (currentBot?.responses?.length) {
      DataStore.faqChatbot = currentBot.responses.map(item => ({ keywords: item.keywords, answer: item.answer }))
        .concat(referenceBot?.faq || []);
      DataStore.chatFallback = currentBot.fallback || referenceBot?.fallback_response || "I can help with basic budgeting topics.";
    } else if (referenceBot?.faq?.length) {
      DataStore.faqChatbot = referenceBot.faq;
      DataStore.chatFallback = referenceBot.fallback_response;
    }

    DataStore.tickerQuotes = json.tips_data?.ticker_quotes || [];
    DataStore.aiTips = json.tips_data?.ai_spending_tips || [];
    DataStore.infographicData = json.infographics_data?.infographics || [];
    DataStore.expenseSamples = json["expense-planner"]?.expensePlanner?.sampleBudget?.sampleExpenses || [];
    DataStore.expenseBudget = json["expense-planner"]?.expensePlanner?.sampleBudget?.monthlyIncome || 500;
    DataStore.expenseCategories = json["expense-planner"]?.expensePlanner?.fields?.find(field => field.name === "category")?.options
      || json.categories?.categories?.map(category => category.name)
      || [];
    DataStore.savingsSample = json.savings?.savingsGoals?.sampleGoal || null;
    DataStore.moneyMistakes = json.mistakes?.mistakes || [];

    const searchData = json["search-data"]?.searchData || [];
    const tips = json.tips_data?.searchable_tips || [];
    const contentTips = (json.tips?.tips || []).map((tip, index) => ({
      id: `tip_${tip.id || index}`,
      title: tip.title,
      topic: ({ Budgeting:"budgeting", Saving:"saving", Spending:"spending", Expenses:"expenses", "Money Mistakes":"expenses" })[tip.category] || "budgeting",
      category: tip.category,
      date: "2026-09-25",
      relevanceScore: 5,
      summary: tip.tip,
      content: tip.tip
    }));
    DataStore.searchResources = [
      ...tips.map((item, index) => ({ id:item.id || index, title:item.title, topic:item.topic || "budgeting", category:item.category || "Money tips", date:item.date || "2026-09-25", relevanceScore:10-index, summary:item.summary || item.content, content:item.content || item.summary })),
      ...searchData.map((item, index) => ({ id:`search_${item.id || index}`, title:item.title, topic:({ Budgeting:"budgeting", Needs:"needs", Wants:"needs", Saving:"saving", Spending:"spending", Expenses:"expenses", "Money Mistakes":"expenses" })[item.category] || "budgeting", category:item.category, date:"2026-09-25", relevanceScore:7, summary:item.description, content:item.description })),
      ...contentTips
    ];

    const categorySelects = [document.getElementById("expenseCategory"), document.getElementById("editExpenseCategory")].filter(Boolean);
    categorySelects.forEach(select => {
      if (!DataStore.expenseCategories.length) return;
      const selected = select.value;
      select.innerHTML = DataStore.expenseCategories.map(category => `<option value="${escapeMarkup(category)}">${escapeMarkup(category)}</option>`).join("");
      if (DataStore.expenseCategories.includes(selected)) select.value = selected;
    });
    const plannerBudgetInput = document.getElementById("expenseStartingBudget");
    if (plannerBudgetInput && DataStore.expenseBudget) plannerBudgetInput.value = DataStore.expenseBudget;

    (json.budgeting?.budgetingBasics?.concepts || []).forEach((concept, index) => {
      const card = document.querySelectorAll("#budgetBasics .concept-card")[index];
      if (!card) return;
      const heading = card.querySelector("h3");
      const description = card.querySelector("p");
      const example = card.querySelector(".concept-example-box");
      if (heading) heading.textContent = `${index + 1}. ${concept.title}`;
      if (description) description.textContent = concept.description;
      if (example && concept.examples?.length) example.innerHTML = `<strong>Examples:</strong> ${concept.examples.map(escapeMarkup).join(", ")}`;
    });

    const mistakeContainer = document.getElementById("mistakesAccordion");
    if (mistakeContainer && DataStore.moneyMistakes.length) {
      mistakeContainer.innerHTML = DataStore.moneyMistakes.map((item, index) => `
        <div class="accordion-item ${index === 0 ? "active" : ""}">
          <button class="accordion-header-btn" aria-expanded="${index === 0}"><span>${index + 1}. ${escapeMarkup(item.title)}</span><span class="accordion-chevron">▼</span></button>
          <div class="accordion-body"><p>${escapeMarkup(item.description)}</p><div class="scenario-box"><strong>Student scenario:</strong> ${escapeMarkup(item.scenario)}</div><div class="solution-box"><strong>Try this:</strong> ${escapeMarkup(item.correctiveAction)}</div></div>
        </div>`).join("");
    }

    const infoCards = document.querySelectorAll("#infographics .infographic-card");
    DataStore.infographicData.forEach((item, index) => {
      const card = infoCards[index];
      if (!card) return;
      const title = card.querySelector(".infographic-card-title");
      const caption = card.querySelector(".infographic-card-caption");
      if (title) title.textContent = item.title;
      if (caption) caption.textContent = item.caption;
      card.dataset.topic = item.topic;
      card.setAttribute("aria-label", item.alt || item.title);
    });

    const facts = json.tips_data?.quick_facts || [];
    document.querySelectorAll(".quick-facts-bar .fact-item").forEach((item, index) => {
      const fact = facts[index];
      if (!fact) return;
      const title = item.querySelector(".fact-title");
      const subtitle = item.querySelector(".fact-desc");
      if (title) title.textContent = fact.title;
      if (subtitle) subtitle.textContent = fact.subtitle;
    });

    const nav = json.navigation?.navigation;
    const footerData = json.footer?.footer;
    const routeMap = {
      "home":"mainContent", "budgeting-basics":"budgetBasics", "needs-wants":"needsWants", "50-30-20":"calc503020",
      "savings-goals":"savingsGoals", "expense-planner":"expensePlanner", "money-mistakes":"moneyMistakes",
      "infographics":"infographics", "ai-chatbot":"chatbot", "feedback":"contactUs", "contact":"contactUs",
      "sitemap":"sitemapModal"
    };
    const route = target => `#${routeMap[target] || target}`;
    if (nav?.menu) {
      const links = document.querySelectorAll(".nav-menu .nav-link, .mobile-nav-list .nav-link");
      links.forEach(link => {
        const label = link.textContent.replace(/^\d+\.\s*/, "").trim().toLowerCase();
        const matched = nav.menu.find(item => item.label.toLowerCase() === label || item.label.toLowerCase().includes(label) || label.includes(item.label.toLowerCase()));
        if (matched) {
          link.href = route(matched.target);
          if (matched.target === "sitemap") link.classList.add("btn-open-sitemap");
        }
      });
    }
    if (footerData?.quickLinks) {
      const lists = document.querySelectorAll(".footer-nav-links");
      if (lists[0]) lists[0].innerHTML = footerData.quickLinks.map(link => `<li><a class="${link.target === "sitemap" ? "btn-open-sitemap" : ""}" href="${route(link.target)}">${escapeMarkup(link.label)}</a></li>`).join("");
      if (lists[1] && footerData.resources) lists[1].innerHTML = footerData.resources.map(link => `<li><a class="${link.target === "sitemap" ? "btn-open-sitemap" : ""}" href="${route(link.target)}">${escapeMarkup(link.label)}</a></li>`).join("");
    }
    const sitemap = json.sitemap?.sitemap;
    const sitemapBody = document.querySelector("#sitemapModal .modal-body");
    if (sitemap && sitemapBody) {
      const title = document.getElementById("sitemapModalTitle");
      if (title) title.textContent = sitemap.title;
      sitemapBody.innerHTML = `<p style="font-size:.9rem;color:var(--text-muted);margin-bottom:1.25rem">${escapeMarkup(sitemap.description)}</p><div class="json-sitemap-grid">${(sitemap.sections || []).map(section => `<section><h4>${escapeMarkup(section.title)}</h4><ul>${(section.links || []).map(link => `<li><a href="${route(link.target)}">${escapeMarkup(link.label)}</a></li>`).join("")}</ul></section>`).join("")}</div>`;
      sitemapBody.querySelectorAll("a").forEach(link => link.addEventListener("click", () => document.getElementById("sitemapModal")?.classList.remove("active")));
    }
    if (footerData?.brand?.description) {
      const footerDescription = document.querySelector(".footer-brand p");
      if (footerDescription) footerDescription.textContent = footerData.brand.description;
    }
    const contactDetails = json.contact?.contact?.contactDetails || footerData?.contact;
    const contactEmail = document.querySelector('#contactUs a[href^="mailto:"]');
    if (contactEmail && contactDetails?.email) {
      contactEmail.href = `mailto:${contactDetails.email}`;
      contactEmail.textContent = contactDetails.email;
    }
    const phone = document.querySelector("#contactUs .contact-info-item:nth-child(2) span");
    if (phone && contactDetails?.phone) phone.textContent = contactDetails.phone;
    const about = json.about?.about;
    const mission = document.querySelector("#contactUs .contact-section-grid .card p");
    if (mission && about?.description) mission.textContent = about.description;

    const ui = json["ui-settings"]?.uiSettings;
    if (ui?.theme?.darkMode?.enabled === false) document.getElementById("themeToggleBtn")?.setAttribute("hidden", "");
    if (ui?.navigation?.mobileMenu === false || nav?.mobileMenu?.enabled === false) document.getElementById("hamburgerBtn")?.setAttribute("hidden", "");
    if (ui?.animations?.smoothScrolling === false) document.documentElement.style.scrollBehavior = "auto";

    const feedbackPrivacy = json.feedback?.feedback?.privacyNote;
    if (feedbackPrivacy) {
      const privacy = document.createElement("p");
      privacy.className = "form-privacy-note";
      privacy.textContent = feedbackPrivacy;
      document.getElementById("feedbackForm")?.appendChild(privacy);
    }

    const welcome = json["site-content"]?.site;
    if (welcome?.tagline) {
      document.title = `${welcome.name || "BudgetBasics"} — ${welcome.tagline}`;
      const heroTitle = document.querySelector(".hero-title");
      if (heroTitle) heroTitle.innerHTML = `${escapeMarkup(welcome.tagline.split(".")[0])} <span class="highlight-teal">${escapeMarkup(welcome.tagline.split(".").slice(1).join(".").trim())}</span>`;
      const heroDescription = document.querySelector(".hero-description");
      if (heroDescription && welcome.welcomeDescription) heroDescription.textContent = welcome.welcomeDescription;
      const pill = document.querySelector(".hero-pill");
      if (pill) pill.textContent = `${welcome.name || "BudgetBasics"} · ${welcome.theme || "Student Money Guide"}`;
      DataStore.visitorStart = welcome.visitorCounter?.initialCount || 1000;
      DataStore.dateTimeSettings = welcome.dateTime || {};
      const heroActions = document.querySelectorAll(".hero-actions .btn");
      (welcome.callToAction?.buttons || []).forEach((button, index) => {
        if (!heroActions[index]) return;
        heroActions[index].textContent = button.text;
        heroActions[index].href = route(button.target);
      });
    }
    if (welcome?.visitorCounter?.enabled) {
      const count = document.getElementById("visitorCountDisplay");
      if (count && !localStorage.getItem("budgetbasics_visits")) count.textContent = Number(DataStore.visitorStart || 0).toLocaleString();
    }

    const suggestions = json.chatbot?.suggestedPrompts;
    const promptBar = document.querySelector(".suggested-prompts-bar");
    if (suggestions?.length && promptBar) promptBar.innerHTML = suggestions.map(prompt => `<button class="prompt-chip" data-prompt="${escapeMarkup(prompt)}">${escapeMarkup(prompt)}</button>`).join("");
    const chatbotDisclaimer = json.chatbot?.disclaimer || json.faq_chatbot?.disclaimer;
    const disclaimer = document.querySelector("#chatbot .chat-disclaimer");
    if (disclaimer && chatbotDisclaimer) disclaimer.textContent = chatbotDisclaimer;
    const contactSuccess = json.contact?.contact?.form?.successMessage;
    const feedbackSuccess = json.feedback?.feedback?.successMessage;
    if (contactSuccess) DataStore.contactSuccess = contactSuccess;
    if (feedbackSuccess) DataStore.feedbackSuccess = feedbackSuccess;

    const bindFormFields = (formId, fields, fieldIds) => {
      const form = document.getElementById(formId);
      if (!form || !Array.isArray(fields)) return;
      fields.forEach(field => {
        const control = form.querySelector(`#${fieldIds[field.name] || field.name}`);
        if (!control) return;
        if (field.placeholder) control.placeholder = field.placeholder;
        if (field.required !== undefined) control.required = Boolean(field.required);
        if (field.min !== undefined) control.min = field.min;
        if (field.max !== undefined) control.max = field.max;
        const label = form.querySelector(`label[for="${control.id}"]`);
        if (label && field.label) label.textContent = field.label;
      });
    };
    bindFormFields("contactForm", json.contact?.contact?.form?.fields, {
      name:"contactName", email:"contactEmail", message:"contactMessage"
    });
    bindFormFields("feedbackForm", json.feedback?.feedback?.fields, {
      name:"feedbackName", email:"feedbackEmail", rating:"feedbackRating", comments:"feedbackComments"
    });
    bindFormFields("savingsGoalForm", json.savings?.savingsGoals?.fields, {
      targetAmount:"goalTargetAmount", currentSavings:"goalCurrentSavings", monthlyContribution:"goalMonthlyContribution"
    });

    const contactSection = document.querySelector("#contactUs .section-header .section-desc");
    if (contactSection && json.contact?.contact?.description) contactSection.textContent = json.contact.contact.description;
    const feedbackDescription = document.querySelector("#feedbackForm")?.previousElementSibling;
    if (feedbackDescription && json.feedback?.feedback?.description) feedbackDescription.textContent = json.feedback.feedback.description;
  }

  function escapeMarkup(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[character]);
  }

  // Auto-run on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    applyProjectJsonData();
    initLiveClock();
    initVisitorCounter();
    initThemeToggle();
    initCurrencySwitcher();
    initNavigation();
    initTicker();
    initSitemapModal();
    initBackToTop();

    initBudgetBasics();
    initNeedsWants();
    initCalculator503020();
    initSavingsGoals();
    initExpensePlanner();
    initMoneyMistakes();
    initInfographics();
    initChatbot();
    initSearchFilter();
    initForms();
  });

})();
