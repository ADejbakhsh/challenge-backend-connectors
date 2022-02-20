import BasicAuth from "./basic_auth.js"

const login = "BankinUser"
const password = "12345678"
const clientId = "BankinClientId"
const clientSecret = "secret"



const bankin_auth = new BasicAuth(clientId, clientSecret, login, password, "http://localhost:3000")

const  refresh_token = bankin_auth.authenticate({"Content-Type": "application/json"}, "/login")

//TODO Adejbakh trouver meilleur nom de variable ou meilleur methode
const resolved = await Promise.resolve(refresh_token)

const accessToken = bankin_auth.getAccessToken({"content-type": "application/x-www-form-urlencoded"}, "/token", resolved.refresh_token)

accessToken.then(function (response) {
    console.log("access_token", response.access_token)
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


