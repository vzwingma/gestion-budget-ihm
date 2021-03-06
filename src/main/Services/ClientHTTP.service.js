/** Service d'Authentification**/
 import { getOAuthToken } from './../Services/Auth.service'

    /** HTTP Client Header **/
    export const getHeaders = () => new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + getOAuthToken()
    });

    export const getURL = (uri, path, params) => {
        var fullURL = uri + path;
        if(params != null){
            params.forEach(param => {
                fullURL = fullURL.replace("{{}}", param)
            })
        }
        console.log("Appel de l'URL : [" + fullURL + "]")
        return fullURL;
    }