
var request = require('request');


class Request{

    getCollaboratorsUsersProjects(collaborators,users,projects){
        var username = 'jenun@intempmail.com'
        var password = 'N0velis'
        var obj;
        var userEmail;
        var options;
        var auth;
        var strAuth;
        var user

        options = {
            url: 'http://recette-novy-api.novelis.io/api/authenticate',
            body: JSON.stringify({
                username: username,
                password: password
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
 
// la deuxième requete 

        options = {
            url: 'https://slack.com/api/users.list?token=xoxp-687525419360-676190667394-698919274613-3b5b02d68e29f20e6b51670ccf8e2716&pretty=1',
            method : 'get'
        }

        request(options, function (err, res, body) {
            if (err) {
            console.log(err)
            return
            }
            
            users = JSON.parse(body).members;
        })



        auth = "Bearer "+ strAuth;
        options = {
            url: 'http://recette-novy-api.novelis.io/collaborator/api/collaborators?activated=true',
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
        
           collaborators = JSON.parse(body);
    })
     
    options = {
        url: 'http://recette-novy-api.novelis.io/collaborator/api/projects?activated=true',
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
  
    projects = JSON.parse(body);
  
    })

    })
}

}

module.exports = Request;
