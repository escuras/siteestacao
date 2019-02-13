function checkFields() {
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
    var sMeasure = getCookie(account + "&" + "sMeasure");
    var graphCookies = {
        period: period,
        dynduration: dynduration,
        staticDateStart: staticDateStart,
        staticDateEnd: staticDateEnd,
        staticTimeStart: staticTimeStart,
        staticTimeEnd: staticTimeEnd,
        sMeasure: sMeasure
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
        staticTimeEnd.value = "23:59";
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

    var sMeasure = document.getElementById("sMeasure");
    if (cookies.sMeasure) {
        sMeasure.value = cookies.sMeasure;
    } else {
        sMeasure.value = "celsius";
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

function dynamicData(acc, start, end) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            return data;
        }
    };
    xhttp.open("GET", "/temp?account=" + acc + "&start=" + start + "&end=" + end, true);
    xhttp.send();
}

function staticData(acc, start, end) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            return data;
        }
    };
    xhttp.open("GET", "/temp?account=" + acc + "&start=" + start + "&end=" + end, true);
    xhttp.send();
}

function putMax(account, data, id) {
    var sMedida = getCookie(account + "&" + "sMeasure");
    const values = data.map(x => parseFloat(x.value));
    var max = Math.max(...values);
    if (sMedida == "fahrenheit") {
        sMedida = " °F";
        document.getElementById(id).textContent = (max * 9 / 5 + 32) + sMedida;
    } else {
        sMedida = " °C";
        document.getElementById(id).textContent = max + sMedida;
    }
}

function putMin(account, data, id) {
    var sMedida = getCookie(account + "&" + "sMeasure");
    const values = data.map(x => parseFloat(x.value));
    var min = Math.min(...values);
    if (sMedida == "fahrenheit") {
        sMedida = " °F";
        document.getElementById(id).textContent = (min * 9 / 5 + 32) + sMedida;
    } else {
        sMedida = " °C";
        document.getElementById(id).textContent = min + sMedida;
    }


}

function putMed(account, data, id) {
    var sMedida = getCookie(account + "&" + "sMeasure");
    const values = data.map(x => parseFloat(x.value));
    var sum = values.reduce((a, b) => a + b, 0);
    var med = sum / values.length;
    if (sMedida == "fahrenheit") {
        sMedida = " °F";
        document.getElementById(id).textContent = (med * 9 / 5 + 32) + sMedida;
    } else {
        sMedida = " °C";
        document.getElementById(id).textContent = med + sMedida;
    }
}

function putAmp(account, data, id) {
    var sMedida = getCookie(account + "&" + "sMeasure");
    const values = data.map(x => parseFloat(x.value));
    var min = Math.min(...values);
    var max = Math.max(...values);
    if (sMedida == "fahrenheit") {
        sMedida = " °F";
        document.getElementById(id).textContent = (max * 9 / 5 + 32) - (min * 9 / 5 + 32) + sMedida;
    } else {
        sMedida = " °C";
        document.getElementById(id).textContent = max - min + sMedida;
    }


}

function drawDynamicLineGraph(ctx, acc, start, end) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            if (data.length > 0) {
                putMax(acc, data, "dynTempMax");
                putMin(acc, data, "dynTempMin");
                putMed(acc, data, "dynTempMed");
                putAmp(acc, data, "dynTempAmp");
                var sMedida = getCookie(acc + "&" + "sMeasure");
                if (sMedida == "fahrenheit") {
                    var values = data.map(x => parseFloat(x.value) * 9 / 5 + 32);
                } else {
                    var values = data.map(x => parseFloat(x.value));
                }
                vLabels = data.map(x => new Date(x.date).toTimeString());
                new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: vLabels,
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
                            data: values,
                        }]
                    },

                    // Configuration options go here
                    options: {
                        maintainAspectRatio: false,
                        legend: {
                            display: false,
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    fontColor: "#000",
                                    fontSize: 12
                                },
                                gridLines: {
                                    color: "#000",
                                    lineWidth: 1,
                                    zeroLineColor: "#000",
                                    zeroLineWidth: 1
                                },
                                stacked: true
                            }],
                            xAxes: [{
                                display: false
                            }]
                        },
                        animation: {
                            duration: 5000, // general animation time
                        },
                    }
                });
            } else {
                document.getElementById("dynamicGraph").textContent = "Não existem dados para apresentar o gráfico!"
                document.getElementById("dynamicGraph").style.fontSize = "24px";
                document.getElementById("dynamicGraph").style.paddingTop = "200px";
            }
        }
    };
    xhttp.open("GET", "/temp?account=" + acc + "&start=" + start + "&end=" + end, true);
    xhttp.send();
}

