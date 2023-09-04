function validatePassword() {
    var passwordInput = document.getElementById("password").value;
    var passwordInput2 = document.getElementById("password2").value;
    document.getElementById("password_error").innerHTML = "";
    if (passwordInput.length < 8) {
      document.getElementById("password_error").textContent =
        "La contraseña debe tener al menos 8 caracteres";
      return false;
    }
    if (!/\d/.test(passwordInput)) {
      document.getElementById("password_error").textContent =
        "La contraseña debe tener al menos un número";
      return false;
    }
    if (!/[A-Z]/.test(passwordInput)) {
      document.getElementById("password_error").textContent =
        "La contraseña debe tener al menos una mayúscula";
      return false;
    }
  
    if (!/[!@#$%^&*]/.test(passwordInput)) {
      document.getElementById("password_error").textContent =
        "La contraseña debe tener al menos un carácter especial (!@#$%^&*).";
      return false;
    }
    if (passwordInput !== passwordInput2) {
      document.getElementById("password_error").textContent =
        "La contraseña debe coincidir.";
      return false;
    }
    return true;
  }
  
  $("#singup").on("submit", (evt) => {
    evt.preventDefault();
    validatePassword();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({
      email: $("#email").val(),
      password: $("#password").val(),
      confirmPassword: $("#password2").val(),
      username: $("#nombreUsuario").val(),
      birthday: $("#birthday").val(),
      gender: $('input[name="gender"]:checked').val(),
    });
  
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("http://68.183.119.179:3000/api/users/", requestOptions)
      .then(async (response) => {
        var fields = ["email", "password", "username", "birthday"];
        fields.forEach((element) => {
          var elName = `#${element}_error`;
          $(elName).text("");
        });
        $("#error_message").text("");
        const resp = await response.json();
        if (response != 201) {
          if (resp.errors) {
            resp.errors.forEach((error) => {
              var elName = `#${error.path}_error`;
              $(elName).text(error.msg);
            });
            $("#error_message").text(resp.message ?? "");
            return;
          }
        }
        $("#succes_message").text("Creado");
        document.getElementById("singup").reset();
      })
      .catch((e) => console.log(e));
  });
  