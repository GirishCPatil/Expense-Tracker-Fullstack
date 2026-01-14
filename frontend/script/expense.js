const token = localStorage.getItem('token');

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
    }, { headers: {"Authorization": token} }); 

      loadExpenses();
    if (res.status === 201) {
      document.getElementById('expAmt').value = "";
      document.getElementById('expDes').value = "";
    }

    } catch (err) {
    console.error(err);
    alert('Something went wrong');
  }     
});


const loadExpenses = async () => {
  try {
    const res = await axios.get('http://localhost:4000/expenses/getExpenses', { headers: {"Authorization": token} });
    
    if (res.status === 200) {
      const expenses = res.data;
      const expenseList = document.getElementById('expenseList');
      expenseList.innerHTML = '';
        
        expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `Amount: ${expense.expAmt}, Description: ${expense.expDes}, Category: ${expense.expCat} `;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        
        // Attach event listener directly
        deleteBtn.onclick = () => {
            deleteExpense(expense.id);
        }
        
        li.appendChild(deleteBtn);
        expenseList.appendChild(li);
      });
    }
    } catch (err) {
    console.error(err);
    alert('Could not load expenses');
    }
};

const deleteExpense = async (id) => {
    try {
        const res = await axios.delete(`http://localhost:4000/expenses/deleteExpense/${id}`, { headers: {"Authorization": token} });
        if (res.status === 200) {
            loadExpenses();
        }
    } catch (err) {
        console.error(err);
        alert('Could not delete expense');
    }
};  

window.addEventListener("DOMContentLoaded", loadExpenses);