import basic_auth from "./basic_auth.js"




async function clean_accounts_object(accounts, length) {
    let clean_accounts = []
    
    // ne garde que le compte unique
    while(accounts[length-2].account[0].acc_number === accounts[length-1].account[0].acc_number) {
        delete accounts[length-1]
        length--
    }

    // put all the accounts in the same array
    for (let index = 0; index < length; index++) {
        if (accounts[index])
            clean_accounts = clean_accounts.concat(accounts[index].account)
    }

    //remove currency from all object
    for (let index = 0; index < clean_accounts.length; index++) {
        delete clean_accounts[index]?.currency
    }

    return clean_accounts
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
            //erreur tactic il fallait check si les compte était déjà present ou pas.
            if (resolved_AC[current_page].link.next !== null)
                MaxAccountPage_naif += 10 //  pas ouf mais pas de meilleur idée 
        }
        current_page++
    }
    // remove first result as it just links -> potential future bug
    delete resolved_AC[0]
    
    return resolved_AC
}

// async function GetAllTransactionByAccounts(bankin_auth_data, URL_path, access_token, accounts) {
//     const header = {"Content-Type": "application/json"}
//     const bankin_auth = new basic_auth(null, null, null, null, bankin_auth_data.baseUrl)

//     for (let index = 0; index < accounts.length; index++) {
//         const element = accounts[index]
        
//     }
// }


export {clean_accounts_object, getAllAccount}