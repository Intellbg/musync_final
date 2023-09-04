$(document).ready(function () {
  $("#password_reset_button").on("click", async (evn) => {
    evn.preventDefault();
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    var email = $("#email_password").val();
    fetch(
      `http://68.183.119.179:3000/api/auth/password_reset?email=${email}`,
      requestOptions
    ).then(async (response) => {
      const res = await response.json();
      $("#recover_feedback").html(res.message);
      $("#recover_feedback").removeAttr("hidden");
    });
  });

  $("#login_button").on("click", async (evn) => {
    evn.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      email: $("#email").val(),
      password: $("#password").val(),
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    await fetch("http://68.183.119.179:3000/api/auth/login", requestOptions)
      .then(async (response) => {
        const res = await response.json();
        if (response.status != 200) {
          $("#loginError").html(res.message);
          $("#loginError").removeAttr("hidden");
          return;
        }
        localStorage.setItem("API_KEY", res.apikey);
        localStorage.setItem("ID", res.id);
        window.location.href = "/";
      })
      .catch((error) => {
        $("#loginError").html(error.message);
        $("#loginError").removeAttr("hidden");
      });
  });
});
