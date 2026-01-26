document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await axios.post('http://15.206.27.0:4000/users/login', {
      email,
      password
    });

    if (res.status === 200) {
      alert(res.data.message);
      // Save token to local storage
      localStorage.setItem('token', res.data.token); 
      // Redirect to your expense page
      window.location.href = "./expense.html"; 
    }

  } catch (err) {
    console.error(err);
    if (err.response) {
      alert(err.response.data.message);
    } else {
      alert('Server not reachable');
    }
  }
});