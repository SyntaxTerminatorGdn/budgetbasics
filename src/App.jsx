import { useEffect, useMemo, useState } from 'react';
import { basics, botResponses, budgetRule, expensesConfig, siteData, tips } from './data.js';

const expenseCategories = expensesConfig.fields?.find(field => field.name === 'category')?.options
  ?? siteData.categories?.categories?.map(category => category.name)
  ?? [];

const locations = [
  ['Asia/Karachi', 'Pakistan', 'PKR'], ['Asia/Dubai', 'United Arab Emirates', 'AED'],
  ['Asia/Riyadh', 'Saudi Arabia', 'SAR'], ['Asia/Kolkata', 'India', 'INR'],
  ['Europe/London', 'United Kingdom', 'GBP'], ['Europe/Paris', 'France', 'EUR'],
  ['Europe/Berlin', 'Germany', 'EUR'], ['America/New_York', 'United States — New York', 'USD'],
  ['America/Chicago', 'United States — Chicago', 'USD'], ['America/Denver', 'United States — Denver', 'USD'],
  ['America/Los_Angeles', 'United States — Los Angeles', 'USD'], ['America/Toronto', 'Canada — Toronto', 'CAD'],
  ['Australia/Sydney', 'Australia — Sydney', 'AUD'], ['Asia/Tokyo', 'Japan', 'JPY'],
  ['Asia/Seoul', 'South Korea', 'KRW'], ['Asia/Singapore', 'Singapore', 'SGD'],
  ['Asia/Dhaka', 'Bangladesh', 'BDT'], ['Africa/Cairo', 'Egypt', 'EGP'],
];

const moneyValue = (amount, currency) => new Intl.NumberFormat('en', {
  style: 'currency', currency, maximumFractionDigits: 0,
}).format(Number(amount) || 0);
function InfographicVisual({ item }) {
  const content = {
    matrix: <div className="visual-matrix"><div><strong>NEEDS</strong><span>Rent · Food · Transit</span></div><div><strong>WANTS</strong><span>Takeout · Gaming · Extras</span></div></div>,
    circular_split: <div className="visual-split"><div><strong>50%</strong><span>Needs</span></div><div><strong>30%</strong><span>Wants</span></div><div><strong>20%</strong><span>Save</span></div></div>,
    cycle: <div className="visual-cycle">{['Receive', 'Plan', 'Track', 'Review'].map((step, index) => <div key={step}><b>0{index + 1}</b><span>{step}</span></div>)}</div>,
    challenges: <div className="visual-challenges">{[['52', 'Week plan'], ['$5', 'Spare change'], ['0', 'Spend weekend']].map(([amount, label]) => <div key={label}><b>{amount}</b><span>{label}</span></div>)}</div>,
  };
  return <div className={`infographic-visual ${item.type}`} role="img" aria-label={item.alt}>{content[item.type] ?? <span>{item.title}</span>}</div>;
}

