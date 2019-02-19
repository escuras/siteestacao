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
    if (!account) {
        window.location.replace("/");
    }
    var cookies = graphicsCookies();

    var staticDateStart = document.getElementById("staticDateStart");
    if (cookies.staticDateStart) {
        staticDateStart.valueAsDate = new Date(cookies.staticDateStart);
    } else {
        var dat = new Date();
        staticDateStart.valueAsDate = dat;

    }

    var staticDateEnd = document.getElementById("staticDateEnd");
    if (cookies.staticDateEnd) {
        staticDateEnd.valueAsDate = new Date(cookies.staticDateEnd);
    } else {
        var dat = new Date();
        staticDateEnd.valueAsDate = dat;
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
        dynduration.value = "21600";
    }

    var period = document.getElementById("period");
    if (cookies.period) {
        period.value = cookies.period;
    } else {
        period.value = "1800000";
    }

    var sMeasure = document.getElementById("sMeasure");
    if (cookies.sMeasure) {
        sMeasure.value = cookies.sMeasure;
    } else {
        sMeasure.value = "celsius";
    }

    var inputAccount = document.getElementById("inputAccount");
    if (inputAccount) {
        inputAccount.value = account;
    }
    var spanAccount = document.getElementById("spanAccount");
    if (spanAccount) {
        spanAccount.textContent = account;
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
        document.getElementById(id).textContent = Number((max * 9 / 5 + 32).toFixed(2)) + sMedida;
    } else {
        sMedida = " °C";
        document.getElementById(id).textContent = Number((max).toFixed(2)) + sMedida;
    }
}

function putMin(account, data, id) {
    var sMedida = getCookie(account + "&" + "sMeasure");
    const values = data.map(x => parseFloat(x.value));
    var min = Math.min(...values);
    if (sMedida == "fahrenheit") {
        sMedida = " °F";
        document.getElementById(id).textContent = Number((min * 9 / 5 + 32).toFixed(2)) + sMedida;
    } else {
        sMedida = " °C";
        document.getElementById(id).textContent = Number((min).toFixed(2)) + sMedida;
    }


}

function putMed(account, data, id) {
    var sMedida = getCookie(account + "&" + "sMeasure");
    const values = data.map(x => parseFloat(x.value));
    var sum = values.reduce((a, b) => a + b, 0);
    var med = sum / values.length;
    if (sMedida == "fahrenheit") {
        sMedida = " °F";
        document.getElementById(id).textContent = Number((med * 9 / 5 + 32).toFixed(2)) + sMedida;
    } else {
        sMedida = " °C";
        document.getElementById(id).textContent = Number((med).toFixed(2)) + sMedida;
    }
}

function putAmp(account, data, id) {
    var sMedida = getCookie(account + "&" + "sMeasure");
    const values = data.map(x => parseFloat(x.value));
    var min = Math.min(...values);
    var max = Math.max(...values);
    if (sMedida == "fahrenheit") {
        sMedida = " °F";
        document.getElementById(id).textContent = Number((((min * 9 / 5 + 32) - (max * 9 / 5 + 32)) * - 1).toFixed(2)) + sMedida;
    } else {
        sMedida = " °C";
        document.getElementById(id).textContent = Number(((min - max) * - 1).toFixed(2)) + sMedida;
    }


}

