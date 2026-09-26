(function () {
    "use strict";

    const files = [
        "site-content", "navigation", "chatbot", "ui-settings", "footer", "about",
        "budgeting", "categories", "50-30-20", "needs-wants", "savings",
        "expense-planner", "mistakes", "tips", "search-data", "feedback",
        "contact", "sitemap", "quiz", "readme-data", "infographics"
    ];
    const esc = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
    const get = (path, fallback) => path.split(".").reduce((value, key) => value && value[key], window.budgetBasicsData || {}) || fallback;
    const anchorFor = (id) => ({
        "budgeting-basics":"learn", "needs-wants":"needs-wants", "50-30-20":"calculator",
        "savings-goals":"savings", "expense-planner":"tools", "ai-chatbot":"moneyChat",
        "money-mistakes":"money-mistakes", "contact":"contact", "feedback":"feedback",
        "infographics":"infographics", "sitemap":"sitemap"
    }[id] || id);

    function render() {
        const data = window.budgetBasicsData;
        const root = document.getElementById("jsonContent");
        if (!root || !data) return;
        const site = get("site-content.site", {});
        const about = get("about.about", {});
        const budget = get("budgeting.budgetingBasics", {});
        const rule = get("50-30-20.budgetRule", {});
        const needWant = get("needs-wants.needsVsWants", {});
        const tips = get("tips.tips", []);
        const mistakes = get("mistakes.mistakes", []);
        const categories = get("categories.categories", []);
        const quiz = get("quiz.quiz", {});
        const search = get("search-data", {});
        const sitemap = get("sitemap.sitemap", {});
        const contact = get("contact.contact", {});
        const feedback = get("feedback.feedback", {});
        const nav = get("navigation.navigation", {});
        const savings = get("savings.savingsGoals", {});
        const planner = get("expense-planner.expensePlanner", {});
        const ruleParts = rule.categories || [];
        const sampleBudget = budget.sampleMonthlyBudget || {};
        const cta = site.callToAction || {};
        const visitor = site.visitorCounter || {};
        const searchCategories = search.filterOptions?.topics || search.categories || [];

        const topicLinks = ((nav.menu || [])).map((item) => `<a href="#${esc(anchorFor(item.target))}">${esc(item.label)}</a>`).join("");
        const tipsMarkup = tips.map((item, index) => `<article class="json-card"><span class="json-eyebrow">${esc(item.category || "MONEY TIP")} · ${String(index + 1).padStart(2,"0")}</span><h3>${esc(item.title)}</h3><p>${esc(item.tip)}</p></article>`).join("");
        const mistakesMarkup = mistakes.map((item) => `<article class="json-card"><span class="json-eyebrow">COMMON MONEY MISTAKE</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><details><summary>See an example and what to try</summary><p><strong>Example:</strong> ${esc(item.scenario)}</p><p><strong>Try:</strong> ${esc(item.correctiveAction)}</p></details></article>`).join("");
        const facts = (site.quickFacts || []).map((fact) => `<li>${esc(fact.fact)}</li>`).join("");
        const purposes = (about.purpose || []).map((item) => `<li>${esc(item)}</li>`).join("");
        const features = (about.features || []).map((item) => `<span class="json-chip">${esc(item)}</span>`).join("");
        const categoriesMarkup = categories.map((item) => `<li><strong>${esc(item.name)}</strong><span>${esc(item.description)}</span></li>`).join("");
        const needsExamples = needWant.categories && needWant.categories.needs ? needWant.categories.needs.examples : [];
        const wantsExamples = needWant.categories && needWant.categories.wants ? needWant.categories.wants.examples : [];
        const guide = needWant.decisionGuide || [];
        const searchRows = (search.searchData || []).map((item) => `<article class="json-search-result" data-search-category="${esc(item.category)}" data-search-text="${esc([item.title,item.category,(item.keywords || []).join(" "),item.description].join(" ").toLowerCase())}"><span class="json-eyebrow">${esc(item.category)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></article>`).join("");
        const sitemapMarkup = (sitemap.sections || []).map((section) => `<div><h3>${esc(section.title)}</h3>${(section.links || []).map((link) => `<a href="#${esc(anchorFor(link.target))}">${esc(link.label)} →</a>`).join("")}</div>`).join("");
        const questions = quiz.questions || [];
        const quizMarkup = questions.map((question, index) => `<fieldset><legend>${index + 1}. ${esc(question.question)}</legend>${question.options.map((option) => `<label class="quiz-option"><input type="radio" name="budgetQuiz-${question.id}" value="${esc(option)}"><span>${esc(option)}</span></label>`).join("")}</fieldset>`).join("");
        const contactFields = (contact.form && contact.form.fields || []).map((field) => `<label>${esc(field.label)}${field.type === "textarea" ? `<textarea name="${esc(field.name)}" placeholder="${esc(field.placeholder || "")}" ${field.required ? "required" : ""}></textarea>` : `<input name="${esc(field.name)}" type="${esc(field.type)}" placeholder="${esc(field.placeholder || "")}" ${field.required ? "required" : ""}>`}</label>`).join("");
        const feedbackFields = (feedback.fields || []).map((field) => `<label>${esc(field.label)}${field.type === "textarea" ? `<textarea name="${esc(field.name)}" placeholder="${esc(field.placeholder || "")}" ${field.required ? "required" : ""}></textarea>` : `<input name="${esc(field.name)}" type="${esc(field.type)}" placeholder="${esc(field.placeholder || "")}" ${field.min ? `min="${esc(field.min)}"` : ""} ${field.max ? `max="${esc(field.max)}"` : ""} ${field.required ? "required" : ""}>`}</label>`).join("");
        const sampleRows = (planner.sampleBudget && planner.sampleBudget.sampleExpenses || []).map((item) => `<tr><td>${esc(item.description)}</td><td>${esc(item.date)}</td><td>${esc(item.category)}</td><td>${esc(item.amount)}</td></tr>`).join("");
        const savingTips = (savings.tips || []).map((tip) => `<li>${esc(tip)}</li>`).join("");
        const missingData = data.__missingFiles || [];

        root.innerHTML = `
            <section class="json-section" id="json-overview">
                <div class="json-section-heading"><span class="section-kicker">${esc(site.welcomeMessage || "BUDGETBASICS GUIDE")}</span><h2>${esc(site.tagline || "Learn today. Budget smart. Save tomorrow.")}</h2><p>${esc(site.welcomeDescription || "")}</p></div>
                <div class="json-facts"><h3>Quick money facts</h3><ul>${facts}</ul></div>
                <div class="json-cta"><div><span class="json-eyebrow">YOUR NEXT STEP</span><h3>${esc(cta.title || "Start your budgeting journey")}</h3><p>${esc(cta.description || "")}</p></div>${(cta.buttons || []).map((button) => `<a href="#${esc(anchorFor(button.target))}">${esc(button.text)} →</a>`).join("")}</div>
                ${visitor.enabled ? `<p class="json-visitor">${esc(visitor.label || "Visitors")}: <strong>${Number(visitor.initialCount || 0).toLocaleString()}</strong> · Demo display count</p>` : ""}
                <h3 class="json-subheading">Featured tips</h3><div class="json-grid">${(site.featuredTips || []).map((tip) => `<article class="json-card"><h3>${esc(tip.title)}</h3><p>${esc(tip.description)}</p></article>`).join("")}</div>
                <div class="json-link-cloud" aria-label="All site topics">${topicLinks}</div>
            </section>
            <section class="json-section" id="budgeting-basics"><div class="json-section-heading"><span class="section-kicker">LEARN THE BASICS</span><h2>${esc(budget.title || "Budgeting Basics")}</h2><p>${esc(budget.introduction || "")}</p></div><div class="json-grid">${(budget.concepts || []).map((item) => `<article class="json-card"><span class="json-eyebrow">BUDGET CONCEPT</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><p class="json-examples">${(item.examples || []).map(esc).join(" · ")}</p></article>`).join("")}</div><div class="json-callout"><strong>${esc(sampleBudget.title || "Sample monthly budget")} · ${esc(sampleBudget.currency || "")}${Number(sampleBudget.monthlyIncome || 0).toLocaleString()}</strong><p>${(sampleBudget.expenses || []).map((item) => `${esc(item.category)} ${esc(sampleBudget.currency || "")}${Number(item.amount).toLocaleString()}`).join(" · ")} · Savings ${esc(sampleBudget.currency || "")}${Number(sampleBudget.savings || 0).toLocaleString()}</p></div></section>
            <section class="json-section" id="needs-wants"><div class="json-section-heading"><span class="section-kicker">MAKE A THOUGHTFUL CHOICE</span><h2>${esc(needWant.title || "Needs vs Wants")}</h2><p>${esc(needWant.description || "")}</p></div><div class="json-grid json-two-col"><article class="json-card json-need"><h3>${esc(needWant.categories?.needs?.title || "Needs")}</h3><p>${esc(needWant.categories?.needs?.description || "")}</p><p class="json-examples">${needsExamples.map(esc).join(" · ")}</p></article><article class="json-card json-want"><h3>${esc(needWant.categories?.wants?.title || "Wants")}</h3><p>${esc(needWant.categories?.wants?.description || "")}</p><p class="json-examples">${wantsExamples.map(esc).join(" · ")}</p></article></div><ol class="json-guide">${guide.map((step) => `<li><strong>${esc(step.question)}</strong><span>${esc(step.ifYes)} ${esc(step.ifNo)}</span></li>`).join("")}</ol><p class="json-disclaimer">${esc(needWant.generalFeedback?.correct || "")} ${esc(needWant.generalFeedback?.incorrect || "")}</p></section>
            <section class="json-section" id="50-30-20"><div class="json-section-heading"><span class="section-kicker">A STARTING POINT</span><h2>${esc(rule.title || "50-30-20 Budget Rule")}</h2><p>${esc(rule.description || "")}</p></div><div class="json-grid json-three-col">${ruleParts.map((part) => `<article class="json-card json-rule-card"><strong class="json-percent">${esc(part.percentage)}%</strong><h3>${esc(part.name)}</h3><p>${esc(part.description)}</p></article>`).join("")}</div><p class="json-disclaimer">${esc(rule.educationalNote || "")}</p></section>
            <section class="json-section" id="saving-guide"><div class="json-section-heading"><span class="section-kicker">MAKE A PLAN</span><h2>${esc(savings.title || "Savings Goals")}</h2><p>${esc(savings.description || "")}</p></div><ul class="json-tip-list">${savingTips}</ul><div class="json-callout">Example: ${esc(savings.sampleGoal?.goalName || "Savings goal")} · ${Number(savings.sampleGoal?.targetAmount || 0).toLocaleString()} target · ${Number(savings.sampleGoal?.currentSavings || 0).toLocaleString()} already saved · ${Number(savings.sampleGoal?.monthlyContribution || 0).toLocaleString()} each month · about ${esc(savings.sampleGoal?.estimatedMonths || "")} months.</div><p class="json-disclaimer">${esc(savings.educationalNote || "")}</p></section>
            <section class="json-section" id="expense-planner"><div class="json-section-heading"><span class="section-kicker">PLAN YOUR SPENDING</span><h2>${esc(planner.title || "Expense Planner")}</h2><p>${esc(planner.description || "")}</p></div><p class="json-callout">Sample income: ${Number(planner.sampleBudget?.monthlyIncome || 0).toLocaleString()} · Planned expenses: ${Number(planner.sampleBudget?.totalPlannedExpenses || 0).toLocaleString()} · Remaining: ${Number(planner.sampleBudget?.remainingBalance || 0).toLocaleString()}</p><ul class="json-category-list">${categoriesMarkup}</ul><div class="expense-table-wrap"><table class="expense-table"><thead><tr><th>Sample expense</th><th>Date</th><th>Category</th><th>Amount (${esc(get("budgeting.budgetingBasics.sampleMonthlyBudget.currency", ""))})</th></tr></thead><tbody>${sampleRows}</tbody></table></div><p class="json-disclaimer">${esc(planner.note || "")}</p></section>
            <section class="json-section" id="money-mistakes"><div class="json-section-heading"><span class="section-kicker">LEARN FROM COMMON PITFALLS</span><h2>Money mistakes to watch for</h2><p>Examples and practical corrections from the BudgetBasics guide.</p></div><div class="json-grid">${mistakesMarkup}</div></section>
            <section class="json-section" id="daily-tips"><div class="json-section-heading"><span class="section-kicker">SMALL HABITS, REAL PROGRESS</span><h2>Tips for your next money decision</h2></div><div class="json-grid">${tipsMarkup}</div></section>
            <section class="json-section" id="search"><div class="json-section-heading"><span class="section-kicker">FIND A TOPIC</span><h2>Search the money guide</h2></div><label class="json-search-label" for="guideSearch">Search budgeting, savings, needs, expenses and more</label><input class="json-search" id="guideSearch" type="search" placeholder="Try “saving” or “overspending”"><label class="json-search-label" for="guideCategory">Filter by topic</label><select class="json-search" id="guideCategory"><option value="">All topics</option>${searchCategories.map((item) => `<option value="${esc(item)}">${esc(item)}</option>`).join("")}</select><p id="searchStatus" class="json-disclaimer" aria-live="polite"></p><div class="json-grid json-search-grid">${searchRows}</div></section>
            <section class="json-section" id="knowledge-check"><div class="json-section-heading"><span class="section-kicker">QUICK KNOWLEDGE CHECK</span><h2>${esc(quiz.title || "Budgeting quiz")}</h2><p>${esc(quiz.description || "")}</p></div><form id="budgetQuizForm" class="json-quiz">${quizMarkup}<button class="calculate-button" type="submit">Check answers →</button><p id="quizFeedback" aria-live="polite"></p></form></section>
            <section class="json-section" id="about-project"><div class="json-section-heading"><span class="section-kicker">${esc(about.theme || "ABOUT")}</span><h2>${esc(about.title || "About BudgetBasics")}</h2><p>${esc(about.description || "")}</p></div><h3>What this project helps you learn</h3><ul class="json-purpose">${purposes}</ul><div class="json-chip-list">${features}</div><h3 class="json-subheading">${esc(about.creators?.title || "Project team")}</h3><div class="json-grid json-two-col">${(about.creators?.members || []).map((person) => `<article class="json-card"><h3>${esc(person.name)}</h3><p>${esc(person.role)}</p></article>`).join("")}</div><p class="json-disclaimer">${esc(about.disclaimer || "")}</p></section>
            <section class="json-section" id="contact"><div class="json-section-heading"><span class="section-kicker">GET IN TOUCH</span><h2>${esc(contact.title || "Contact Us")}</h2><p>${esc(contact.description || "")}</p></div><p>Email: <a href="mailto:${esc(contact.contactDetails?.email || "support@budgetbasics.com")}">${esc(contact.contactDetails?.email || "")}</a> · Phone: <a href="tel:${esc((contact.contactDetails?.phone || "").replace(/[^+\d]/g,""))}">${esc(contact.contactDetails?.phone || "")}</a></p><form id="contactForm" class="json-form">${contactFields}<button class="calculate-button" type="submit">Send message</button><p class="json-disclaimer">${esc(contact.form?.privacyNote || "")}</p><p class="form-feedback" aria-live="polite"></p></form></section>
            <section class="json-section" id="feedback"><div class="json-section-heading"><span class="section-kicker">HELP US IMPROVE</span><h2>${esc(feedback.title || "Feedback")}</h2><p>${esc(feedback.description || "")}</p></div><form id="feedbackForm" class="json-form">${feedbackFields}<button class="calculate-button" type="submit">Share feedback</button><p class="json-disclaimer">${esc(feedback.privacyNote || "")}</p><p class="form-feedback" aria-live="polite"></p></form></section>
            <section class="json-section" id="sitemap"><div class="json-section-heading"><span class="section-kicker">FIND YOUR WAY</span><h2>${esc(sitemap.title || "Sitemap")}</h2><p>${esc(sitemap.description || "")}</p></div><div class="json-sitemap">${sitemapMarkup}</div></section>
        `;

        document.querySelectorAll(".main-nav .nav-link").forEach((link) => {
            const text = link.textContent.trim().toLowerCase();
            const match = (nav.menu || []).find((item) => item.label.toLowerCase() === text);
            if (match) link.href = `#${anchorFor(match.target)}`;
        });
        const brandTagline = document.querySelector(".brand-text small");
        if (brandTagline && nav.navigation?.brand?.tagline) brandTagline.textContent = nav.navigation.brand.tagline;
        const footer = get("footer.footer", {});
        const footerBrand = document.querySelector(".footer-brand p");
        if (footerBrand && footer.brand?.description) footerBrand.textContent = footer.brand.description;
        const footerLinks = document.querySelector(".footer-links");
        if (footerLinks && footer.quickLinks) footerLinks.innerHTML = footer.quickLinks.concat(footer.resources || []).map((link) => `<a href="#${esc(anchorFor(link.target))}">${esc(link.label)}</a>`).join("");
        const copyright = document.querySelector(".footer-meta span");
        if (copyright && footer.copyright) copyright.textContent = footer.copyright;
        const tipCard = document.querySelector(".tip-card");
        if (tipCard && tips.length) {
            const chosen = tips[new Date().getDate() % tips.length];
            tipCard.querySelector("h3").textContent = chosen.title;
            tipCard.querySelector("p").textContent = chosen.tip;
        }
        const percentages = rule.percentages || {};
        const sampleGoal = savings.sampleGoal || {};
        if (sampleGoal.goalName) document.getElementById("goalNameInput").value = sampleGoal.goalName;
        if (Number.isFinite(Number(sampleGoal.targetAmount))) document.getElementById("goalInput").value = sampleGoal.targetAmount;
        if (Number.isFinite(Number(sampleGoal.currentSavings))) document.getElementById("currentSavingsInput").value = sampleGoal.currentSavings;
        if (Number.isFinite(Number(sampleGoal.monthlyContribution))) document.getElementById("monthlySaveInput").value = sampleGoal.monthlyContribution;
        if (sampleGoal.targetAmount) window.calculateSavings?.();
        ["needs", "wants", "savings"].forEach((key) => {
            const amount = Number(percentages[key]);
            const label = document.querySelector(`.${key}-result .result-top strong`);
            if (label && Number.isFinite(amount)) label.textContent = `${amount}%`;
        });
        const chatData = data.chatbot || {};
        window.budgetBasicsChatData = chatData;
        const suggestionBox = document.querySelector(".chat-suggestions");
        if (suggestionBox && chatData.suggestedPrompts) suggestionBox.innerHTML = chatData.suggestedPrompts.map((prompt) => `<button type="button" data-prompt="${esc(prompt)}">${esc(prompt)} <span>↗</span></button>`).join("");
        if (chatData.disclaimer) document.querySelector(".chat-footnote").textContent = chatData.disclaimer;
        suggestionBox?.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => window.submitBudgetBasicsChat?.(button.dataset.prompt)));

        const searchInput = document.getElementById("guideSearch");
        const categoryInput = document.getElementById("guideCategory");
        const searchStatus = document.getElementById("searchStatus");
        const applySearch = () => {
            const query = searchInput.value.trim().toLowerCase();
            const category = categoryInput.value;
            let shown = 0;
            document.querySelectorAll(".json-search-result").forEach((card) => {
                const match = (!query || card.dataset.searchText.includes(query)) && (!category || card.dataset.searchCategory === category);
                card.hidden = !match;
                if (match) shown++;
            });
            searchStatus.textContent = query && !shown ? (search.searchRules?.noMatchMessage || "No results found.") : (!query && !category ? (search.searchRules?.emptySearchMessage || "") : "");
        };
        searchInput?.addEventListener("input", applySearch);
        categoryInput?.addEventListener("change", applySearch);
        document.getElementById("budgetQuizForm")?.addEventListener("submit", (event) => {
            event.preventDefault();
            const answers = new FormData(event.currentTarget);
            const result = document.getElementById("quizFeedback");
            if (questions.some((item) => !answers.get(`budgetQuiz-${item.id}`))) { result.textContent = "Answer each question first."; return; }
            const score = questions.filter((item) => answers.get(`budgetQuiz-${item.id}`) === item.correctAnswer).length;
            const level = score === questions.length ? "excellent" : score >= Math.ceil(questions.length * .6) ? "good" : "needsPractice";
            const resultMessages = quiz.resultMessages || {};
            result.textContent = `${score} / ${questions.length}. ${resultMessages[level] || "Review the guide and try again."}`;
        });
        [["contactForm", contact.form?.successMessage], ["feedbackForm", feedback.successMessage]].forEach(([id, message]) => {
            document.getElementById(id)?.addEventListener("submit", (event) => {
                event.preventDefault();
                if (!event.currentTarget.reportValidity()) return;
                event.currentTarget.querySelector(".form-feedback").textContent = message || "Thanks for sharing.";
                event.currentTarget.reset();
            });
        });
        const appearance = get("ui-settings.uiSettings", {});
        if (appearance.animations?.smoothScrolling === false) document.documentElement.style.scrollBehavior = "auto";
        if (appearance.accessibility?.visibleFocus) document.body.classList.add("data-visible-focus");
        if (appearance.backToTop?.enabled || appearance.backToTop?.showAfterScroll) {
            const topButton = document.createElement("button");
            topButton.className = "json-back-top";
            topButton.type = "button";
            topButton.textContent = appearance.backToTop.label || "Back to Top";
            topButton.setAttribute("aria-label", topButton.textContent);
            topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
            document.body.appendChild(topButton);
            window.addEventListener("scroll", () => topButton.classList.toggle("visible", window.scrollY > 500), { passive: true });
        }
        if (appearance.navigation?.mobileMenu && nav.mobileMenu?.enabled) {
            const menu = document.createElement("details");
            menu.className = "json-mobile-menu";
            menu.innerHTML = `<summary>${esc(nav.mobileMenu.buttonLabel || "Explore")}</summary><div>${topicLinks}</div>`;
            document.querySelector(".site-header .header-inner")?.appendChild(menu);
        }
        window.budgetBasicsDateTimeSettings = site.dateTime || {};
        if (site.dateTime?.showDate === false) document.querySelector(".current-date")?.setAttribute("hidden", "");
        if (site.dateTime?.showTime === false) document.querySelector(".live-clock")?.setAttribute("hidden", "");
        if (appearance.navigation?.activeState) {
            document.addEventListener("click", (event) => {
                const link = event.target.closest('a[href^="#"]');
                if (!link) return;
                document.querySelectorAll(".nav-link").forEach((item) => item.classList.toggle("active", item.getAttribute("href") === link.getAttribute("href")));
            });
        }
        root.dataset.loaded = "true";
    }

    Promise.all(files.map(async (name) => {
        try {
            const response = await fetch(`./data/${name}.json`, { cache: "no-cache" });
            if (!response.ok) throw new Error(String(response.status));
            return [name, await response.json()];
        } catch (error) {
            return [name, null];
        }
    })).then((entries) => {
        const loaded = Object.fromEntries(entries.filter(([, value]) => value));
        loaded.__loadedCount = Object.keys(loaded).length;
        loaded.__missingFiles = entries.filter(([, value]) => !value).map(([name]) => `${name}.json`);
        window.budgetBasicsData = loaded;
        if (loaded.__loadedCount) render();
        if (!loaded.__loadedCount) {
            const root = document.getElementById("jsonContent");
            if (root) root.innerHTML = '<p class="data-load-note">Run this site with a local web server to load its JSON content.</p>';
        } else if (loaded.__missingFiles.includes("infographics.json")) {
            const missing = document.createElement("p");
            missing.className = "json-disclaimer";
            missing.textContent = "Infographics are listed in readme-data.json, but data/infographics.json is not present yet.";
            document.getElementById("jsonContent")?.appendChild(missing);
        }
    });
})();
