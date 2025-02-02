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

    async AuthorizationBearerRequest (custome_headers, URL_path, access_token) {
        return new Promise((resolve, reject) => {
            axios.get(this.baseUrl + URL_path, {
                headers: { 
                    custome_headers,
                    "Authorization": `Bearer ${access_token}`
                },
            }).then(function (response) {
                resolve(response.data)
            }
            ).catch(function (error) {
                reject(error)
                console.log("❌ AuthorizationBearerRequest error", error)
                throw error
            })})
    }

}

export default BasicAuth

