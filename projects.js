

const matcher = require("./macher");

class Project{

    getProjectId(data){
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
                          bot.postMessage(data.channel,"définir la tache avec la durée estimé pour chaqu'une "+str1);
                        break;
                    default :
                    break;
                    }
                  })
                }
        }

        getTaskId(data){
            var request = require('request');
            var date = new Date();
            var startDate1 = new Date(date.setDate(date.getDate() - date.getDay()+1));
            var endDate1 = new Date(date.setDate(date.getDate() - date.getDay()+7));
            date = new Date();
            
            getCollaborateurId(collaborators, users, data);

            var str = data.text.split(/\n/);
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

                           task.imputations.push({"id" : i , "date" : imputationDate  , "duration" : str1[1] , "taskId" : tasks[num-1].id , "ressource" : collaborateurId});
                        break;
                    default :
                    break;
                    }
                  })
                }
                task.collaboratorId.push(collaborateurId);

                var strStartDate = startDate1.getDate()+'-'+(startDate1.getMonth()+1)+'-'+startDate1.getFullYear();
                var strEndDate = endDate1.getDate()+'-'+(endDate1.getMonth()+1)+'-'+endDate1.getFullYear();
                task.startDate = strStartDate;
                task.endDate = strEndDate;
                
                var options = {
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
 }

    
}

module.exports = Project;
