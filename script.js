// State Management
let dailyExpenses = [];

function handleLogin(event) {
    event.preventDefault();
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('main-app').classList.add('active');
    updateCalculations();
}

function handleLogout() {
    document.getElementById('main-app').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
}

// Page Navigation
function switchPage(pageId) {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.remove('active-page'));
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    document.getElementById(`page-${pageId}`).classList.add('active-page');

    const indexMap = { 'home': 0, 'fixed': 1, 'daily': 2, 'profile': 3 };
    if (indexMap[pageId] !== undefined) {
        navItems[indexMap[pageId]].classList.add('active');
    }
}

// Calculations Logic with Over-budget Alert Trigger
function updateCalculations() {
    const income = parseFloat(document.getElementById('input-income').value) || 0;
    const rent = parseFloat(document.getElementById('input-rent').value) || 0;
    const savings = parseFloat(document.getElementById('input-savings').value) || 0;
    const insurance = parseFloat(document.getElementById('input-insurance').value) || 0;

    const fixedTotal = rent + savings + insurance;
    
    // Total Expenses
    const todayExpensesTotal = dailyExpenses.reduce((sum, item) => sum + item.amount, 0);

    // Remaining Balance
    const remainingBalance = income - fixedTotal - todayExpensesTotal;
    
    // Target Daily Limit (assuming 30 days)
    const dailyLimit = Math.max(0, Math.floor((income - fixedTotal) / 30));

    // CHECK OVER-SPENDING BUDGET ALERT
    const warningBanner = document.getElementById('budget-warning');
    if (todayExpensesTotal > dailyLimit && dailyLimit > 0) {
        warningBanner.style.display = 'block';
    } else {
        warningBanner.style.display = 'none';
    }

    // UI Updates
    document.getElementById('disp-income').innerText = income.toLocaleString('ja-JP');
    document.getElementById('disp-fixed-total').innerText = fixedTotal.toLocaleString('ja-JP');
    document.getElementById('disp-expense-total').innerText = todayExpensesTotal.toLocaleString('ja-JP');
    document.getElementById('disp-savings').innerText = savings.toLocaleString('ja-JP');
    document.getElementById('disp-remaining').innerText = (remainingBalance > 0 ? remainingBalance : 0).toLocaleString('ja-JP');
    document.getElementById('disp-daily-limit').innerText = dailyLimit.toLocaleString('ja-JP');
}

// Add Daily Expense Record
function addDailyExpense() {
    const amountInput = document.getElementById('expense-amount');
    const noteInput = document.getElementById('expense-note');

    const amount = parseFloat(amountInput.value);
    const note = noteInput.value.trim() || "支出";

    if (!amount || amount <= 0) {
        alert("正しい金額を入力してください");
        return;
    }

    dailyExpenses.push({ 
        amount, 
        note, 
        date: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) 
    });

    amountInput.value = '';
    noteInput.value = '';

    renderExpenseList();
    updateCalculations();
}

function renderExpenseList() {
    const listElement = document.getElementById('expense-list');
    listElement.innerHTML = '';

    dailyExpenses.slice().reverse().forEach(item => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <div>
                <strong>${item.note}</strong>
                <div style="font-size: 11px; color: #888;">${item.date}</div>
            </div>
            <div style="font-weight: bold; color: #d32f2f;">-¥${item.amount.toLocaleString('ja-JP')}</div>
        `;
        listElement.appendChild(li);
    });
}