

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

    
}

module.exports = Project;
