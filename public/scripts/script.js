function checkFields() {
    console.log("checkfields");
    var password = document.getElementById("password").value;
    var email = document.getElementById("email").value;
    if ((email === "") || (password === "")) {
        alert("Email e password são necessários.");
        return false;
    }
}

function graphicsCookies() {
    var account = localStorage.getItem("account");
    var staticDateStart = getCookie(account + "&" + "staticDateStart");
    var staticDateEnd = getCookie(account + "&" + "staticDateEnd");
    var staticTimeStart = getCookie(account + "&" + "staticTimeStart");
    var staticTimeEnd = getCookie(account + "&" + "staticTimeEnd");
    var period = getCookie(account + "&" + "period");
    var dynduration = getCookie(account + "&" + "dynduration");
    var graphCookies = {
        period: period,
        dynduration: dynduration,
        staticDateStart: staticDateStart,
        staticDateEnd: staticDateEnd,
        staticTimeStart: staticTimeStart,
        staticTimeEnd: staticTimeEnd,
    }
    return graphCookies;
}

function getConfigurations() {
    var account = localStorage.getItem("account");
    var cookies = graphicsCookies();

    var staticDateStart = document.getElementById("staticDateStart");
    if (cookies.staticDateStart) {
        staticDateStart.valueAsDate = new Date(cookies.staticDateStart);
    } else {
        staticDateStart.valueAsDate = new Date();
    }

    var staticDateEnd = document.getElementById("staticDateEnd");
    if (cookies.staticDateEnd) {
        staticDateEnd.valueAsDate = new Date(cookies.staticDateEnd);
    } else {
        staticDateEnd.valueAsDate = new Date();
    }

    var staticTimeStart = document.getElementById("staticTimeStart");
    if (cookies.staticTimeStart) {
        staticTimeStart.value = cookies.staticTimeStart;
    } else {
        staticTimeStart.value = "00:00";
    }

    var staticTimeEnd = document.getElementById("staticTimeEnd");
    if (cookies.staticTimeEnd) {
        staticTimeEnd.value = cookies.staticTimeEnd;
    } else {
        var date = new Date();
        staticTimeEnd.value = date.getHours() + ":" + date.getMinutes();
    }

    var dynduration = document.getElementById("dynduration");
    if (cookies.dynduration) {
        dynduration.value = cookies.dynduration;
    } else {
        dynduration.value = "600";
    }

    var period = document.getElementById("period");
    if (cookies.period) {
        period.value = cookies.period;
    } else {
        period.value = "5";
    }

    document.getElementById("inputAccount").value = account;
    document.getElementById("spanAccount").textContent = account;
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

function getTemperature(ctx, acc, start, end) {
    var xhttp = new XMLHttpRequest();
    console.log("account: " + acc);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',

                // The data for our dataset
                data: {
                    labels: [new Date(data[0].date).getHours(), data[1].date, "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: 'rgb(55, 55, 132)',
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1,

                        borderColor: 'rgb(255, 99, 132)',
                        data: [data[0].value, data[1].value, 5, 2, 20, 30, 34, 35, 1, 2, 3, 4],
                    }]
                },

                // Configuration options go here
                options: {
                    animation: {
                        duration: 0, // general animation time
                    },
                }
            });
        }
    };
    xhttp.open("GET", "/temp?account=" + acc + "&start=" + start + "&end=" + end, true);
    xhttp.send();
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
    var firstTime = false;

    if (account !== undefined && account !== null) {
        localStorage.setItem("account", account);
    }
    var name = getCookie("name");
    if (name !== undefined && name !== null) {
        localStorage.setItem("name", name);
    }
    var email = getCookie("email");
    if (email !== undefined && email !== null) {
        localStorage.setItem("email", email);
    }
    var call = getCookie("call");
    if (call) {
        firstTime = true;
    }
    var liCreateUser = document.getElementById("liCreateUser");
    var divGraphs = document.getElementById("divGraphs");
    var liConfig = document.getElementById("liConfig");
    var pInformation = document.getElementById("pInformation");
    var divLogout = document.getElementById("divLogout");
    var welcomeImage = document.getElementById("welcomeImage");
    if (account) {
        if (pInformation) {
            console.log(firstTime);
            if (firstTime) {
                pInformation.textContent = `Olá ${name}, pode aceder aos dados metereológicos.`;
                function clean() {
                    setTimeout(function redirect() {
                        pInformation.textContent = " ";
                        setCookie("call", null, 0);
                    }, 8000);
                }
                clean();
            } else {
                pInformation.textContent = "";
            }
        }
        if (divGraphs) {
            this.body.appendChild(divGraphs);
            dinamicTemperatureGraphics();
        }
        if (welcomeImage) {
            welcomeImage.src = "/images/graficos.png";
            welcomeImage.style.height = "150px";
        }
        if (liConfig) {
            var headbar = document.getElementById("headbar");
            if (headbar) {
                headbar.appendChild(liConfig);
            }
        }
        if (liCreateUser) {
            liCreateUser.remove()
        }
        var divLogin = document.getElementById("divLogin");
        if (divLogin) {
            divLogin.remove();
        }

        if (divLogout) {
            var navbar = document.getElementById("navbar");
            if (navbar) {
                navbar.appendChild(divLogout);
            }
        }
    } else {
        if (welcomeImage) {
            welcomeImage.src = "/images/weather.jpeg";
            welcomeImage.style.height = "400px";
        }
        if (liConfig) {
            liConfig.remove();
        }
        if (liCreateUser) {
            var headbar = document.getElementById("headbar");
            if (headbar) {
                headbar.appendChild(liCreateUser);
            }
        }
        if (divLogout) {
            divLogout.remove();
        }
        if (divLogin) {
            this.body.appendChild(divLogin);
        }
        if (divGraphs) {
            divGraphs.remove();
        }
    }
}

function dinamicTemperatureGraphics() {
    let account = localStorage.getItem("account");
    if (account) {
        let ctx = document.getElementById('myChart').getContext('2d');
        getTemperature(ctx, account);
        function intervalTemperature(acc) {
            setInterval(function getTemp() {
                getTemperature(ctx, localStorage.getItem("account"));
            }, 10000, true);

        }
        intervalTemperature();
    }
}

function refresh() {
    setTimeout(function redirect() {
        window.location.replace("/");
    }, 4000);
}

function back() {
    setTimeout(function redirect() {
        window.history.back();
    }, 4000);
}

function getAccount() {
    var account = localStorage.getItem("account");
    return account;
}

function logout() {
    destroyCookies();
    localStorage.setItem("account", undefined);
    localStorage.setItem("name", undefined);
    localStorage.setItem("email", undefined);
    window.location.href = "/";
}