function App() {
  const [timezone, setTimezone] = useState(() => localStorage.getItem('budgetbasics-timezone') || 'Asia/Karachi');
  const [now, setNow] = useState(new Date());
  const [dark, setDark] = useState(() => localStorage.getItem('budgetbasics-theme') === 'dark');
  const [currency, setCurrency] = useState('PKR');
  const [income, setIncome] = useState('');
  const [budget, setBudget] = useState(null);
  const [goal, setGoal] = useState(siteData.savings?.savingsGoals?.sampleGoal ?? { targetAmount: 60000, currentSavings: 15000, monthlyContribution: 5000, goalName: 'New Laptop' });
  const [goalInputs, setGoalInputs] = useState({ name: String(goal.goalName ?? ''), target: String(goal.targetAmount), monthly: String(goal.monthlyContribution), current: String(goal.currentSavings ?? 0) });
  const [savingEstimate, setSavingEstimate] = useState(null);
  const [expenses, setExpenses] = useState(expensesConfig.sampleBudget?.sampleExpenses ?? []);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', category: expenseCategories[0] ?? 'Food' });
  const [classification, setClassification] = useState('');
  const [classifiedAs, setClassifiedAs] = useState('');
  const [percent, setPercent] = useState({ amount: '', value: '' });
  const [spendingTipIndex, setSpendingTipIndex] = useState(0);
  const [percentResult, setPercentResult] = useState('Result will appear here.');
  const [toast, setToast] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(Number(siteData['site-content']?.site?.visitorCounter?.initialCount ?? 0));
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [resourceQuery, setResourceQuery] = useState('');
  const [resourceCategory, setResourceCategory] = useState('all');
  const [resourceSort, setResourceSort] = useState('relevance');
  const [showAllResources, setShowAllResources] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeResult, setChallengeResult] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizResult, setQuizResult] = useState('');
  const [quizScore, setQuizScore] = useState(0);

  const split = budgetRule.percentages ?? { needs: 50, wants: 30, savings: 20 };
  const expenseTotal = useMemo(() => expenses.reduce((total, item) => total + Number(item.amount || 0), 0), [expenses]);
  const monthlyBudget = Number(expensesConfig.sampleBudget?.monthlyIncome ?? 30000);
  const spendingTips = siteData.tips_data?.ai_spending_tips ?? [];
  const visibleTip = spendingTips.length ? spendingTips[spendingTipIndex % spendingTips.length] : tips[0];
  const profiles = siteData.sample_budget?.profiles ?? [];
  const creatorMembers = (siteData.about?.about?.creators?.members ?? []).filter(member => member.name && !/^team member\s*\d*$/i.test(member.name));
  const socialLinks = Object.entries(siteData.contact?.contact?.contactDetails?.socialMedia ?? {}).filter(([, url]) => url && url !== '#');
  const needsQuestions = siteData['needs-wants']?.needsVsWants?.questions ?? [];
  const quizQuestions = siteData.quiz?.quiz?.questions ?? [];
  const currentChallenge = needsQuestions[challengeIndex];
  const currentQuizQuestion = quizQuestions[quizIndex];
  const searchableResources = useMemo(() => {
    const all = [
      ...tips.map(item => ({ title: item.title, description: item.tip, category: item.category })),
      ...(siteData.infographics_data?.infographics ?? []).map(item => ({ title: item.title, description: item.caption, category: item.category, keywords: [item.topic, item.badge] })),
      ...(siteData['tips_data']?.searchable_tips ?? []).map(item => ({ title: item.title, description: item.summary || item.content, category: item.category })),
      ...(siteData['search-data']?.searchData ?? []).map(item => ({ title: item.title, description: item.description, category: item.category, keywords: item.keywords })),
      ...(siteData.mistakes?.mistakes ?? []).map(item => ({ title: item.title, description: item.correctiveAction, category: 'Money habits' })),
    ];
    return all.filter((item, index) => all.findIndex(match => match.title === item.title) === index);
  }, []);
  const resourceCategories = [...new Set(searchableResources.map(item => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const filteredResources = searchableResources.filter(item => (resourceCategory === 'all' || item.category === resourceCategory) && `${item.title} ${item.description} ${item.category} ${(item.keywords ?? []).join(' ')}`.toLowerCase().includes(resourceQuery.toLowerCase())).sort((a, b) => resourceSort === 'title' ? a.title.localeCompare(b.title) : resourceSort === 'category' ? (a.category ?? '').localeCompare(b.category ?? '') || a.title.localeCompare(b.title) : 0);
  const displayedResources = resourceQuery || resourceCategory !== 'all' || showAllResources ? filteredResources : filteredResources.slice(0, 3);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('budgetbasics-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('budgetbasics-timezone', timezone);
    const found = locations.find(([zone]) => zone === timezone);
    if (found) setCurrency(found[2]);
  }, [timezone]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActiveNav(current.target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .2, .5] });
    ['home', 'learn', 'needs-wants', 'calculator', 'savings', 'tools', 'money-mistakes', 'resources', 'infographics', 'about'].forEach(id => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const countKey = 'budgetbasics-local-visitor-count';
    const visitKey = 'budgetbasics-visit-counted';
    let count = Number(localStorage.getItem(countKey) ?? siteData['site-content']?.site?.visitorCounter?.initialCount ?? 0);
    if (!sessionStorage.getItem(visitKey)) {
      count += 1;
      localStorage.setItem(countKey, String(count));
      sessionStorage.setItem(visitKey, 'true');
    }
    setVisitorCount(count);
    const onScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const notify = message => setToast(message);
  const scrollTo = id => {
    const target = document.getElementById(id);
    target?.closest('details')?.setAttribute('open', '');
    target?.scrollIntoView({ behavior: 'smooth' });
  };
  const clock = new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(now);
  const date = new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(now);

  useEffect(() => {
    const site = siteData['site-content']?.site;
    if (site?.name) document.title = `${site.name} — Smart Money Tools`;
  }, []);

  function calculateBudget(event) {
    event.preventDefault();
    const amount = Number(income);
    if (!Number.isFinite(amount) || amount <= 0) return notify(budgetRule.validation?.invalid ?? 'Enter a valid monthly income.');
    const result = { income: amount, needs: amount * split.needs / 100, wants: amount * split.wants / 100, savings: amount * split.savings / 100 };
    setBudget(result);
    notify('Your budget has been calculated.');
  }

  function calculateSavings(event) {
    event.preventDefault();
    const name = goalInputs.name.trim();
    const target = Number(goalInputs.target);
    const monthly = Number(goalInputs.monthly);
    const current = Number(goalInputs.current);
    if (!name || !Number.isFinite(target) || !Number.isFinite(current) || !Number.isFinite(monthly) || target <= 0 || current < 0 || monthly <= 0) return notify('Enter a goal name, a valid target, non-negative current savings, and a monthly amount above zero.');
    const remaining = Math.max(0, target - current);
    const months = Math.ceil(remaining / monthly);
    setGoal({ ...goal, goalName: name, targetAmount: target, currentSavings: current, monthlyContribution: monthly });
    setSavingEstimate({ months, remaining, progress: Math.min(current / target * 100, 100) });
    notify('Savings estimate updated.');
  }

  function addExpense(event) {
    event.preventDefault();
    const amount = Number(expenseForm.amount);
    if (!expenseForm.description.trim() || amount <= 0) return notify('Add an expense name and a valid amount.');
    if (editingExpenseId) {
      setExpenses(current => current.map(item => item.id === editingExpenseId ? { ...item, ...expenseForm, amount } : item));
      setEditingExpenseId(null);
      notify('Expense updated.');
    } else {
      setExpenses(current => [...current, { id: `${Date.now()}`, date: new Date().toISOString().slice(0, 10), description: expenseForm.description.trim(), amount, category: expenseForm.category }]);
      notify('Expense added.');
    }
    setExpenseForm(current => ({ ...current, description: '', amount: '' }));
  }

  function exportExpenses() {
    const rows = [['Description', 'Date', 'Category', 'Amount'], ...expenses.map(item => [item.description, item.date, item.category, item.amount])];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'budgetbasics-expenses.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function answerChallenge(answer) {
    if (!currentChallenge) return;
    const correct = answer.toLowerCase() === currentChallenge.correctAnswer.toLowerCase();
    setChallengeResult(`${correct ? (siteData['needs-wants']?.needsVsWants?.generalFeedback?.correct ?? 'Correct!') : (siteData['needs-wants']?.needsVsWants?.generalFeedback?.incorrect ?? 'Try again.')} ${currentChallenge.feedback ?? ''}`);
  }

  function answerQuiz(option) {
    if (!currentQuizQuestion) return;
    const correct = option === currentQuizQuestion.correctAnswer;
    if (correct) setQuizScore(value => value + 1);
    setQuizResult(correct ? currentQuizQuestion.feedback : `Not quite. ${currentQuizQuestion.feedback}`);
    window.setTimeout(() => {
      if (quizIndex + 1 < quizQuestions.length) {
        setQuizIndex(index => index + 1);
        setQuizResult('');
      } else {
        const finalScore = quizScore + (correct ? 1 : 0);
        const messages = siteData.quiz?.quiz?.resultMessages;
        setQuizResult(finalScore === quizQuestions.length ? messages?.excellent : finalScore >= Math.ceil(quizQuestions.length / 2) ? messages?.good : messages?.needsPractice);
        setQuizIndex(0);
        setQuizScore(0);
      }
    }, 950);
  }

  function chooseProfile(profile) {
    setSelectedProfile(profile);
    setIncome(String(profile.monthlyIncome));
    setBudget({ income: profile.monthlyIncome, needs: profile.summary?.totalNeeds ?? profile.monthlyIncome * split.needs / 100, wants: profile.summary?.totalWants ?? profile.monthlyIncome * split.wants / 100, savings: profile.summary?.totalSavings ?? profile.monthlyIncome * split.savings / 100 });
    notify(`${profile.profileName} sample loaded.`);
  }

  function classify(type) {
    if (!classification.trim()) return notify('Write an expense first.');
    setClassifiedAs(type);
  }

  function calculatePercentage(event) {
    event.preventDefault();
    const amount = Number(percent.amount);
    const percentage = Number(percent.value);
    if (!Number.isFinite(amount) || !Number.isFinite(percentage)) return setPercentResult('Enter both numbers.');
    setPercentResult(`${moneyValue(amount * percentage / 100, currency)} is ${percentage}% of ${moneyValue(amount, currency)}.`);
  }

  function getAnswer(question) {
    const normalized = question.toLowerCase();
    const match = botResponses.find(item => {
      const words = item.keywords ?? [item.question, item.topic, item.category].filter(Boolean);
      return words.some(word => word && normalized.includes(String(word).toLowerCase()));
    });
    if (match?.answer) return match.answer.replaceAll('**', '');
    return siteData.chatbot?.fallback ?? siteData.faq_chatbot?.fallback_response ?? 'I can help you get started with budgeting, savings, expenses, and needs versus wants.';
  }

  function sendChat(event, prompt = chatInput) {
    event?.preventDefault();
    const question = prompt.trim();
    if (!question || chatBusy) return;
    setMessages(current => [...current, { role: 'user', text: question }]);
    setChatInput('');
    setChatBusy(true);
    window.setTimeout(() => {
      setMessages(current => [...current, { role: 'assistant', text: getAnswer(question) }]);
      setChatBusy(false);
    }, 350);
  }

  const navItems = [
    ['home', 'Home'], ['learn', 'Basics'], ['needs-wants', 'Needs vs Wants'], ['calculator', '50/30/20'], ['savings', 'Savings'], ['tools', 'Expenses'], ['money-mistakes', 'Money Mistakes'], ['infographics', 'Infographics'], ['ai-chatbot', 'Chatbot'], ['feedback', 'Feedback'], ['contact', 'Contact'], ['about', 'About'],
  ];

  return (
    <>
      <div className="top-strip"><div className="top-strip-inner">
        <div className="current-date"><span className="status-dot" /><span>{date}</span></div>
        <span className="visitor-count" title="Count stored on this browser">{siteData['site-content']?.site?.visitorCounter?.label ?? 'Visitors'} on this browser: {visitorCount.toLocaleString()}</span>
          <div className="location-clock"><label htmlFor="countrySelect">Location</label>
          <select id="countrySelect" value={timezone} onChange={event => setTimezone(event.target.value)}>{locations.map(([zone, name]) => <option value={zone} key={zone}>{name}</option>)}</select>
          <div className="live-clock"><span className="clock-icon">◷</span><strong>{clock}</strong></div>
        </div>
      </div></div>

      <header className="site-header"><div className="header-inner">
        <a href="#home" className="brand" aria-label="BudgetBasics home"><span className="brand-mark"><i className="coin coin-one" /><i className="coin coin-two" /><i className="leaf" /></span><span className="brand-text"><strong>Budget<span>Basics</span></strong><small>{siteData['site-content']?.site?.tagline ?? 'Learn Today. Budget Smart. Save Tomorrow.'}</small></span></a>
        <nav className={`main-nav ${mobileNavOpen ? 'is-open' : ''}`} aria-label="Main navigation">{navItems.map(([id, label]) => <a key={id} href={`#${id}`} onClick={event => { setMobileNavOpen(false); setActiveNav(id); if (id === 'ai-chatbot') { event.preventDefault(); setChatOpen(true); } else document.getElementById(id)?.closest('details')?.setAttribute('open', ''); }} className={`nav-link ${activeNav === id ? 'active' : ''}`}>{label}</a>)}</nav>
        <button type="button" className="mobile-nav-toggle" onClick={() => setMobileNavOpen(value => !value)} aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileNavOpen}><span /><span /><span /></button>
        <button type="button" className="theme-toggle" onClick={() => setDark(value => !value)} aria-label="Toggle dark mode"><span>{dark ? '☀' : '☾'}</span></button>
      </div></header>

      <main id="home">
        <section className="hero-section">
          <div className="hero-content"><span className="hero-eyebrow">BUDGETBETTER, ONE STEP AT A TIME</span><h1>Make your money <em>make sense.</em></h1><p>Simple tools for budgeting, saving and understanding where your money actually goes.</p>
            <div className="hero-buttons"><a href="#calculator" className="button button-primary">Start budgeting <span>→</span></a><a href="#tools" className="button button-secondary">Browse tools</a><a href="#savings" className="button button-secondary">Set a savings goal</a></div>
            <div className="hero-note"><span><b>✓</b>No account required</span><span><b>✓</b>Free to use</span><span><b>✓</b>Made for everyday decisions</span></div>
          </div>
          <div className="hero-side-card"><div className="mini-card-top"><span>THIS MONTH</span><span className="mini-status">{budget ? 'On track' : 'Your plan'}</span></div><div className="mini-amount">{moneyValue(budget?.income ?? monthlyBudget, currency)}</div><div className="mini-label">Planned spending</div><div className="mini-progress"><span style={{ width: `${budget ? Math.round((budget.needs + budget.wants) / budget.income * 100) : 69}%` }} /></div><div className="mini-card-bottom"><div><strong>{moneyValue(expenseTotal, currency)}</strong><small>Spent</small></div><div><strong>{moneyValue(Math.max(0, monthlyBudget - expenseTotal), currency)}</strong><small>Remaining</small></div></div><span className="card-orbit orbit-one" /><span className="card-orbit orbit-two" /></div>
        </section>

        <section className="learning-highlights" aria-label="Featured budgeting tips and quick facts"><div className="highlights-heading"><span className="section-kicker">A GOOD PLACE TO START</span><h2>Small steps make a difference.</h2></div><div className="featured-tips">{(siteData['site-content']?.site?.featuredTips ?? []).slice(0, 3).map((tip, index) => <article key={tip.title}><span>0{index + 1} · TIP</span><strong>{tip.title}</strong><p>{tip.description}</p></article>)}</div><div className="quick-facts"><strong>Quick facts</strong>{(siteData['site-content']?.site?.quickFacts ?? []).slice(0, 4).map((item, index) => <p key={item.fact}><span>{index + 1}</span>{item.fact}</p>)}</div></section>

        <section className="content-shell"><div className="main-column">
          <section className="section-block" id="learn"><div className="section-heading"><div><span className="section-kicker">START HERE</span><h2>Money basics, without the lecture.</h2><p>A few simple habits can completely change how you handle your money.</p></div></div>
            <div className="basics-grid">{(basics.length ? basics.slice(0, 3) : [
              { title: 'Know your income', description: 'Start with what actually comes in every month, including allowances, part-time work and other income.' },
              { title: 'Set spending limits', description: 'Give each type of expense a limit before your money disappears into small purchases.' },
              { title: 'Pay yourself first', description: 'Decide what you want to save before planning everything else around your remaining money.' },
            ]).map((item, index) => <article className={`basic-card ${['income-card', 'spending-card', 'saving-card'][index]}`} key={item.title}><div className="basic-number">0{index + 1}</div><div className="basic-icon">{['₊', '%', '◇'][index]}</div><h3>{item.title}</h3><p>{item.description}</p><button type="button" className="text-button" onClick={() => scrollTo(index === 2 ? 'savings' : 'calculator')}>{['Calculate it', 'Set a limit', 'Plan savings'][index]} <span>→</span></button></article>)}</div>
          </section>

          {currentQuizQuestion && <details className="knowledge-check"><summary><span><small>QUICK KNOWLEDGE CHECK</small><strong>{siteData.quiz?.quiz?.title ?? 'Budgeting check-in'}</strong></span><b>+</b></summary><div className="quiz-question"><p>{currentQuizQuestion.question}</p><div className="quiz-options">{currentQuizQuestion.options.map(option => <button type="button" key={option} onClick={() => answerQuiz(option)}>{option}</button>)}</div>{quizResult && <p className="quiz-feedback" aria-live="polite">{quizResult}</p>}</div></details>}
          <section className="calculator-section" id="calculator"><div className="calculator-header"><div><span className="section-kicker">SMART SPLIT</span><h2>50 / 30 / 20 calculator</h2><p>Enter your monthly income and see a simple starting point for your budget.</p></div><div className="calculator-badge">{split.needs} · {split.wants} · {split.savings}</div></div>
          <div className="calculator-body"><form className="income-input-area" onSubmit={calculateBudget}>{profiles.length > 0 && <div className="profile-picker"><label htmlFor="sampleProfile">Or try a sample</label><select id="sampleProfile" defaultValue="" onChange={event => { const profile = profiles.find(item => item.id === event.target.value); if (profile) chooseProfile(profile); }}><option value="">Choose a profile</option>{profiles.map(profile => <option value={profile.id} key={profile.id}>{profile.profileName}</option>)}</select></div>}<label htmlFor="incomeInput">Monthly income</label><div className="money-input"><span>{new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).formatToParts(0).find(part => part.type === 'currency')?.value}</span><input id="incomeInput" type="number" value={income} onChange={event => setIncome(event.target.value)} placeholder="2500" min="1" step="0.01" /></div><small>Use your actual monthly take-home amount.</small><button type="submit" className="calculate-button">Calculate budget <span>→</span></button></form>
              <div className="budget-results">{[['needs', 'Needs', 'Housing, food, transport and essentials.'], ['wants', 'Wants', 'Entertainment, shopping and flexible spending.'], ['savings', 'Savings', 'Emergency savings and future goals.']].map(([key, label, description]) => <div className={`budget-result ${key}-result`} key={key}><div className="result-top"><span className="result-label">{label}</span><strong>{split[key]}%</strong></div><div className="result-value">{moneyValue(budget?.[key] ?? 0, currency)}</div><p>{description}</p><div className="result-line"><span style={{ width: `${split[key]}%` }} /></div></div>)}</div>
              <p className="educational-note">{budgetRule.educationalNote ?? 'This split is an educational guideline, not a fixed rule. Adjust it to fit your circumstances and priorities.'}</p>
              {selectedProfile && <details className="sample-budget" open><summary>View {selectedProfile.profileName} sample monthly budget</summary><div className="table-wrap"><table className="sample-budget-table"><thead><tr><th>Income / category</th><th>Type</th><th>Amount</th></tr></thead><tbody>{(selectedProfile.incomeSources ?? []).map(item => <tr key={item.name}><td>{item.name}</td><td>Income</td><td>{moneyValue(item.amount, currency)}</td></tr>)}{Object.entries(selectedProfile.breakdown ?? {}).flatMap(([type, items]) => items.map(item => <tr key={`${type}-${item.category}`}><td>{item.category}</td><td>{type}</td><td>{moneyValue(item.amount, currency)}</td></tr>))}</tbody></table></div></details>}
            </div>
          </section>

          <section className="classifier-section" id="needs-wants"><div className="section-heading"><div><span className="section-kicker">QUICK DECISION</span><h2>Need or want?</h2><p>Put an expense into the box and decide where it belongs.</p></div></div><div className="classifier-box"><div className="classifier-examples"><div className="example-column"><span className="example-title needs-title">NEEDS</span>{['Rent / Housing', 'Groceries', 'Transport'].map(text => <div className="example-item" key={text}><span>✓</span>{text}</div>)}</div><div className="example-divider" /><div className="example-column"><span className="example-title wants-title">WANTS</span>{['Takeout', 'New headphones', 'Streaming'].map(text => <div className="example-item" key={text}><span>+</span>{text}</div>)}</div></div><form className="classifier-action" onSubmit={event => { event.preventDefault(); classify(classifiedAs || 'Need'); }}><label htmlFor="expenseInput">Try an expense</label><input id="expenseInput" value={classification} onChange={event => { setClassification(event.target.value); setClassifiedAs(''); }} placeholder="Example: New headphones — 80" /><div className="classify-buttons"><button type="button" onClick={() => classify('Need')}>Mark as need</button><button type="button" onClick={() => classify('Want')}>Mark as want</button></div><div className="classification-result" aria-live="polite">{classifiedAs ? `${classification} has been marked as a ${classifiedAs}.` : 'Choose a category to see your result.'}</div></form></div></section><div className="daily-challenge"><span>TRY A QUICK EXAMPLE</span>{currentChallenge && <><p>{currentChallenge.item}</p><div><button type="button" onClick={() => answerChallenge('Need')}>Need</button><button type="button" onClick={() => answerChallenge('Want')}>Want</button><button type="button" className="next-challenge" onClick={() => { setChallengeIndex(index => (index + 1) % needsQuestions.length); setChallengeResult(''); }}>Next example ↗</button></div></>}{challengeResult && <small aria-live="polite">{challengeResult}</small>}<div className="decision-guide"><strong>Pause before a non-essential purchase</strong><ol>{(siteData['needs-wants']?.needsVsWants?.decisionGuide ?? []).map((step, index) => <li key={step.question}><span>{step.question}</span><small>{step.ifYes} {step.ifNo}</small></li>)}</ol><p>For wants, wait 24 hours, then check your budget and savings goals before deciding.</p></div></div>

          <section className="mistakes-section" id="money-mistakes"><div className="section-heading"><div><span className="section-kicker">MONEY MISTAKES</span><h2>Small habits that can add up.</h2><p>Open a scenario to see a practical way to avoid it.</p></div></div><div className="mistake-list">{(siteData.mistakes?.mistakes ?? []).map(mistake => <details className="mistake-item" key={mistake.id}><summary>{mistake.title}<span>+</span></summary><div><p>{mistake.description}</p><p><strong>Student scenario:</strong> {mistake.scenario}</p><p><strong>Try this:</strong> {mistake.correctiveAction}</p></div></details>)}</div></section>

          <section className="savings-section" id="savings"><div className="section-heading"><div><span className="section-kicker">A PLAN YOU CAN KEEP</span><h2>Turn a goal into a plan.</h2><p>Pick a target and a monthly amount. We’ll estimate how long it could take.</p></div></div><div className="savings-layout"><form className="savings-form" onSubmit={calculateSavings}><label htmlFor="goalNameInput">Goal name</label><input id="goalNameInput" type="text" required value={goalInputs.name} onChange={event => setGoalInputs(current => ({ ...current, name: event.target.value }))} placeholder="e.g. New Laptop" /><label htmlFor="goalInput">Target amount</label><input id="goalInput" type="number" min="1" required value={goalInputs.target} onChange={event => setGoalInputs(current => ({ ...current, target: event.target.value }))} /><label htmlFor="currentSavingsInput">Already saved</label><input id="currentSavingsInput" type="number" min="0" required value={goalInputs.current} onChange={event => setGoalInputs(current => ({ ...current, current: event.target.value }))} /><label htmlFor="monthlySaveInput">Save each month</label><input id="monthlySaveInput" type="number" min="1" required value={goalInputs.monthly} onChange={event => setGoalInputs(current => ({ ...current, monthly: event.target.value }))} /><button type="submit" className="calculate-button">Estimate my timeline <span>→</span></button><small className="savings-tip">Tip: {siteData.savings?.savingsGoals?.tips?.[0] ?? 'Contribute a fixed amount regularly.'}</small></form><div className="saving-result"><span className="result-label">YOUR SAVINGS TIMELINE</span><div className="saving-big-number">{savingEstimate ? `${savingEstimate.months} ${savingEstimate.months === 1 ? 'month' : 'months'}` : 'Let’s plan'}</div><p>{savingEstimate ? savingEstimate.months === 0 ? `${goal.goalName} is already fully funded.` : `At this pace, you could reach ${goal.goalName} in about ${savingEstimate.months} months.` : 'Your goal is easier to reach when it has a monthly plan.'}</p><div className="goal-progress"><span style={{ width: `${savingEstimate?.progress ?? Number(goal.currentSavings || 0) / Number(goal.targetAmount || 1) * 100}%` }} /></div><div className="goal-meta"><span>{moneyValue(goal.currentSavings ?? 0, currency)} saved</span><span>Goal: {moneyValue(goal.targetAmount ?? 0, currency)}</span></div></div></div><p className="educational-note">{siteData.savings?.savingsGoals?.educationalNote}</p></section>

          <section className="expense-section" id="tools"><div className="section-heading"><div><span className="section-kicker">A CLEARER PICTURE</span><h2>Keep a clean record.</h2><p>Add expenses as they happen and keep the totals in view.</p></div></div><div className="expense-card"><form className="expense-form" onSubmit={addExpense}><div><label htmlFor="expenseName">Expense</label><input id="expenseName" value={expenseForm.description} onChange={event => setExpenseForm(current => ({ ...current, description: event.target.value }))} placeholder={expensesConfig.fields?.find(field => field.name === 'description')?.placeholder ?? 'What did you spend on?'} required /></div><div><label htmlFor="expenseCategory">Category</label><select id="expenseCategory" value={expenseForm.category} onChange={event => setExpenseForm(current => ({ ...current, category: event.target.value }))}>{expenseCategories.map(category => <option key={category}>{category}</option>)}</select></div><div><label htmlFor="expenseAmount">Amount</label><input id="expenseAmount" type="number" min="1" step="0.01" value={expenseForm.amount} onChange={event => setExpenseForm(current => ({ ...current, amount: event.target.value }))} placeholder="0" required /></div><button type="submit" className="add-expense">{editingExpenseId ? 'Save changes' : 'Add expense'} <span>{editingExpenseId ? '✓' : '+'}</span></button>{editingExpenseId && <button type="button" className="cancel-edit" onClick={() => { setEditingExpenseId(null); setExpenseForm({ description: '', amount: '', category: expenseForm.category }); }}>Cancel</button>}</form><div className="table-wrap"><table className="expense-table"><thead><tr><th>Expense</th><th>Date</th><th>Category</th><th>Amount</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{expenses.map(item => <tr key={item.id}><td>{item.description}</td><td>{item.date}</td><td><span className="category-tag">{item.category}</span></td><td>{moneyValue(item.amount, currency)}</td><td><button type="button" className="table-edit" onClick={() => { setEditingExpenseId(item.id); setExpenseForm({ description: item.description, amount: String(item.amount), category: item.category }); }}>Edit</button><button type="button" className="table-delete" onClick={() => setExpenses(current => current.filter(expense => expense.id !== item.id))} aria-label={`Delete ${item.description}`}>Delete</button></td></tr>)}</tbody></table></div><div className="expense-summary"><span>Total tracked</span><strong>{moneyValue(expenseTotal, currency)}</strong><span>Remaining sample balance</span><strong>{moneyValue(monthlyBudget - expenseTotal, currency)}</strong><button type="button" className="export-expenses" onClick={exportExpenses}>Export CSV ↓</button></div></div></section>

          <section className="resources-section" id="resources"><div className="section-heading resource-heading"><div><span className="section-kicker">RESOURCES</span><h2>Small ideas worth remembering.</h2><p>Search practical tips, common money mistakes and budgeting basics.</p></div><div className="resource-controls"><label className="resource-search"><span className="sr-only">Search resources</span><span>⌕</span><input value={resourceQuery} onChange={event => setResourceQuery(event.target.value)} placeholder="Search ideas" /></label><label className="resource-select">Topic<select aria-label="Filter resources by topic" value={resourceCategory} onChange={event => setResourceCategory(event.target.value)}><option value="all">All topics</option>{resourceCategories.map(category => <option key={category}>{category}</option>)}</select></label><label className="resource-select">Sort<select aria-label="Sort resources" value={resourceSort} onChange={event => setResourceSort(event.target.value)}><option value="relevance">Relevance</option><option value="title">Title A–Z</option><option value="category">Topic</option></select></label></div></div><div className="resource-grid">{displayedResources.map((item, index) => <article className="resource-card" key={item.title}><span className="resource-number">{String(index + 1).padStart(2, '0')} · {item.category}</span><h3>{item.title}</h3><p>{item.description}</p><button type="button" onClick={() => notify(item.description)}>Read note →</button></article>)}</div>{!resourceQuery && resourceCategory === 'all' && filteredResources.length > 3 && <button type="button" className="show-resources" onClick={() => setShowAllResources(value => !value)}>{showAllResources ? 'Show fewer ideas' : `Explore all ${filteredResources.length} resources`} <span>→</span></button>}{(resourceQuery || resourceCategory !== 'all') && !displayedResources.length && <p className="empty-resources">No matching ideas. Try another search or topic.</p>}</section>

          <section className="about-section" id="about"><div className="about-content"><span className="section-kicker">ABOUT BUDGETBASICS</span><h2>Money skills should feel <em>simple.</em></h2><p>{siteData.about?.about?.description ?? 'BudgetBasics makes everyday budgeting easier to understand.'}</p><p>{siteData['site-content']?.site?.welcomeDescription ?? 'Use these tools to experiment with numbers and find a plan that works for your everyday life.'}</p>{creatorMembers.length > 0 && <div className="creator-list"><strong>{siteData.about?.about?.creators?.title ?? 'Project creators'}</strong>{creatorMembers.map(member => <span key={member.name}>{member.name}{member.role ? ` · ${member.role}` : ''}</span>)}</div>}</div><div className="about-stat"><strong>01</strong><span>One decision at a time.</span></div></section>
        </div>

        <aside className="sidebar"><div className="sidebar-card snapshot-card"><div className="sidebar-card-header"><div><span className="sidebar-kicker">MONEY SNAPSHOT</span><h3>Your quick view</h3></div><span className="live-badge">LIVE</span></div><div className="snapshot-main"><span>Monthly income</span><strong>{moneyValue(budget?.income ?? 0, currency)}</strong></div><div className="snapshot-list"><div><span>Needs</span><strong>{moneyValue(budget?.needs ?? 0, currency)}</strong></div><div><span>Wants</span><strong>{moneyValue(budget?.wants ?? 0, currency)}</strong></div><div><span>Savings</span><strong>{moneyValue(budget?.savings ?? 0, currency)}</strong></div></div><button type="button" className="sidebar-action" onClick={() => scrollTo('calculator')}>Update budget <span>→</span></button></div>
          <div className="sidebar-card check-card"><span className="sidebar-kicker">QUICK CHECK</span><h3>Could you cover an unexpected expense?</h3><p>A simple emergency fund gives your budget more room when something unexpected happens.</p><button type="button" className="outline-button" onClick={() => scrollTo('savings')}>Explore emergency savings</button></div>
          <div className="tip-card"><div className="tip-icon">✦</div><span className="sidebar-kicker">TODAY’S MONEY NOTE</span><h3>{typeof visibleTip === 'string' ? 'A simple move that adds up' : visibleTip?.title ?? 'Small purchases add up.'}</h3><p>{typeof visibleTip === 'string' ? visibleTip.replace(/^Tip:\s*/, '') : visibleTip?.tip ?? 'Small recurring purchases are easy to miss because each one feels insignificant.'}</p>{spendingTips.length > 1 && <button type="button" className="next-tip" onClick={() => setSpendingTipIndex(index => (index + 1) % spendingTips.length)}>Show another tip →</button>}</div>
          <form className="sidebar-card mini-calculator" onSubmit={calculatePercentage}><span className="sidebar-kicker">QUICK MATH</span><h3>Percentage calculator</h3><div className="quick-inputs"><input type="number" aria-label="Amount" placeholder="Amount" value={percent.amount} onChange={event => setPercent(current => ({ ...current, amount: event.target.value }))} /><input type="number" aria-label="Percentage" placeholder="%" value={percent.value} onChange={event => setPercent(current => ({ ...current, value: event.target.value }))} /></div><button type="submit" className="sidebar-action">Calculate <span>→</span></button><div className="quick-result">{percentResult}</div></form>
        </aside></section>

      <section className="budget-gallery" id="infographics"><div className="gallery-heading"><span className="section-kicker">GOOD MONEY HABITS, MADE SIMPLE</span><h2>A little clarity goes a long way.</h2><p>Explore original, topic-based visuals and save or print a monthly checklist.</p></div><div className="gallery-controls" role="group" aria-label="Filter infographics by topic">{[['all', 'All topics'], ['needs_wants', 'Needs vs Wants'], ['budgeting', 'Budgeting'], ['saving', 'Savings']].map(([value, label]) => <button type="button" key={value} className={galleryFilter === value ? 'selected' : ''} aria-pressed={galleryFilter === value} onClick={() => setGalleryFilter(value)}>{label}</button>)}<a href="/student-budget-checklist.html" target="_blank" rel="noreferrer">Open printable budget checklist ↗</a></div><div className="budget-images">{(siteData.infographics_data?.infographics ?? []).filter(item => galleryFilter === 'all' || item.topic === galleryFilter).map(item => <article className="infographic-card" key={item.id}><InfographicVisual item={item} /><span>{item.badge}</span><h3>{item.title}</h3><p>{item.caption}</p><small>{item.alt}</small></article>)}</div>{(siteData.infographics_data?.infographics ?? []).length === 0 && <p>No infographics are available yet.</p>}</section>
      </main>

      <aside id="ai-chatbot" className={`money-chat ${chatOpen ? 'is-open' : ''}`} aria-label="BudgetBasics money assistant"><section className="chat-panel" aria-hidden={!chatOpen}><header className="chat-header"><span className="bot-avatar">✳</span><div className="chat-heading"><strong>Money buddy</strong><span><i />Here to help</span></div><button type="button" className="chat-close" onClick={() => setChatOpen(false)} aria-label="Close chat">×</button></header><div className="chat-welcome"><span className="welcome-eyebrow">YOUR EVERYDAY MONEY GUIDE</span><h2>What can I help with?</h2><p>Ask me about budgeting, saving, or using the tools on this page.</p></div><div className="chat-suggestions">{(siteData.chatbot?.suggestedPrompts ?? ['How do I start a budget?', 'How can I save for a goal?', 'How do I use the calculator?']).slice(0, 4).map(prompt => <button type="button" key={prompt} onClick={() => sendChat(null, prompt)}>{prompt}<span>↗</span></button>)}</div><div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><div className="chat-bubble">{message.text}</div></div>)}{chatBusy && <div className="chat-message assistant"><div className="chat-bubble typing">Thinking…</div></div>}</div><form className="chat-compose" onSubmit={sendChat}><label className="sr-only" htmlFor="chatInput">Your message</label><input id="chatInput" value={chatInput} onChange={event => setChatInput(event.target.value)} maxLength={500} placeholder="Ask a money question…" autoComplete="off" /><button type="submit" aria-label="Send message"><span>↑</span></button></form><p className="chat-footnote">{siteData.chatbot?.disclaimer ?? 'Friendly guidance for learning. Not financial advice.'}</p></section><button className="chat-launcher" type="button" onClick={() => setChatOpen(open => !open)} aria-expanded={chatOpen}><span className="launcher-spark">✳</span><span className="launcher-label">Ask Money buddy</span><span className="launcher-arrow">{chatOpen ? '×' : '↑'}</span></button></aside>

      {showBackToTop && <button type="button" className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑<span>Back to top</span></button>}

      <section className="support-area" aria-label="Contact and site links">
        <div className="support-inner">
          <details className="support-details" id="contact"><summary>Contact BudgetBasics <span>+</span></summary><div className="support-content"><p>{siteData.contact?.contact?.description}</p><p><a href={`mailto:${siteData.contact?.contact?.contactDetails?.email}`}>{siteData.contact?.contact?.contactDetails?.email}</a> · {siteData.contact?.contact?.contactDetails?.phone}</p>{socialLinks.length > 0 && <p className="social-links">{socialLinks.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>)}</p>}<form onSubmit={event => { event.preventDefault(); notify(siteData.contact?.contact?.form?.successMessage ?? 'Thanks for getting in touch.'); event.currentTarget.reset(); }} className="support-form">{(siteData.contact?.contact?.form?.fields ?? []).map(field => <label key={field.name}>{field.label}{field.type === 'textarea' ? <textarea name={field.name} placeholder={field.placeholder} required={field.required} rows="3" /> : <input name={field.name} type={field.type} placeholder={field.placeholder} required={field.required} />}</label>)}<button type="submit">Send message</button><small>{siteData.contact?.contact?.privacyNote}</small></form></div></details>
          <details className="support-details" id="feedback"><summary>Share feedback <span>+</span></summary><div className="support-content"><p>{siteData.feedback?.feedback?.description}</p><form onSubmit={event => { event.preventDefault(); notify(siteData.feedback?.feedback?.successMessage ?? 'Thanks for your feedback.'); event.currentTarget.reset(); }} className="support-form">{(siteData.feedback?.feedback?.fields ?? []).map(field => <label key={field.name}>{field.label}{field.type === 'textarea' ? <textarea name={field.name} placeholder={field.placeholder} required={field.required} rows="3" /> : <input name={field.name} type={field.type} min={field.min} max={field.max} placeholder={field.placeholder} required={field.required} />}</label>)}<button type="submit">Send feedback</button><small>{siteData.feedback?.feedback?.privacyNote}</small></form></div></details>
          <details className="support-details sitemap-details" id="sitemap"><summary>{siteData.sitemap?.sitemap?.title ?? 'Sitemap'} <span>+</span></summary><div className="support-content sitemap-grid">{(siteData.sitemap?.sitemap?.sections ?? []).map(section => <div key={section.title}><h3>{section.title}</h3>{section.links.map(link => <a key={link.label} href={`#${({ home: 'home', 'budgeting-basics': 'learn', 'needs-wants': 'needs-wants', '50-30-20': 'calculator', 'savings-goals': 'savings', 'expense-planner': 'tools', 'money-mistakes': 'money-mistakes', infographics: 'infographics', 'ai-chatbot': 'ai-chatbot', feedback: 'feedback', contact: 'contact' })[link.target] ?? 'home'}`} onClick={event => { const id = event.currentTarget.hash.slice(1); if (id === 'ai-chatbot') { event.preventDefault(); setChatOpen(true); } else document.getElementById(id)?.closest('details')?.setAttribute('open', ''); }}>{link.label}</a>)}</div>)}</div></details>
        </div>
      </section>
      <footer className="site-footer"><div className="footer-inner"><div className="footer-brand"><strong>Budget<span>Basics</span></strong><p>{siteData.footer?.footer?.brand?.description ?? 'Practical money tools for everyday decisions.'}</p></div><nav className="footer-links" aria-label="Footer navigation">{navItems.map(([id, label]) => <a href={`#${id}`} key={id} onClick={event => { if (id === 'ai-chatbot') { event.preventDefault(); setChatOpen(true); } else document.getElementById(id)?.closest('details')?.setAttribute('open', ''); }}>{label}</a>)}<a href="#sitemap" onClick={() => document.getElementById('sitemap')?.setAttribute('open', '')}>Sitemap</a></nav><div className="footer-meta"><span>© {new Date().getFullYear()} BudgetBasics</span></div></div></footer>
      <div className={`toast ${toast ? 'show' : ''}`} role="status"><span className="toast-icon">✓</span><span>{toast}</span></div>
    </>
  );
}

export default App;
