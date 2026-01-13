document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await axios.post('http://localhost:4000/users/login', {
      email,
      password
    });

    // Success
    if (res.status === 200) {
      alert('User login successful');
    }

  } catch (err) {
    console.error(err);

    if (err.response) {
      const status = err.response.status;
      const message = err.response.data.message;

      if (status === 401) {
        alert('User not authorized (Wrong password)');
      } else if (status === 404) {
        alert('User not found');
      } else if (status === 400) {
        alert(message);
      } else {
        alert('Something went wrong');
      }
    } else {
      alert('Server not reachable');
    }
  }
});
