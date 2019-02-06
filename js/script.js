var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function get() {
    //var request = new XMLHttpRequest();
    window.alert('Hello');
    // Open a new connection, using the GET request on the URL endpoint
    /* request.open('GET', 'https://metereologia.herokuapp.com/api/users', true);

    request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.forEach(user => {
                console.log(user.name);
            });
        } else {
            console.log('error');
        }
    }
    request.send(); */
}