function drawDynamicLineGraph(ctx, acc, start, end) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                if (data.length > 0) {
                    putMax(acc, data, "dynTempMax");
                    putMin(acc, data, "dynTempMin");
                    putMed(acc, data, "dynTempMed");
                    putAmp(acc, data, "dynTempAmp");
                    var sMedida = getCookie(acc + "&" + "sMeasure");
                    if (sMedida == "fahrenheit") {
                        var values = data.map(x => Number((parseFloat(x.value) * 9 / 5 + 32).toFixed(2)));
                    } else {
                        var values = data.map(x => Number(parseFloat(x.value).toFixed(2)));
                    }
                    vLabels = data.map(x => new Date(x.date).toTimeString());
                    new Chart(ctx, {
                        // The type of chart we want to create
                        type: 'line',

                        // The data for our dataset
                        data: {
                            labels: vLabels,
                            datasets: [{
                                label: "Gráfico dinâmico",
                                borderColor: [
                                    'rgba(0,0,0,1)',

                                ],
                                backgroundColor: 'rgba(214, 129, 0, 0.8)',
                                borderWidth: 1,

                                borderColor: 'rgb(0, 0, 0)',
                                data: values,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            title: {
                                display: true,
                                text: 'Gráfico dinâmico'
                            },
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
                    document.getElementById("dynamicGraph").textContent = "Não existem dados para apresentar o gráfico!";
                    document.getElementById("dynamicGraph").style.fontSize = "24px";
                    document.getElementById("dynamicGraph").style.paddingTop = "200px";
                    document.getElementById("dynTempMax").textContent = "Sem dados";
                    document.getElementById("dynTempMax").textContent = "Sem dados";
                    document.getElementById("dynTempMax").textContent = "Sem dados";
                    document.getElementById("dynTempMax").textContent = "Sem dados";
                }
            } else {
                document.getElementById("dynamicGraph").textContent = "Não existem dados para apresentar o gráfico!";
                document.getElementById("dynamicGraph").style.fontSize = "24px";
                document.getElementById("dynamicGraph").style.paddingTop = "200px";
                document.getElementById("dynTempMax").textContent = "Sem dados";
                document.getElementById("dynTempMax").textContent = "Sem dados";
                document.getElementById("dynTempMax").textContent = "Sem dados";
                document.getElementById("dynTempMax").textContent = "Sem dados";

            }
        }
    };
    xhttp.open("GET", "/temp?account=" + acc + "&start=" + start + "&end=" + end, true);
    xhttp.send();
}

function checkDate() {
    var docStart = document.getElementById("staticDateStart");
    var docEnd = document.getElementById("staticDateEnd");
    var docTimeStart = document.getElementById("staticTimeStart");
    var docTimeEnd = document.getElementById("staticTimeEnd");
    var cond = new Date(docEnd.value).getTime() - new Date(docStart.value).getTime();
    if (cond < 0) {
        docStart.value = docEnd.value;
        docTimeStart.value = "00:00";
        docTimeEnd.value = "23:59"
    } else if (cond == 0) {
        docTimeStart.value = "00:00";
        docTimeEnd.value = "23:59"
    }
}

Date.prototype.getWeek = function (dat) {
    var date = new Date(dat);
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

function getValuesByWeak(grouped) {
    var iterator = grouped.values();
    let result = iterator.next();
    var values = [];
    var dates = [];
    while (!result.done) {
        var vals = result.value.map(data => data.value);
        var valsdate = result.value.map(data => new Date(data.date).getTime());
        var max = Math.max(...vals);
        var min = Math.min(...vals);
        values.push({
            max: max,
            min: min
        });
        dates.push({
            maxDate: new Date(Math.max(...valsdate)),
            minDate: new Date(Math.min(...valsdate))
        });
        result = iterator.next();
    }
    var results = {
        values: values,
        dates: dates
    }
    return results;
}

function drawStaticLineGraph(ctx, acc, start, end) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                if (data.length > 0) {
                    putMax(acc, data, "staticTempMax");
                    putMin(acc, data, "staticTempMin");
                    putMed(acc, data, "staticTempMed");
                    putAmp(acc, data, "staticTempAmp");

                    var diference = new Date(end).getTime() - new Date(start).getTime();
                    let grouped = [];
                    if (diference > 97372800000) {
                        grouped = groupBy(data, x => new Date(x.date).getFullYear());
                    } else if (diference > 7686000000) {
                        grouped = groupBy(data, x => new Date(x.date).getMonth());
                    } else if (diference > 2419140000) {
                        grouped = groupBy(data, x => new Date(x.date).getWeek(x.date));
                    } else if (diference > 86400000) {
                        grouped = groupBy(data, x => new Date(x.date).getDay());
                    } else {
                        grouped = groupBy(data, x => new Date(x.date).getHours());
                    }
                    var staticDate = getValuesByWeak(grouped);
                    var mins = staticDate.values.map(x => x.min);
                    var maxs = staticDate.values.map(x => x.max);
                    var sMedida = getCookie(acc + "&" + "sMeasure");
                    if (sMedida == "fahrenheit") {
                        mins = mins.map(x => Number((parseFloat(x) * 9 / 5 + 32).toFixed(2)));
                        maxs = maxs.map(x => Number((parseFloat(x) * 9 / 5 + 32).toFixed(2)));
                    } else {
                        mins = mins.map(x => Number(parseFloat(x).toFixed(2)));
                        maxs = maxs.map(x => Number(parseFloat(x).toFixed(2)));
                    }
                    vLabels = staticDate.dates.map(x => "Entre " + x.minDate + " e " + x.maxDate);
                    new Chart(ctx, {
                        // The type of chart we want to create
                        type: 'bar',

                        // The data for our dataset
                        data: {
                            labels: vLabels,
                            datasets: [
                                {
                                    label: 'Minimo',
                                    data: mins,
                                    scaleBeginAtZero: true,
                                    type: 'bar',
                                    borderWidth: 1,
                                    borderColor: 'rgb(0, 0, 0)',
                                    backgroundColor: 'rgba(0, 129, 214, 0.8)',
                                },
                                {
                                    label: 'Máximo',
                                    data: maxs,
                                    borderWidth: 1,
                                    scaleBeginAtZero: true,
                                    type: 'bar',
                                    borderColor: 'rgb(0, 0, 0)',
                                    backgroundColor: 'rgba(0,129, 118, 0.8)',
                                }
                            ]
                        },

                        // Configuration options go here
                        options: {
                            title: {
                                display: true,
                                text: 'Gráfico com intervalo temporal'
                            },
                            maintainAspectRatio: false,
                            legend: {
                                display: false,
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        fontColor: "#000",
                                        fontSize: 12,
                                        beginAtZero: true,
                                        suggestedMin: 0
                                    },
                                    gridLines: {
                                        color: "#000",
                                        lineWidth: 1,
                                        zeroLineColor: "#000",
                                        zeroLineWidth: 1
                                    }
                                }],
                                xAxes: [{
                                    display: false
                                }]
                            },
                            animation: {
                                duration: 2000, // general animation time
                            },
                        }
                    });
                } else {
                    document.getElementById("staticGraph").textContent = "Não existem dados para apresentar o gráfico!";
                    document.getElementById("staticGraph").style.fontSize = "24px";
                    document.getElementById("staticGraph").style.paddingTop = "200px";
                    document.getElementById("staticTempMax").textContent = "Sem dados";
                    document.getElementById("staticTempMax").textContent = "Sem dados";
                    document.getElementById("staticTempMax").textContent = "Sem dados";
                    document.getElementById("staticTempMax").textContent = "Sem dados";
                }
            } else {
                document.getElementById("staticGraph").textContent = "Não existem dados para apresentar o gráfico!";
                document.getElementById("staticGraph").style.fontSize = "24px";
                document.getElementById("staticGraph").style.paddingTop = "200px";
                document.getElementById("staticTempMax").textContent = "Sem dados";
                document.getElementById("staticTempMax").textContent = "Sem dados";
                document.getElementById("staticTempMax").textContent = "Sem dados";
                document.getElementById("staticTempMax").textContent = "Sem dados";
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

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

document.onreadystatechange = function checkUser() {
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
            var welcomeDiv = document.getElementById("divWelcome");
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
                if (welcomeDiv) {
                    welcomeDiv.className = "welcomeDivAlt";
                    welcomeDiv.textContent = "Gráficos";
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
                if (welcomeDiv) {
                    welcomeDiv.className = "welcomeDiv";
                    welcomeDiv.textContent = "Posto meteorológico com RaspBerry";
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
    var dat = new Date();
    if (!staticDateStart) {
        staticDateStart = dat.getFullYear() + "-" + (dat.getMonth() + 1) + "-" + dat.getDate();
        setCookie(account + "&" + "staticDateStart", staticDateStart, 1);
    }
    var staticDateEnd = getCookie(account + "&" + "staticDateEnd");
    if (!staticDateEnd) {
        staticDateEnd = dat.getFullYear() + "-" + (dat.getMonth() + 1) + "-" + dat.getDate();
        setCookie(account + "&" + "staticDateEnd", staticDateEnd, 1);
    }
    var staticTimeStart = getCookie(account + "&" + "staticTimeStart");
    if (!staticTimeStart) {
        staticTimeStart = "00:00";
        setCookie(account + "&" + "staticTimeStart", staticTimeStart, 1);
    }
    var staticTimeEnd = getCookie(account + "&" + "staticTimeEnd");
    if (!staticTimeEnd) {
        staticTimeEnd = "23:59";
        setCookie(account + "&" + "staticTimeEnd", staticTimeEnd, 1);
    }
    var dynduration = getCookie(account + "&" + "dynduration");
    if (!dynduration) {
        dynduration = "21600";
        setCookie(account + "&" + "dynduration", dynduration, 1);
    }
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
        function staticIntervalTemperature() {
            setInterval(function getTemp() {
                drawStaticLineGraph(ctxStatic, account, sDateI, sDateF);
            }, 60000, true);
        }
        staticIntervalTemperature();
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