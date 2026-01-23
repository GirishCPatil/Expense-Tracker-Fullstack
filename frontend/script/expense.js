const token = localStorage.getItem('token');
const premiumBtn = document.getElementById('premiumBtn');
const premiumTitle = document.getElementById('premiumTitle');
const leaderBoardBtn = document.getElementById('leaderBoardBtn');
const leaderBoardList = document.getElementById('LeaderBoard');

const expenseList = document.getElementById('expenseList');
const paginationDiv = document.getElementById('pagination');

// Pagination variables
let allExpenses = [];
const itemsPerPage = 10;
let currentPage = 1;

/* ================= PREMIUM CHECK ================= */

const isPremium = async () => {
  try {
    const res = await axios.get('http://localhost:4000/premium/premium-status', {
      headers: { "Authorization": token }
    });

    if (res.status === 200 && res.data.isPremium) {
      premiumBtn.style.display = 'none';
      document.body.style.backgroundColor = 'lightgoldenrodyellow';
      premiumTitle.style.display = 'block';
      alert('You are a Premium User Now!');
    }
  } catch (err) {
    console.error(err);
  }
};

/* ================= LEADERBOARD ================= */

leaderBoardBtn.addEventListener('click', async () => {
  try {
    const res = await axios.get('http://localhost:4000/premium/leaderboard', {
      headers: { "Authorization": token }
    });

    if (res.status === 200) {
      const users = res.data.users;
      leaderBoardList.innerHTML = '';

      users.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `Name: ${entry.name}, Total Expense: ${entry.totalExpense || 0}`;
        leaderBoardList.appendChild(li);
      });
    }
  } catch (err) {
    console.error(err);
  }
});

/* ================= ADD EXPENSE ================= */

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const expAmt = document.getElementById('expAmt').value;
  const expDes = document.getElementById('expDes').value;

  try {
    const geminiRes = await axios.get(`http://localhost:4000/gemini/getCategory?prompt=${expDes}`);
    const expCatFromGemini =
      geminiRes.data.response.candidates[0].content.parts[0].text.slice(2, -2);

    const res = await axios.post('http://localhost:4000/expenses/addExpense', {
      expAmt,
      expDes,
      expCat: expCatFromGemini
    }, { headers: { "Authorization": token } });

    if (res.status === 201) {
      document.getElementById('expAmt').value = '';
      document.getElementById('expDes').value = '';
      loadExpenses();
    }

  } catch (err) {
    console.error(err);
    alert('Something went wrong');
  }
});

/* ================= LOAD EXPENSES ================= */

const loadExpenses = async () => {
  try {
    const res = await axios.get('http://localhost:4000/expenses/getExpenses', {
      headers: { "Authorization": token }
    });

    if (res.status === 200) {
      allExpenses = res.data;
      currentPage = 1;
      renderPage(currentPage);
      renderPagination();
    }

  } catch (err) {
    console.error(err);
    alert('Could not load expenses');
  }
};

/* ================= RENDER PAGE ================= */

function renderPage(page) {
  expenseList.innerHTML = '';

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageItems = allExpenses.slice(start, end);

  pageItems.forEach(expense => {
    const li = document.createElement('li');
    li.textContent = `Amount: ${expense.expAmt}, Description: ${expense.expDes}, Category: ${expense.expCat}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteExpense(expense.id, expense.expAmt);

    li.appendChild(deleteBtn);
    expenseList.appendChild(li);
  });
}

/* ================= PAGINATION BUTTONS ================= */

function renderPagination() {
  paginationDiv.innerHTML = '';

  const totalPages = Math.ceil(allExpenses.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;

    if (i === currentPage) {
      btn.style.backgroundColor = '#333';
      btn.style.color = '#fff';
    }

    btn.onclick = () => {
      currentPage = i;
      renderPage(currentPage);
      renderPagination();
    };

    paginationDiv.appendChild(btn);
  }
}

/* ================= DELETE EXPENSE ================= */

const deleteExpense = async (id, expAmt) => {
  try {
    const res = await axios.delete(
      `http://localhost:4000/expenses/deleteExpense/${id}?expAmt=${expAmt}`,
      { headers: { "Authorization": token } }
    );

    if (res.status === 200) {
      allExpenses = allExpenses.filter(e => e.id !== id);

      const totalPages = Math.ceil(allExpenses.length / itemsPerPage);
      if (currentPage > totalPages) currentPage = totalPages || 1;

      renderPage(currentPage);
      renderPagination();
    }

  } catch (err) {
    console.error(err);
    alert('Could not delete expense');
  }
};

/* ================= INIT ================= */

window.addEventListener("DOMContentLoaded", () => {
  loadExpenses();
  isPremium();
});
