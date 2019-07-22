 
const SlackBot = require("slackbots");

const express = require("express");
const app = express();

const matcher = require("./macher");

//
const fs = require('fs')

 var orderName;
 var abssanceType;
 var startDate;
 var endDate
 var collaborateurId;
 var sendVer;

 var ver;
 var notUnderstand;
 var str;
 //chaine de vérification
 var str1
 
	// creation d'un slack bot
    var bot = new SlackBot({
        token: "xoxb-687525419360-688876395300-CsiR1tQa3UPDR75oNIDmRwIf",
        name: "test-bot"
    });

    
    //lencement d'un event message
    bot.on("message", function(data) {
        
        if (data.type !== "message") {
            return;
        }
        getCollaborateurId();
        if(collaborateurId)
        console.log(collaborateurId);
        if(data.user){
            getCollaborateurId();
            //if(collaborateurId){
                handleMessage(data.text , data);
            /*}else{
                bot.postMessage(data.channel, "Pardon! je peux pas vous aider");
            }*/
        }
        if(orderName && abssanceType && startDate && endDate && !sendVer){
            bot.postMessage(data.channel, "order : "+orderName+" ; abssanceType : "+abssanceType+" ; startDate : "
                                          +startDate+" ; endDate : "+endDate );
            sendVer = 1;
        }
    });

    //fonction du traitement des message
    function handleMessage(message , data) {
        // vider la chaine de vérification
        matcher(data.text, messageData =>{

                if(!messageData.intent){
                    bot.postMessage(data.channel, "Pardon! j'ai pas compris");
                    notUnderstand = 1;
                    return;
                }
            });

        if(!notUnderstand){
        
            str1 ="";
            str = data.text.split(" ");

            for (i=0 ; i<str.length ; i++){
                matcher(str[i], messageData =>{
                switch(messageData.intent){
                    case "hello":
                        var hour = new Date().getHours();
                        if(hour>5 && hour<18)
               	            sendGreetingMorning(data.channel);
                        else
                            sendGreetingNight(data.channel);
                    break;
                    default :
                    break;
                }
          
                });

                getOrder(str[i],data);
                getOrderType(str[i],data);
                getStarAndEndDat(str[i],data);
            }
        
            if(!orderName && !abssanceType){
                for (i=0 ; i<str.length ; i++){
                    getOrder(str[i],data);
                }
            }
        
            if(orderName && !abssanceType && !startDate && !endDate){
                bot.postMessage(data.channel, "de quel type?");
                for (i=0 ; i<str.length ; i++){
                    getOrderType(str[i],data);
                    getStarAndEndDat(str[i],data);
                }
            }

            if(orderName && abssanceType && !startDate && !endDate){
                ver = 1
                bot.postMessage(data.channel, "vous n'avez pas encore spécifié la date de début et de fin de votre congé!");
                for (i=0 ; i<str.length ; i++){
                    getStarAndEndDat(str[i],data);
                }
            }


            if(orderName && abssanceType && !startDate && !ver){
                bot.postMessage(data.channel, "vous n'avez pas encore spécifié la date de début de votre congé!");
                for (i=0 ; i<str.length ; i++){
                    getStarAndEndDat(str[i],data);
                }
            }

            if(orderName && abssanceType && !endDate && !ver){
                bot.postMessage(data.channel, "vous n'avez pas encore spécifié la date de fin de votre congé!");
                for (i=0 ; i<str.length ; i++){
                    getStarAndEndDat(str[i],data);
                }
            }

            if(!isNaN(endDate) && !isNaN(startDate) && endDate<startDate){
                bot.postMessage(data.channel, "pardon, la date de la fin de conge est inférieur à la date du début");
                startDate = null;
                endDate = null;
            }

            if((!endDate || !startDate) && (endDate || startDate) ){
                bot.postMessage(data.channel, "pardon, vous devez d'abord spécifier votre demande");
                startDate=null;
                enddat=null;
            
            }
        }
        notUnderstand = null;
    }


    //fonctions pour envoyer les message du bot vert channel
    function sendGreetingMorning(channel) {
        var greeting = getGreetingMorning();
        bot.postMessage(channel, greeting);
    }

    function sendGreetingNight(channel){
        var greeting = getGreetingNight();
        bot.postMessage(channel, greeting);
    }

 	//fonctions pour générer des messages aléatoire pour dire hello
    function getGreetingMorning() {
        var greetings = [
            "Bonjour! comment je peux vous aider",
            "hi there! comment je peux vous aider",
            "cheerio! comment je peux vous aider",
            "how do you do! comment je peux vous aider"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

     function getGreetingNight() {
        var greetings = [
            "Bonsoir! comment je peux vous aider",
            "hi there! comment je peux vous aider",
            "cheerio! comment je peux vous aider",
            "how do you do! comment je peux vous aider"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    //fonction por gérer les orders
    function getOrder(str,data){
       matcher(str, messageData =>{
        switch(messageData.intent){
            case "congé":
                orderName = "congé";
            break;

            default :
            break;
            }
        })
   }

    //fonction pour gérer les types des orders
    function getOrderType(str,data){
            
        matcher(str, messageData =>{
        switch(messageData.intent){
            case "payé":
                abssanceType = 31;
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé payé ");
                }
                
            break;

            case "naissance":
                abssanceType = 64;
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé de naissance");
                }
            break;

            case "maternité":
                abssanceType = 10;
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé maternité");
                }
            break;

            case "maladie":
                abssanceType = 7;
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé maladie");
                }
            break;

            case "mariage":
                abssanceType = 6;
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé mariage");
                }
            break;

            default :
            break;
            }
        })
    }


    function getStarAndEndDat(str,data){
       matcher(str, messageData =>{
        switch(messageData.intent){
                case "date":
                    if(str1 ==="du"){
                        if(isNaN(new Date(str)) || new Date(str)<=new Date()){
                            bot.postMessage(data.channel, "la date de début de congé invalide ("+str+")");
                        }
                        else{
                            startDate = new Date(str);
                            ver = null;
                        }
                    }
                    if(str1 ==="à"){
                        if(isNaN(new Date(str)) || new Date(str)<=new Date()){
                            bot.postMessage(data.channel, "vous avez entré une date invalide ("+str+")");
                        }
                        else{
                            endDate = new Date(str);
                            ver = null;
                        }
                    }
                break;

                default :
                break;
            }
            str1=str;
        })
    }

    //fonction pour créer et envoier le json
    function creatJsonFile(){

    	let order = {
   			"order" : orderName,
   			"type" : orderType,
		}
 
		/*app.get("/url", function(req, res, next) {
 			res.json(order);
		});
		app.listen(3000, function(){
 			console.log("Server running on port 3000");
		});*/   
    }


    function getCollaborateurId(){
        var request = require('request')
        var username = 'jenun@intempmail.com'
        var password = 'N0velis'
        var obj;
        var userEmail;

        var options = {
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
            url: 'https://slack.com/api/users.profile.get?token=xoxp-687525419360-676190667394'+
                 '-698919274613-3b5b02d68e29f20e6b51670ccf8e2716'+
                 '&user=UKW5LKMBL&pretty=1',
  
            method : 'get'
        }

        request(options, function (err, res, body) {
            if (err) {
            console.log(err)
            return
            }
            userEmail = JSON.parse(body).profile.email;
        })
/////////////////////////////////
        var auth = "Bearer "+ strAuth;
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
        for(i=0 ; i<JSON.parse(body).length ; i++){
            if(userEmail === JSON.parse(body)[i].email)
            collaborateurId = JSON.parse(body)[i].id;
            return;
        }
        collaborateurId = null;
    })

    })
        
}