function drawStaticLineGraph(ctx, acc, start, end) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            if (data.length > 0) {
                putMax(acc, data, "staticTempMax");
                putMin(acc, data, "staticTempMin");
                putMed(acc, data, "staticTempMed");
                putAmp(acc, data, "staticTempAmp");
                var sMedida = getCookie(acc + "&" + "sMeasure");
                if (sMedida == "fahrenheit") {
                    var values = data.map(x => parseFloat(x.value) * 9 / 5 + 32);
                } else {
                    var values = data.map(x => parseFloat(x.value));
                }
                vLabels = data.map(x => new Date(x.date).toDateString());
                new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'bar',

                    // The data for our dataset
                    data: {
                        labels: vLabels,
                        datasets: [{
                            label: "My First dataset",
                            backgroundColor: 'rgb(55, 55, 55)',
                            borderColor:
                                'rgba(0,0,0,1)'
                            ,
                            borderWidth: 1,

                            data: values,
                        }]
                    },

                    // Configuration options go here
                    options: {
                        maintainAspectRatio: false,
                        legend: {
                            display: false,
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    fontColor: "#000",
                                    fontSize: 12
                                },
                                stacked: true,
                            }],
                            xAxes: [{
                                display: false
                            }]
                        },
                        animation: {
                            duration: 5000, // general animation time
                        },
                    }
                });
            } else {
                document.getElementById("staticGraph").textContent = "Não existem dados para apresentar o gráfico!"
                document.getElementById("staticGraph").style.fontSize = "24px";
                document.getElementById("staticGraph").style.paddingTop = "200px";
                document.getElementById("dynTempMax").textContent = "Sem dados";
                document.getElementById("dynTempMin").textContent = "Sem dados";
                document.getElementById("dynTempMed").textContent = "Sem dados";
                document.getElementById("dynTempAmp").textContent = "Sem dados";
            }
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
    var load = document.readyState;
    switch (document.readyState) {
        case "interactive":
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
                    temperatureGraphics();
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
            break;
    }
}

function temperatureGraphics() {
    let account = localStorage.getItem("account");
    var staticDateStart = getCookie(account + "&" + "staticDateStart");
    var staticDateEnd = getCookie(account + "&" + "staticDateEnd");
    var staticTimeStart = getCookie(account + "&" + "staticTimeStart");
    var staticTimeEnd = getCookie(account + "&" + "staticTimeEnd");
    var dynduration = getCookie(account + "&" + "dynduration");
    var dateOffset = (dynduration * 1000)
    var start = new Date().getTime() - dateOffset;
    if (account) {
        let ctx = document.getElementById('myChartDynamic').getContext('2d');
        drawDynamicLineGraph(ctx, account, new Date(start), new Date());
        function dynamicIntervalTemperature() {
            setInterval(function getTemp() {
                var dynduration = getCookie(account + "&" + "dynduration");
                var dateOffset = (dynduration * 1000)
                var start = new Date().getTime() - dateOffset;
                drawDynamicLineGraph(ctx, localStorage.getItem("account"), new Date(start), new Date());
            }, 60000, true);
        }
        let ctxStatic = document.getElementById('myChartStatic').getContext('2d');
        var sDate = staticDateStart.split(/\D/);
        var day = sDate[2];
        var month = sDate[1];
        var year = sDate[0];
        var arr = staticTimeStart.split(/\D/);
        var hours = arr[0];
        var minutes = arr[1];
        var sDate2 = staticDateEnd.split(/\D/);
        var day2 = sDate2[2];
        var month2 = sDate2[1];
        var year2 = sDate2[0];
        arr = staticTimeEnd.split(/\D/);
        var hours2 = arr[0];
        var minutes2 = arr[1];
        var sDateI = new Date(year, month - 1, day, hours, minutes);
        var sDateF = new Date(year2, month2 - 1, day2, hours2, minutes2);
        drawStaticLineGraph(ctxStatic, account, sDateI, sDateF);
        dynamicIntervalTemperature();
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