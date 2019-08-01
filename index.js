 
const SlackBot = require("slackbots");
const schedule = require('node-schedule');
const sleep = require('system-sleep')
var request = require('request');

const express = require("express");
const app = express();

const matcher = require("./macher");


//const fs = require('fs')
var options;
var auth;
 var collaborateurId;
 var orderName;
 var abssanceType;
 var startDate;
 var endDate
 var collaborateurs;
 var users;
 var projects;
 var tasks;
 var projectId;
 var task = {
                imputations:[],
                collaboratorId: [],
                startDate,
                endDate
            };
 var duration;

 var ver;
 var notUnderstand;
 var str;
 //chaine de vérification
 var str1
 
    // creation d'un slack bot
    var bot = new SlackBot({
        token: <your token>,
        name: <your bot name>
    });

    bot.on("start", function(){
         getCollaborateursUsersProjects();
     });

    schedule.scheduleJob({hour: 8, minute:(30)}, function(){

        var str2 = "\n"
        for(var i=1 ; i<=projects.length ; i++)
           str2 = str2+i+"- "+projects[i-1].name+"\n";
        bot.postMessage("DKXTDHGUA","Bonjour! sur quel projet vous allez travailler aujourd'hui?"+str2);
        bot.on("message", function(data) {
        
        if (data.type !== "message") {
            return;
        }
        
        
        if(data.user){

              if(projectId && task.imputations.length === 0)
                getTaskId(data);
              if(projectId && task.imputations.length !=0){
                /*
                bot.postMessage(data.channel,"projectId : "+projectId+"  tasks : "+str);*/
                proiectId = null;
                task = [];
              }
              if(!projectId)
                getProjectId(data);
            }
          })

      })

    
    //lencement d'un event message
    bot.on("message", function(data) {
        
        if (data.type !== "message") {
            return;
        }
        
        if(data.user){
            getCollaborateurId(collaborateurs, users, data);
            //if(collaborateurId){
                handleMessage(data.text , data);
            /*}else{
                bot.postMessage(data.channel, "Pardon! je peux pas vous aider");
            }*/
        }
        if(orderName && abssanceType && startDate && endDate){
            bot.postMessage(data.channel, "order : "+orderName+" ; abssanceType : "+abssanceType+" ; startDate : "
                                          +startDate+" ; endDate : "+endDate )
            orderName = null;
            abssanceType = null;
            startDate = null;
            enddate = null;
        }
    });

    //fonction du traitement des message
    function handleMessage(message , data) {

        matcher(data.text, messageData =>{

                if(!messageData.intent){
                    bot.postMessage(data.channel, "Pardon! j'ai pas compris");
                    notUnderstand = 1;
                    return;
                }
            });

        if(!notUnderstand){
        
            // vider la chaine de vérification
            str1 ="";
            str = data.text.split(/\s+/);

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
                bot.postMessage(data.channel, "de quel type?\n"+
                                              "- congé payé\n"+
                                              "- congé de naissance\n"+
                                              "- congé de maternité\n"+
                                              "- congé de maladie\n"+
                                              "- congé de mariage\n");
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

            if((!orderName || !abssanceType) && (endDate || startDate) ){
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
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                  +"Je ponse que vous voulez un congé payé ");
                }
                else
                     abssanceType = 31;
                
            break;

            case "naissance":
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé de naissance");
                }
                else
                     abssanceType = 64;
            break;

            case "maternité":
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé maternité");
                }
                else
                     abssanceType = 10;
            break;

            case "maladie":
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé maladie");
                }
                else
                    abssanceType = 7;
            break;

            case "mariage":
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé mariage");
                }
                else
                    abssanceType = 6;
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
                    if(str1 ==="du" || str1 ==="Du" || str1 ==="DU"){
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
    }


    function getCollaborateursUsersProjects(){
        var username = 'jenun@intempmail.com'
        var password = 'N0velis'
        var obj;
        var userEmail;

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
            url: 'https://slack.com/api/users.list?token=xoxp-687525419360-676190667394'+
                 '-698919274613-3b5b02d68e29f20e6b51670ccf8e2716'+
                 '&pretty=1',
  
            method : 'get'
        }

        request(options, function (err, res, body) {
            if (err) {
            console.log(err)
            return
            }
             
            users = JSON.parse(body).members;
            
        })
///////////////////////////
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
        
           collaborateurs = JSON.parse(body);
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

    function getCollaborateurId(collaborateurs, users, data){

        var UserEmail
        var i =0;

        while(users[i].id != data.user && i < users.length-1){
            i++;
        }
        userEmail = users[i].profile.email;

        for(i=0 ; i<collaborateurs.length ; i++){
            if(userEmail === collaborateurs[i].email)
            collaborateurId = collaborateurs[i].id;
            return;
        }

    }

    //////
    function getProjectId(data){
      var str = data.text.split(/\s+/);
              for (i=0 ; i<str.length ; i++){
                matcher(str[i], messageData =>{
                switch(messageData.intent){
                        case "projectNumber":
                          var num = parseInt(str, 10)
                          if(num > projects.length){
                            bot.postMessage(data.channel,"pardon, vous devez choisir le numèro du projet");
                            break;
                          }
                          bot.postMessage(data.channel,"vous avez choisir le projet : "+projects[num-1].name);
                          projectId = projects[num-1].id;
                          tasks = projects[num-1].tasks
                          var str1 = "\n";
                          for(var j=1 ; j<=tasks.length ; j++){
                            str1 = str1+j+"- "+tasks[j-1].description+"\n";
                          }
                          bot.postMessage("DKXTDHGUA","définir la tache avec la durée estimé pour chaqu'une "+str1);
                        break;
                    default :
                    break;
                    }
                  })
                }
        }

        //
        function getTaskId(data){
            var request = require('request');

            var date = new Date();
            var startDate1 = new Date(date.getDate() - date.getDay()+1);
            var endDate1 = new Date(date.getDate() - date.getDay()+7);
            
            var str = data.text.split(/\n/);
                console.log(str[0]);
              for (i=0 ; i<str.length ; i++){
                var str1 = str[i].split(/\s+/);
                matcher(str1[0], messageData =>{
                switch(messageData.intent){
                        case "projectNumber":
                        
                          var num = parseInt(str1[0], 10)
                          if(num > tasks.length){
                            bot.postMessage(data.channel,"pardon, vous devez choisir le numèro de la tache");
                            break;
                          }

                           var imputationDate = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear();

                           task.imputations.push({"id" : i , "date" : imputationDate  , "duration" : str1[1] , "taskId" : tasks[num-1].id , "ressource" : 71});
                        break;
                    default :
                    break;
                    }
                  })
                }
                task.collaboratorId.push(71);

                var strStartDate = startDate1.getDate()+'-'+(startDate1.getMonth()+1)+'-'+startDate1.getFullYear();
                var strEndDate = endDate1.getDate()+'-'+(endDate1.getMonth()+1)+'-'+endDate1.getFullYear();
                task.startDate = strStartDate;
                task.endDate = strEndDate;
                
                options = {
                    url: 'http://recette-novy-api.novelis.io/collaborator/api/imputations/save',
                    headers : { 
                        'Authorization' : auth,
                        'Content-Type' : 'application/json'
                    },
                    body: task,
                    json:true,
                    method : 'post'
                }

    request(options, function (err, res, body) {
        if (err) {
            console.log(err)
            return
        }
        console.log(body);
  
    });

    console.log(task);
 }

       