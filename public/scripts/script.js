function checkFields() {
    console.log("checkfields");
    var password = document.getElementById("password").value;
    var email = document.getElementById("email").value;
    if ((email === "") || (password === "")) {
        alert("Email e password são necessários.");
        return false;
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function destroyCookies() {
    setCookie("account", null, 0);
    setCookie("name", null, 0);
    setCookie("email", null, 0);
}

document.onreadystatechange = function checkUser() {
    var account = getCookie("account");
    if (account !== undefined && account !== null) {
        localStorage.setItem("account", account);
    }
    var name = getCookie("name");
    console.log(name);
    if (name !== undefined && name !== null) {
        localStorage.setItem("name", name);
    }
    var email = getCookie("email");
    if (email !== undefined && email !== null) {
        localStorage.setItem("email", email);
    }
    var createUser = document.getElementById("createUser");
    var divInformation = document.getElementById("divInformation");
    var divLogout = document.getElementById("divLogout");
    if (account) {
        console.log(name);
        if (divInformation) {
            console.log(name);
            divInformation.textContent = `Olá ${name}, pode aceder aos dados metereológicos.`;
        }
        if (createUser) {
            createUser.style.visibility = "collapse";
        }
        if (divLogout) {
            divLogout.style.visibility = "visible";
        }
    } else {
        if (createUser) {
            createUser.style.visibility = "visible";
        }
        if (divLogout) {
            divLogout.style.visibility = "collapse";
        }
    }
}

function logout() {
    destroyCookies();
    localStorage.setItem("account", undefined);
    localStorage.setItem("name", undefined);
    localStorage.setItem("email", undefined);
    window.location.href = "/";
}