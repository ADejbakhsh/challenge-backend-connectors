import axios from "axios";
// Contient les methode pour ce connecter avec Basic Auth


// Cette classe par du principe que tout les basic auth sont identique
 class BasicAuth {

    constructor(clientId, clientSecret, login, password, baseUrl) {
        this.server_login = clientId;
        this.server_password = clientSecret;
        this.login = login;
        this.password = password;
        this.baseUrl = baseUrl;
    }

    // Authenticate to retrieve the refresh token
    async authenticate(custome_headers, URL_path) {
        const refresh_token = new Promise((resolve, reject) => {
            axios.post(this.baseUrl + URL_path, {
                "user": this.login,
                "password": this.password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                auth: {
                    username: this.server_login,
                    password: this.server_password
                }
            }).then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
                reject(error);
                // should be in a managed log so we can easily see if it's a 404 or 401
                console.log("❌ authenticate error : unable to get refresh token",);
            });
        }
        );
        return refresh_token;
    }
}

export default BasicAuth;

