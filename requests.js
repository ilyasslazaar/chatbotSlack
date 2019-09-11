
var request = require('request');
const sleep = require('system-sleep');
const constant = require("./const");

class Request{

    getCollaboratorsUsersProjects(req){
        var obj;
        var userEmail;
        var options;
        var auth;
        var strAuth;
        var user

        options = {
            url: constant.slack_api_url,
            method : 'get'
        }

        request(options, function (err, res, body) {
            if (err) {
            console.log(err)
            return
            }
             
            req.users = JSON.parse(body).members;  
        })

        options = {
            url: constant.novy_api_authenticate_url,
            body: JSON.stringify({
                username: constant.novy_username,
                password: constant.novy_password
        }),

            headers : { 
                'Content-Type' : 'application/json' 
            },
            method : 'post'
        }

        request(options, function (err, res, body) {
            if (err) {
                console.log(err) 
                return
            }
            strAuth = JSON.parse(body).id_token;
            console.log(strAuth);
 
// la deuxième requete 

        auth = "Bearer "+ strAuth;
        req.auth = auth;
        options = {
            url: constant.novy_api_collaborators_url,
            headers : { 
                'Authorization' : auth
            },
            method : 'get'
        }

        request(options, function (err, res, body) {
            if (err) {
                console.log(err)
                return
            }
        
           req.collaborators = JSON.parse(body);
    })
     
    options = {
        url: constant.novy_api_projects_url,
        headers : { 
            'Authorization' : auth,
            'Content-Type' : 'application/json'
        },
        method : 'get'
    }

    request(options, function (err, res, body) {
        if (err) {
            console.log(err)
            return
        }
  
    req.projects = JSON.parse(body);
  
    })

    })    

}

sendAbsences(abssance,auth){
         var options = {
                    url: constant.novy_api_absences_url,
                    headers : { 
                        'Authorization' : auth,
                        'Content-Type' : 'application/json'
                    },
                    body: abssance,
                    json:true,
                    method : 'post'
                }

                request(options, function (err, res, body) {
                if (err) {
                    console.log(err)
                    return
                }
                console.log(abssance);
                console.log(body);
  
        });
    }    
}

module.exports = Request;
