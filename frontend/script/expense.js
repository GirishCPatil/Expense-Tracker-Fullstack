document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const expAmt = document.getElementById('expAmt').value;
  const expDes = document.getElementById('expDes').value;
  const expCat = document.getElementById('expCat').value;

    try {
    const res = await axios.post('http://localhost:4000/expenses/addExpense', {
      expAmt,
      expDes,
      expCat
    });
      loadExpenses();
    if (res.status === 201) {
      alert('Expense added successfully');
    }

    } catch (err) {
    console.error(err);
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data.message;
        if (status === 400) {
        alert(message);
      } else {
        alert('Something went wrong');
      }
    } else {
        alert('Server not reachable');
    }
  }     
});


const loadExpenses = async () => {
  try {
    const res = await axios.get('http://localhost:4000/expenses/getExpenses');
    if (res.status === 200) {
      const expenses = res.data;
      console.log(expenses);
      const expenseList = document.getElementById('expenseList');
      expenseList.innerHTML = '';
        expenses.forEach(expense => {
        const li = document.createElement('li');
        const deleteBtn = document.createElement('button');
      
        li.textContent = `Amount: ${expense.expAmt}, Description: ${expense.expDes}, Category: ${expense.expCat}`;
        expenseList.appendChild(li);
          deleteBtn.textContent = 'Delete';
        deleteBtn.id = expense.id;
    deleteBtn.addEventListener('click', () => deleteExpense(expense.id));
        li.appendChild(deleteBtn);
      });
    }
    } catch (err) {
    console.error(err);
    alert('Could not load expenses');
    }
};

const deleteExpense = async (id) => {
    const expenseId = id;
    try {
        const res = await axios.delete(`http://localhost:4000/expenses/deleteExpense/${expenseId}`);
        if (res.status === 200) {
            alert('Expense deleted successfully');
            loadExpenses();
        }
    } catch (err) {
        console.error(err);
        alert('Could not delete expense');
    }
};  

window.onload = loadExpenses;