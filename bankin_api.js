import basic_auth from "./basic_auth.js"




async function clean_accounts_object(accounts, length) {
    
    while(accounts[length-2].link.next === null) {
        delete accounts[length-1]
        length--
    }
    return accounts
}

// retrieve the accounts
async function getAllAccount(bankin_auth_data, URL_path, access_token) {
    const header = {"Content-Type": "application/json"}
    

    const bankin_auth = new basic_auth(null, null, null, null, bankin_auth_data.baseUrl)

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

// async function GetAllTransaction


export {clean_accounts_object, getAllAccount}