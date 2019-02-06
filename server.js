var express = require("express");
const bodyParser = require('body-parser');
var app = express();
var router = express.Router();
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

router.post("/getuser", function (req, res) {
    var password = req.body.password;
    var email = req.body.email;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var user = JSON.parse(this.responseText);
            res.cookie("account", user.id);
            res.cookie("name", user.name);
            res.cookie("email", user.email);
            res.redirect("/");
        }
    };
    xhttp.open("POST", "https://metereologia.herokuapp.com/api/user/get", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    if (email !== "") {
        var params = "email=" + email + "&password=" + password;
        xhttp.send(params);
    } else {
        res.redirect("/");
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
                    res.render("info", { text: "Existe um utilizador com o mesmo email." })
                    break;
            }
        }
    };
    xhttp.open("POST", "https://metereologia.herokuapp.com/api/user", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var json = `{ "name": "${name}", "password": "${password}", "email": "${email}" }`;
    xhttp.send(json);

});

app.use("/", router);

app.use("*", function (req, res) {
    res.sendFile(path + "404.html");
});

app.listen(3000, function () {
    console.log("Live at Port 3000");
});