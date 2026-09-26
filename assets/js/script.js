


        const countrySelect = document.getElementById("countrySelect");
        const liveClock = document.getElementById("liveClock");
        const liveDate = document.getElementById("liveDate");

        function updateClock() {

            const timezone = countrySelect.value;

            const now = new Date();

            const time = new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }).format(now);

            const date = new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
            }).format(now);

            liveClock.textContent = time;
            liveDate.textContent = date;

        }

        countrySelect.addEventListener("change", updateClock);

        updateClock();

        setInterval(updateClock, 1000);





        const themeToggle = document.getElementById("themeToggle");
        const themeIcon = document.getElementById("themeIcon");

        const savedTheme = localStorage.getItem("budgetbasics-theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
            themeIcon.textContent = "☀";
        }

        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "budgetbasics-theme",
                isDark ? "dark" : "light"
            );

            themeIcon.textContent = isDark ? "☀" : "☾";

        });





        function calculateBudget() {

            const income =
                parseFloat(
                    document.getElementById("incomeInput").value
                );

            if (!income || income < 0) {

                showToast("Enter a valid monthly income.");

                return;

            }

            const needs = income * 0.50;
            const wants = income * 0.30;
            const savings = income * 0.20;

            document.getElementById("needsAmount").textContent =
                formatMoney(needs);

            document.getElementById("wantsAmount").textContent =
                formatMoney(wants);

            document.getElementById("savingsAmount").textContent =
                formatMoney(savings);


            document.getElementById("snapshotIncome").textContent =
                formatMoney(income);

            document.getElementById("snapshotNeeds").textContent =
                formatMoney(needs);

            document.getElementById("snapshotWants").textContent =
                formatMoney(wants);

            document.getElementById("snapshotSavings").textContent =
                formatMoney(savings);


            showToast("Your budget has been calculated.");

        }





        function formatMoney(number) {

            return "$" + Number(number).toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }
            );

        }





        function calculateSavings() {

            const goal =
                parseFloat(
                    document.getElementById("goalInput").value
                );

            const monthly =
                parseFloat(
                    document.getElementById("monthlySaveInput").value
                );

            if (!goal || goal <= 0) {

                showToast("Enter a valid savings goal.");

                return;

            }

            if (!monthly || monthly <= 0) {

                showToast("Enter a monthly saving amount.");

                return;

            }

            const months = Math.ceil(goal / monthly);

            const years = Math.floor(months / 12);

            const remainingMonths = months % 12;


            let timeText = "";

            if (years > 0 && remainingMonths > 0) {

                timeText =
                    years +
                    (years === 1 ? " year " : " years ") +
                    remainingMonths +
                    (remainingMonths === 1 ? " month" : " months");

            } else if (years > 0) {

                timeText =
                    years +
                    (years === 1 ? " year" : " years");

            } else {

                timeText =
                    months +
                    (months === 1 ? " month" : " months");

            }


            document.getElementById("savingMonths").textContent =
                timeText;


            document.getElementById("savingMessage").textContent =
                "At this pace, your target could be reached in approximately " +
                timeText +
                ".";


            document.getElementById("goalTarget").textContent =
                "Goal: " + formatMoney(goal);


            document.getElementById("goalProgress").textContent =
                formatMoney(monthly) + " / month";


            const progress = Math.min(
                (monthly / goal) * 100,
                100
            );

            document.getElementById("goalBar").style.width =
                progress + "%";


            showToast("Savings estimate updated.");

        }




        function classifyExpense(type) {

            const expense =
                document.getElementById("expenseInput").value.trim();

            const result =
                document.getElementById("classificationResult");


            if (!expense) {

                result.textContent =
                    "Write an expense first.";

                return;

            }


            if (type === "need") {

                result.innerHTML =
                    "✓ <strong>" +
                    escapeHTML(expense) +
                    "</strong> has been marked as a <strong>Need</strong>.";

            } else {

                result.innerHTML =
                    "+ <strong>" +
                    escapeHTML(expense) +
                    "</strong> has been marked as a <strong>Want</strong>.";

            }

        }



        function addExpense() {

            const name = prompt(
                "Enter the expense name:"
            );

            if (!name || !name.trim()) {
                return;
            }

            const amountInput = prompt(
                "Enter the amount:"
            );

            const amount =
                parseFloat(amountInput);

            if (!amount || amount <= 0) {

                showToast("Please enter a valid amount.");

                return;

            }


            const category =
                prompt(
                    "Enter a category:",
                    "Other"
                ) || "Other";


            const table =
                document.getElementById("expenseTableBody");


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${escapeHTML(name)}</td>

                <td>Today</td>

                <td>
                    <span class="category-tag">
                        ${escapeHTML(category)}
                    </span>
                </td>

                <td>${formatMoney(amount)}</td>

                <td>
                    <button
                        class="table-delete"
                        onclick="deleteExpense(this)">
                        Delete
                    </button>
                </td>

            `;


            table.appendChild(row);

            updateExpenseTotal();

            showToast("Expense added.");

        }





        function deleteExpense(button) {

            const row =
                button.closest("tr");

            row.remove();

            updateExpenseTotal();

            showToast("Expense removed.");

        }





        function updateExpenseTotal() {

            const rows =
                document.querySelectorAll(
                    "#expenseTableBody tr"
                );

            let total = 0;


            rows.forEach(function (row) {

                const amountCell =
                    row.cells[3];

                if (!amountCell) return;

                const number =
                    parseFloat(
                        amountCell.textContent
                            .replace(/[$,]/g, "")
                    );

                if (!isNaN(number)) {
                    total += number;
                }

            });


            document.getElementById("expenseTotal")
                .textContent =
                formatMoney(total);

        }





        function calculatePercentage() {

            const amount =
                parseFloat(
                    document.getElementById("percentNumber").value
                );

            const percentage =
                parseFloat(
                    document.getElementById("percentValue").value
                );


            const result =
                document.getElementById("percentageResult");


            if (
                isNaN(amount) ||
                isNaN(percentage)
            ) {

                result.textContent =
                    "Enter both numbers.";

                return;

            }


            const answer =
                amount * percentage / 100;


            result.innerHTML =
                "<strong>" +
                formatMoney(answer) +
                "</strong> is " +
                percentage +
                "% of " +
                formatMoney(amount) +
                ".";

        }




        function scrollToCalculator() {

            document
                .getElementById("calculator")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }


        function scrollToSavings() {

            document
                .getElementById("savings")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }



        let toastTimer;


        function showToast(message) {

            const toast =
                document.getElementById("toast");

            const toastMessage =
                document.getElementById("toastMessage");


            toastMessage.textContent =
                message;


            toast.classList.add("show");


            clearTimeout(toastTimer);


            toastTimer =
                setTimeout(function () {

                    toast.classList.remove("show");

                }, 3000);

        }





        function showToolMessage(tool) {

            showToast(
                tool +
                " tool is ready to use."
            );

        }





        function escapeHTML(value) {

            return value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        }





        const navLinks =
            document.querySelectorAll(".nav-link");


        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.forEach(function (item) {

                    item.classList.remove("active");

                });

                link.classList.add("active");

            });

        });





        const moneyChat = document.getElementById("moneyChat");
        const chatPanel = document.getElementById("chatPanel");
        const chatLauncher = document.getElementById("chatLauncher");
        const chatInput = document.getElementById("chatInput");
        const chatMessages = document.getElementById("chatMessages");

        function setChatOpen(open) {
            moneyChat.classList.toggle("is-open", open);
            chatPanel.setAttribute("aria-hidden", String(!open));
            chatLauncher.setAttribute("aria-expanded", String(open));
            if (open) chatInput.focus();
        }

        function addChatMessage(text, sender) {
            const row = document.createElement("div");
            row.className = "chat-message " + sender;
            const bubble = document.createElement("div");
            bubble.className = "chat-bubble";
            bubble.textContent = text;
            row.appendChild(bubble);
            chatMessages.appendChild(row);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function moneyBuddyReply(question) {
            const q = question.toLowerCase();
            if (/\b(hello|hi|hey)\b/.test(q)) return "Hi! 👋 I can help you get started with a budget, make a savings plan, or find your way around the tools. What are you working on?";
            if (/save|saving|goal/.test(q)) return "Try turning your goal into a monthly amount: divide the amount you need by the number of months you have. The savings planner on this page can estimate your timeline. Start with an amount that feels manageable, then review it each month.";
            if (/calculator|percent|percentage/.test(q)) return "The calculator tools are on this page. Enter your numbers in the relevant fields and the result updates when you calculate. For a quick percentage, multiply the amount by the percent and divide by 100.";
            if (/expense|spend|need|want/.test(q)) return "Use the expense classifier to think through a purchase: a need supports essentials or commitments, while a want is optional. Add an expense and choose Need or Want to classify it.";
            if (/budget|start|plan|income/.test(q)) return "Start by listing your take-home income and regular expenses. Set aside money for essentials first, then savings, and give yourself a realistic amount for flexible spending. The best budget is one you can keep adjusting as life changes.";
            if (/debt|invest|tax|loan|credit|financial advice/.test(q)) return "I can share general learning resources, but I can’t assess your personal finances or recommend specific investments, loans, or tax decisions. For a major decision, consider speaking with a qualified professional.";
            if (/thank/.test(q)) return "You’re welcome! If you tell me what you’re trying to work out, I’ll point you to a practical next step.";
            return "I’m here to help with budgeting basics, saving goals, expense choices, and the tools on this page. Tell me a little more about what you’re trying to do.";
        }

        function submitChat(text) {
            const question = (text || "").trim();
            if (!question) return;
            addChatMessage(question, "user");
            chatInput.value = "";
            window.setTimeout(function () {addChatMessage(moneyBuddyReply(question), "bot");}, 280);
        }

        chatLauncher.addEventListener("click", function () {setChatOpen(!moneyChat.classList.contains("is-open"));});
        document.getElementById("chatClose").addEventListener("click", function () {setChatOpen(false); chatLauncher.focus();});
        document.getElementById("chatForm").addEventListener("submit", function (event) {event.preventDefault(); submitChat(chatInput.value);});
        document.querySelectorAll(".chat-suggestions [data-prompt]").forEach(function (button) {
            button.addEventListener("click", function () {submitChat(button.dataset.prompt);});
        });
        document.addEventListener("keydown", function (event) {if (event.key === "Escape" && moneyChat.classList.contains("is-open")) {setChatOpen(false); chatLauncher.focus();} });

        calculateSavings();
        updateExpenseTotal();



        const dataPath = "../data/";

async function getData(file) {
    const response = await fetch(dataPath + file);
    return await response.json();
}

async function loadSite() {
    const site = await getData("site-content.json");

    document.querySelector(".brand-text small").textContent = site.site.tagline;
    document.querySelector(".hero-section h1").innerHTML = site.site.welcomeMessage;
    document.querySelector(".hero-section p").textContent = site.site.welcomeDescription;

    const tips = site.featuredTips;
    const resourceCards = document.querySelectorAll(".resource-card");

    tips.forEach((tip, index) => {
        if (resourceCards[index]) {
            resourceCards[index].querySelector("h3").textContent = tip.title;
            resourceCards[index].querySelector("p").textContent = tip.description;
        }
    });
}

async function loadBudgetRule() {
    const data = await getData("50-30-20.json");

    const percentages = data.budgetRule.percentages;

    document.querySelector(".needs-result strong").textContent = percentages.needs + "%";
    document.querySelector(".wants-result strong").textContent = percentages.wants + "%";
    document.querySelector(".savings-result strong").textContent = percentages.savings + "%";
}

function calculateBudget() {
    const income = Number(document.getElementById("incomeInput").value);

    if (!income || income < 0) {
        document.getElementById("needsAmount").textContent = "$0";
        document.getElementById("wantsAmount").textContent = "$0";
        document.getElementById("savingsAmount").textContent = "$0";
        return;
    }

    const needs = income * 0.50;
    const wants = income * 0.30;
    const savings = income * 0.20;

    document.getElementById("needsAmount").textContent = "$" + needs.toFixed(2);
    document.getElementById("wantsAmount").textContent = "$" + wants.toFixed(2);
    document.getElementById("savingsAmount").textContent = "$" + savings.toFixed(2);

    document.getElementById("snapshotIncome").textContent = "$" + income.toFixed(2);
    document.getElementById("snapshotNeeds").textContent = "$" + needs.toFixed(2);
    document.getElementById("snapshotWants").textContent = "$" + wants.toFixed(2);
    document.getElementById("snapshotSavings").textContent = "$" + savings.toFixed(2);
}

async function loadSavings() {
    const data = await getData("savings.json");

    const goal = data.savingsGoals.sampleGoal;

    document.getElementById("goalInput").value = goal.targetAmount;
    document.getElementById("monthlySaveInput").value = goal.monthlyContribution;

    calculateSavings();
}

function calculateSavings() {
    const target = Number(document.getElementById("goalInput").value);
    const monthly = Number(document.getElementById("monthlySaveInput").value);

    if (!target || target <= 0 || !monthly || monthly <= 0) {
        document.getElementById("savingMonths").textContent = "0 months";
        document.getElementById("savingMessage").textContent = "Enter valid amounts.";
        return;
    }

    const months = Math.ceil(target / monthly);

    document.getElementById("savingMonths").textContent = months + " months";
    document.getElementById("savingMessage").textContent =
        "At this pace, your target could be reached in approximately " + months + " months.";

    document.getElementById("goalProgress").textContent = "$0 saved";
    document.getElementById("goalTarget").textContent = "Goal: $" + target.toLocaleString();

    document.getElementById("goalBar").style.width = "0%";
}

async function loadNeedsWants() {
    const data = await getData("needs-wants.json");

    const examples = data.needsVsWants.examples;

    const needItems = document.querySelectorAll(".needs-title + .example-item");
    const wantItems = document.querySelectorAll(".wants-title + .example-item");

    if (examples) {
        console.log(examples);
    }
}

function classifyExpense(type) {
    const input = document.getElementById("expenseInput");
    const result = document.getElementById("classificationResult");

    if (!input.value.trim()) {
        result.textContent = "Please enter an expense first.";
        return;
    }

    if (type === "need") {
        result.textContent = input.value + " has been classified as a Need.";
    } else {
        result.textContent = input.value + " has been classified as a Want.";
    }
}

async function loadExpenses() {
    const data = await getData("expense-planner.json");

    const sample = data.expensePlanner.sampleBudget.expenses;

    const table = document.getElementById("expenseTableBody");

    table.innerHTML = "";

    sample.forEach(expense => {
        table.innerHTML += `
            <tr>
                <td>${expense.description}</td>
                <td>${expense.date}</td>
                <td>
                    <span class="category-tag education">
                        ${expense.category}
                    </span>
                </td>
                <td>$${expense.amount}</td>
                <td>
                    <button class="table-delete" onclick="deleteExpense(this)">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    updateExpenseTotal();
}

