import basic_auth from "./basic_auth.js"


// retrieve the accounts                  URL path est voudou 
async function getAllAccount(bankin_auth_data, URL_path, access_token) {
    const header = {"Content-Type": "application/json"}
    
    // nul a chier j'ai pas trouver comment passer la réference de mon objet de class initial 😒
    const clientId = bankin_auth_data.clientId
    const clientSecret = bankin_auth_data.clientSecret
    const login = bankin_auth_data.login
    const password = bankin_auth_data.password

    const bankin_auth = new basic_auth(clientId, clientSecret, login, password, bankin_auth_data.baseUrl)

 

    //Combien de page je vais fetch avant de resolve la promesse
    // Pour eviter de de fetch des page qui n'existe pas.
    // le chiffre devrait etre dans une DB pour ne pas faire cette operation a chaque fois
    let MaxAccountPage_naif = 10
    let current_page = 0
    let accounts = []
    let resolved_AC = []
        
    while (current_page < MaxAccountPage_naif ) {
        accounts.push(bankin_auth.AuthorizationBearerRequest(header,`${URL_path}?page=${current_page}`, access_token))
        if (current_page === MaxAccountPage_naif -1) {
            resolved_AC = resolved_AC.concat(await Promise.all(accounts))

            accounts = []
            if (resolved_AC[current_page].link.next !== null)
                MaxAccountPage_naif += 10 //  pas ouf mais pas de meilleur idée 
        }
        current_page++
    }
    return resolved_AC
}




async function clean_accounts_object(accounts, length) {

    while(accounts[length-2].link.next === null) {
        delete accounts[length-1]
        length--
    }
    return accounts
}

export {clean_accounts_object, getAllAccount}