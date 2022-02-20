import BasicAuth from "./basic_auth.js"

const login = "BankinUser"
const password = "12345678"
const clientId = "BankinClientId"
const clientSecret = "secret"



const bankin_auth = new BasicAuth(clientId, clientSecret, login, password, "http://localhost:3000")

const  refresh_token = bankin_auth.authenticate({"Content-Type": "application/json"}, "/login")

//TODO Adejbakh trouver meilleur nom de variable ou meilleur methode
const resolved_RT = await Promise.resolve(refresh_token)
const accessToken = bankin_auth.getAccessToken({"content-type": "application/x-www-form-urlencoded"}, "/token", resolved_RT.refresh_token)

const resolved_AT = await Promise.resolve(accessToken)
const accounts = bankin_auth.getAllAccount({"Content-Type": "application/json"}, "/accounts", resolved_AT.access_token)

const resolved_accounts = await Promise.resolve(accounts)
// ici il faut mettre MaxAccountPage_naif a jour dans la DB