function addExpense() {
    const table = document.getElementById("expenseTableBody");

    table.innerHTML += `
        <tr>
            <td>New Expense</td>
            <td>Today</td>
            <td>
                <span class="category-tag">
                    Miscellaneous
                </span>
            </td>
            <td>$0</td>
            <td>
                <button class="table-delete" onclick="deleteExpense(this)">
                    Delete
                </button>
            </td>
        </tr>
    `;

    updateExpenseTotal();
}

function deleteExpense(button) {
    button.closest("tr").remove();
    updateExpenseTotal();
}

function updateExpenseTotal() {
    const rows = document.querySelectorAll("#expenseTableBody tr");
    let total = 0;

    rows.forEach(row => {
        const amount = row.children[3].textContent.replace("$", "");
        total += Number(amount) || 0;
    });

    document.getElementById("expenseTotal").textContent =
        "$" + total.toFixed(2);
}

async function loadChatbot() {
    const data = await getData("chatbot.json");

    window.chatbotData = data;
}

async function askChatbot(question) {
    const input = question.toLowerCase();
    const responses = window.chatbotData.responses;

    for (const item of responses) {
        for (const keyword of item.keywords) {
            if (input.includes(keyword.toLowerCase())) {
                return item.answer;
            }
        }
    }

    return window.chatbotData.fallback;
}

