import axios from "axios"

//Used for URL-Encoding Bodies (x_www_form_urlencoded) recommended here https://axios-http.com/docs/urlencoded
//import qs from "qs"


// Cette classe par du principe que tout les basic auth sont identique
class BasicAuth {

    constructor(clientId, clientSecret, login, password, baseUrl) {
        this.server_login = clientId
        this.server_password = clientSecret
        this.login = login
        this.password = password
        this.baseUrl = baseUrl
    }

    // Authenticate to retrieve the refresh token
    async authenticate(custome_headers, URL_path) {
        const refresh_token = new Promise((resolve, reject) => {            
            axios.post(this.baseUrl + URL_path, {
                "user": this.login,
                "password": this.password
            }, {
                headers: { custome_headers },
                auth: {
                    username: this.server_login,
                    password: this.server_password
                }
            }).then(function (response) {
                resolve(response.data)
            }).catch(function (error) {
                reject(error)
                // should be in a managed log so we can easily see if it's a 404 or 401
                console.log("❌ authenticate error : unable to get refresh token")
                throw error
            })
        }
        )
        return refresh_token
    }

    // retrieve the access token
    async getAccessToken(custome_headers, URL_path, refresh_token) {

        const access_token = new Promise((resolve, reject) => {
            axios.post(this.baseUrl + URL_path,
                `grant_type=refresh_token&refresh_token=${refresh_token}`,
                {
                    headers: { custome_headers },
                }).then(function (response) {
                resolve(response.data)
            }
            ).catch(function (error) {
                reject(error)
                console.log("❌ getAccessToken error : unable to get access token")
                throw error
            }
            )
        })
        return access_token
    }

    // la fonction a un soucis en cas de limite d'appel API par minute
    // Elle fait aussi face au de trop de chose ce passe dedans -> mes reject resolve rende la lecture difficile
    // TODO: atomiser la fonction
    // retrieve the accounts
    async getAllAccount(custome_headers, URL_path, access_token) {
    
        //Combien de page je vais fetch avant de resolve la promesse
        // Pour eviter de de fetch des page qui n'existe pas.
        // le chiffre devrait etre dans une DB pour ne pas faire cette operation a chaque fois
        let MaxAccountPage_naif = 10
        let current_page = 0
        let accounts = []
        let resolved_AC = []
        
        while (current_page < MaxAccountPage_naif ) {
            accounts.push(new Promise((resolve, reject) => {
                axios.get(this.baseUrl + URL_path + "?page=" + current_page , {
                    headers: { 
                        custome_headers,
                        "Authorization": `Bearer ${access_token}`
                    },
                }).then(function (response) {
                    resolve(response.data)
                }
                ).catch(function (error) {
                    reject(error)
                    console.log("❌ getAccount error : unable to get accounts")
                    throw error
                })})
            )
            if (current_page === MaxAccountPage_naif -1) {
                resolved_AC = resolved_AC.concat(await Promise.all(accounts))
                //reset accounts
                accounts = []
        
                console.log(resolved_AC[current_page].link.next !== null)
                if (resolved_AC[current_page].link.next !== null) {
                    MaxAccountPage_naif += 10 //  pas ouf mais pas de meilleur idée 
                }

            }
            current_page++
        }
        return resolved_AC
    }
}

export default BasicAuth

