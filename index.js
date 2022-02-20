import BasicAuth from "./basic_auth.js"

const login = "BankinUser"
const password = "12345678"
const clientId = "BankinClientId"
const clientSecret = "secret"


const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }


const bankin_auth = new BasicAuth(clientId, clientSecret, login, password, "http://localhost:3000");

const refresh_token = bankin_auth.authenticate(headers, "/login")

refresh_token.then(function (response) {
    console.log(response);
})

//Authenticate to the API to retrieve an access token



// axios.post(`http://localhost:3000/login`,{
//     "user": login,
//     "password": password
// } , {
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     },
//     auth: {
//         username: clientId,
//         password: clientSecret
//     }
    
// }).then(function (response) {
//     console.log(response);
//     // je recupere le token
// }).catch(function (error) {
//     console.log(error);
// });


