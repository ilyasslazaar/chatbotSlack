const SlackBot = require("slackbots");
const schedule = require('node-schedule');
const sleep = require('system-sleep')
var request = require('request');
var accents = require('remove-accents');

const matcher = require("./macher");


const Conges = require('./conges');
const abssanceType1 = new Conges();

const Requests = require('./requests');
const requests = new Requests();

const WebService = require('./webService');
const webService = new WebService();

const Project = require('./projects');
const project = new Project();

var options;
var auth;
var collaborateurId;
var orderName =null;
var abssanceType;
var startDate;
var endDate
var collaborators;
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

var abssance = {
                 abssanceType:null,
                 collaborator:null,
                 comment:null,
                 endDate:null,
                 isValid: true,
                 startDate:null
               };
var duration;
var ver;
var ver1;
var notUnderstand;

var str;
 //chaine de vérification
 var str1
 
    // creation d'un slack bot
    var bot = new SlackBot({
        token: "xoxb-687525419360-688876395300-W6znSEbhLOJOclpkK261WPnH",
        name: "test-bot"
    });

    bot.on("start", function(){
         requests.getCollaboratorsUsersProjects(collaborators,users,projects);
         webService.webService();
     });

    schedule.scheduleJob({hour: 8, minute:(44)}, function(){

        var str2 = "\n"
        for(var i=1 ; i<=projects.length ; i++)
           str2 = str2+i+"- "+projects[i-1].name+"\n";
        for(var i=0 ; i<collaborators.length;i++){

            var username = getUserName(collaborators[i].email , users);
            if(username){
                bot.postMessageToUser(username,"Bonjour! sur quel projet vous allez travailler aujourd'hui?"+str2);
            }
        }
        bot.on("message", function(data) {
        
        if (data.type !== "message") {
            return;
        }
        
        
        if(data.user){
            getCollaborateurId(collaborators, users, data);
              if(projectId && task.imputations.length === 0)
                project.getTaskId(data);
              if(projectId && task.imputations.length !=0){
                proiectId = null;
                task = [];
              }
              if(!projectId)
                project.getProjectId(data);
            }
          })

      })

    
    //lencement d'un event message
    bot.on("message", function(data) {
        
        if (data.type !== "message") {
            return;
        }
        
        if(data.user){
            getCollaborateurId(collaborators, users, data);
            if(collaborateurId){
                handleMessage(data.text , data);
            }else{
                bot.postMessage(data.channel, "Pardon! je ne peux pas vous aider");
            }
        }

    });

    //fonction du traitement des message
    function handleMessage(message , data) {
        
        matcher(accents.remove(data.text), messageData =>{

                if(!messageData.intent && !ver1){
                   bot.postMessage(data.channel, "Pardon! j'ai pas compris");
                    notUnderstand = 1;
                    return;
                }
            });

        if(!notUnderstand){
        
            str1 ="";
            str = data.text.split(/\s+/);

            for (i=0 ; i<str.length ; i++){
                matcher(accents.remove(str[i]), messageData =>{
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

                orderName = abssanceType1.getOrder(str[i],data,orderName);
                abssanceType1.getOrderType(str[i],data,abssance,orderName,bot);
                abssanceType1.getStartAndEndDat(str[i],data,abssance,str[i-1],ver);
            }
        
            if(!orderName && !abssance.abssanceType){
                for (i=0 ; i<str.length ; i++){
                    orderName = abssanceType1.getOrder(str[i],data,orderName); 
                }
            }
        
            if(orderName && !abssance.abssanceType && !abssance.startDate && !abssance.endDate){
                bot.postMessage(data.channel, "de quel type?\n"+
                                              "- congé payé\n"+
                                              "- congé de naissance\n"+
                                              "- congé de maternité\n"+
                                              "- congé de maladie\n"+
                                              "- congé de mariage\n");
                for (i=0 ; i<str.length ; i++){
                    abssanceType1.getOrderType(str[i],data,abssance,orderName,bot);
                    abssanceType1.getStartAndEndDat(str[i],data,abssance,str[i-1],ver);
                }
            }

            if(orderName && abssance.abssanceType && !abssance.startDate && !abssance.endDate){
                ver = 1
                bot.postMessage(data.channel, "vous n'avez pas encore spécifié la date de début et de fin de votre congé! (mm/jj/aaaa)");
                for (i=0 ; i<str.length ; i++){
                    abssanceType1.getStartAndEndDat(str[i],data,abssance,str[i-1],ver);
                }
            }


            if(orderName && abssance.abssanceType && !abssance.startDate && !ver){
                bot.postMessage(data.channel, "vous n'avez pas encore spécifié la date de début de votre congé! (mm/jj/aaaa)");
                for (i=0 ; i<str.length ; i++){
                    abssanceType1.getStartAndEndDat(str[i],data,abssance,str[i-1],ver);
                }
            }

            if(orderName && abssance.abssanceType && !abssance.endDate && !ver){
                bot.postMessage(data.channel, "vous n'avez pas encore spécifié la date de fin de votre congé! (mm/jj/aaaa)");
                for (i=0 ; i<str.length ; i++){
                    abssanceType1.getStartAndEndDat(str[i],data,abssance,str[i-1],ver);
                }
            }

            if(!isNaN(endDate) && !isNaN(startDate) && endDate<startDate){
                bot.postMessage(data.channel, "pardon, la date de la fin de conge est inférieur à la date du début");
                abssance.startDate = null;
                abssance.endDate = null;
            }

            if((!orderName || !abssance.abssanceType) && (endDate || startDate) ){
                bot.postMessage(data.channel, "pardon, vous devez d'abord spécifier votre demande");
                abssance.startDate=null;
                abssance.endDat=null;
            
            }

            if(orderName && abssance.abssanceType && abssance.startDate && abssance.endDate){
            bot.postMessage(data.channel, "order : "+orderName+" ; abssanceType : "+abssanceType+" ; startDate : "
                                          +startDate+" ; endDate : "+endDate )
            abssance.collaborator = collaborateurId;
            abssance.comment = "coment";
            
            options = {
                    url: 'http://recette-novy-api.novelis.io/collaborator/api/absences',
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
                
        });
                sleep(1000);
        orderName = null;
        abssance.abssanceType = null;
        abssance.startDate = null;
        abssance.endDate = null;
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


    


    function getCollaborateurId(collaborators, users, data){

        var UserEmail
        var i =0;

        while(users[i].id != data.user && i < users.length){
            i++;
        }
        userEmail = users[i].profile.email;

        for(var j=0 ; j<collaborators.length ; j++){
            if(userEmail === collaborators[j].email){
            collaborateurId = collaborators[j].id;
            return;
            }
            
        }

    }

    function getUserName(userEmail, users){
        var userName;
        var i =0;

        while(userEmail != users[i].profile.email && i < users.length-1){
            i++;
        }
        userName = users[i].name;

        return userName;
    }