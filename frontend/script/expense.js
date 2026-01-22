const token = localStorage.getItem('token');
const premiumBtn = document.getElementById('premiumBtn');
const premiumTitle = document.getElementById('premiumTitle');
const leaderBoardBtn = document.getElementById('leaderBoardBtn');
const leaderBoardList = document.getElementById('LeaderBoard');
  
  

const isPremium = async () => {
    try {
        const res = await axios.get('http://localhost:4000/premium/premium-status', { headers: {"Authorization": token} });
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

leaderBoardBtn.addEventListener('click', async () => {
    try {
        const res = await axios.get('http://localhost:4000/premium/leaderboard', { headers: {"Authorization": token} });
        if (res.status === 200) {
            const expenses = res.data.users;
            console.log(expenses);
            leaderBoardList.innerHTML = '';
            expenses.forEach(entry => {
                const li = document.createElement('li');
                li.textContent = `Name: ${entry.name}, Total Expense: ${entry.totalExpense===null ? 0 : entry.totalExpense}`;
                leaderBoardList.appendChild(li);
            }); 

        }
    } catch (err) {
        console.error(err);
    }
  });

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const expAmt = document.getElementById('expAmt').value;
  const expDes = document.getElementById('expDes').value;


  const expGemninicat = await axios.get(`http://localhost:4000/gemini/getCategory?prompt=${expDes}`);
  console.log("Gemini Response:", expGemninicat.data.response.candidates[0].content.parts[0].text);
  const expCatFromGemini = expGemninicat.data.response.candidates[0].content.parts[0].text.slice(2,-2);
    try {
    const res = await axios.post('http://localhost:4000/expenses/addExpense', {
      expAmt,
      expDes,
      expCat: expCatFromGemini
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
            deleteExpense(expense.id, expense.expAmt);
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

const deleteExpense = async (id,expAmt) => {
    try {
        const res = await axios.delete(`http://localhost:4000/expenses/deleteExpense/${id}?expAmt=${expAmt}`,{ headers: {"Authorization": token} }, );
        if (res.status === 200) {
            loadExpenses();
        }
    } catch (err) {
        console.error(err);
        alert('Could not delete expense');
    }
};  


window.addEventListener("DOMContentLoaded", loadExpenses);
window.addEventListener("DOMContentLoaded", isPremium);