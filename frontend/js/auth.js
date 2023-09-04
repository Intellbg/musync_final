function logout() {
  localStorage.removeItem("API_KEY");
}

function checkAuth() {
  const API_KEY = localStorage.getItem("API_KEY");
  if (!API_KEY) {
    window.location.href = "/login.html";
  }
}


