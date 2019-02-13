var express = require("express");
const bodyParser = require('body-parser');
var app = express();
const port = process.env.PORT || 8080;
var router = express.Router();
const herokuUrl = "https://metereologia.herokuapp.com";
var path = __dirname + '/views/';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

process.env.PWD = process.cwd();
app.use(express.static(process.env.PWD + '/public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

router.use(function (req, res, next) {
    next();
});

router.get("/", function (req, res) {
    res.sendFile(path + "index.html");
});

router.get("/about", function (req, res) {
    res.sendFile(path + "about.html");
});

router.get("/create", function (req, res) {
    res.sendFile(path + "create.html");
});

router.get("/config", function (req, res) {
    res.sendFile(path + "config.html");
});

router.post("/getuser", function (req, res) {
    var password = req.body.password;
    var email = req.body.email;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            switch (this.status) {
                case 200:
                    var user = JSON.parse(this.responseText);
                    res.cookie("account", user.id);
                    res.cookie("name", user.name);
                    res.cookie("email", user.email);
                    res.cookie("call", true);
                    res.redirect("/");
                    break;
                case 401:
                    res.render("infoback", { text: "A password é necessária." });
                    break;
                case 402:
                    res.render("infoback", { text: "O utilizador não existe." });
                    break;
                default:
                    res.render("infoback", { text: "Problema desconhecido. Contacte o administrador" });
                    break;
            }
        }
    };
    xhttp.open("POST", herokuUrl + "/api/user/get", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    if (email !== "") {
        var params = "email=" + email + "&password=" + password;
        xhttp.send(params);
    } else {
        res.redirect("/");
    }
});

router.get("/temp", function (req, res) {
    var account = req.query.account;
    var start = req.query.start;
    var end = req.query.end;
    console.log(start);
    console.log(end);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.responseText);
            res.send(data);
        }
    };
    var params = "?account=" + account + "&start=" + new Date(start).toISOString() + "&end=" + new Date(end).toISOString();
    xhttp.open("GET", herokuUrl + "/api/temperature/get" + params);
    xhttp.setRequestHeader("Content-Type", "application/json;  charset=utf-8");
    if (account !== "") {
        xhttp.send();
    }
});


router.post("/config", function (req, res) {
    var account = req.body.account;
    var period = req.body.period;
    var dynduration = req.body.dynduration;
    var staticDateStart = req.body.staticDateStart;
    var staticDateEnd = req.body.staticDateEnd;
    var staticTimeStart = req.body.staticTimeStart;
    var staticTimeEnd = req.body.staticTimeEnd;
    var sMeasure = req.body.sMeasure;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 400) {
            let options = {
                maxAge: ((1000 * 60 * 60 * 24) * 365) * 10,
                httpOnly: false,
                signed: false
            }
            res.cookie(account + "&" + "dynduration", dynduration, options);
            res.cookie(account + "&" + "staticDateStart", staticDateStart, options);
            res.cookie(account + "&" + "staticDateEnd", staticDateEnd, options);
            res.cookie(account + "&" + "staticTimeStart", staticTimeStart, options);
            res.cookie(account + "&" + "staticTimeEnd", staticTimeEnd, options);
            res.cookie(account + "&" + "sMeasure", sMeasure, options);
            res.cookie(account + "&" + "period", period);
            res.render("infoback", { text: "Os valores foram atualizados." })
        } else if (this.readyState == 4 && this.status == 401) {
            res.render("info", { text: `O periodo de leitura é necessário.` });
        } else if (this.readyState == 4 && this.status == 402) {
            res.render("info", { text: `A conta de utilizador é necessária.` });
        } else if (this.readyState == 4 && this.status == 403) {
            res.render("info", { text: `A conta indicada não existe.` });
        } else if (this.readyState == 4) {
            res.render("info", { text: `Problema desconhecido, contacte o administrador.` });
        }
    };
    var params = "?account=" + account + "&period=" + period;
    xhttp.open("PUT", herokuUrl + "/api/configuration" + params);
    xhttp.setRequestHeader("Content-Type", "application/json;  charset=utf-8");
    if (account !== "") {
        xhttp.send();
    }
});

router.post("/createuser", function (req, res) {
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    console.log(name);
    console.log(password);
    console.log(email);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            switch (this.status) {
                case 201:
                    var user = JSON.parse(this.responseText);
                    res.render("info", { text: `O Utilizador com o nome "${user.name}" foi criado corretamente.` });
                    break;
                case 400:
                    res.render("info", { text: "Não foi inserido um nome de utilizador." });
                    break;
                case 401:
                    res.render("info", { text: "Não foi escolhida uma palavra-chave de acesso." });
                    break;
                case 402:
                    res.render("info", { text: "Existe um utilizador com o mesmo nome." });
                    break;
                case 403:
                    res.render("info", { text: "Existe um utilizador com o mesmo email." });
                    break;
                default:
                    res.render("infoback", { text: "Problema desconhecido. Contacte o administrador" });
                    break;
            }
        }
    };
    xhttp.open("POST", herokuUrl + "/api/user", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var json = `{ "name": "${name}", "password": "${password}", "email": "${email}" }`;
    xhttp.send(json);

});

app.use("/", router);

app.use("*", function (req, res) {
    res.sendFile(path + "404.html");
});

app.listen(port, function () {
    console.log("Live at Port " + port);
});