document.getElementById("chatForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");

    const question = input.value.trim();

    if (!question) return;

    messages.innerHTML += `
        <div class="user-message">${question}</div>
    `;

    const answer = await askChatbot(question);

    messages.innerHTML += `
        <div class="bot-message">${answer}</div>
    `;

    input.value = "";
});

async function loadContact() {
    const data = await getData("contact.json");

    const contact = data.contact.contactDetails;

    const container = document.getElementById("about");

    if (container) {
        console.log(contact);
    }
}

function calculatePercentage() {
    const number = Number(document.getElementById("percentNumber").value);
    const percent = Number(document.getElementById("percentValue").value);

    if (!number || !percent) {
        document.getElementById("percentageResult").textContent =
            "Enter valid numbers.";
        return;
    }

    const result = number * percent / 100;

    document.getElementById("percentageResult").textContent =
        "$" + result.toFixed(2);
}

function scrollToCalculator() {
    document.getElementById("calculator").scrollIntoView({
        behavior: "smooth"
    });
}

function scrollToSavings() {
    document.getElementById("savings").scrollIntoView({
        behavior: "smooth"
    });
}

function showToolMessage(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

document.getElementById("themeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    const icon = document.getElementById("themeIcon");

    if (document.body.classList.contains("dark-mode")) {
        icon.textContent = "☀";
    } else {
        icon.textContent = "☾";
    }
});

async function start() {
    await loadSite();
    await loadBudgetRule();
    await loadSavings();
    await loadNeedsWants();
    await loadExpenses();
    await loadChatbot();
    await loadContact();
}

start();