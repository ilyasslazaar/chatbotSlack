

const matcher = require("./macher");

var accents = require('remove-accents');


class Conges{

    //fonction por gérer les orders
    getOrder(str,data,orderName){
       var order = orderName;
       matcher(accents.remove(str), messageData =>{
        switch(messageData.intent){
            case "congé":
                order = "congé";
            break;

            default :
            break;
            }
        })

       return order;
   }
   

    getOrderType(str,data,abssance,orderName,bot){
        matcher(accents.remove(str), messageData =>{
        switch(messageData.intent){
            case "payé":
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                  +"Je ponse que vous voulez un congé payé ");
                }
                else
                     abssance.abssanceType = 31;
                
            break;

            case "naissance":
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé de naissance");
                }
                else
                     abssance.abssanceType = 64;
            break;

            case "maternité":
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé maternité");
                }
                else
                     abssance.abssanceType = 10;
            break;

            case "maladie":
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé maladie");
                }
                else
                    abssance.abssanceType = 7;
            break;

            case "mariage":
                if(!orderName){
                    bot.postMessage(data.channel, "Pardon, j'ai pas conpris.\n"
                                                   +"Je ponse que vous voulez un congé mariage");
                }
                else
                    abssance.abssanceType = 6;
            break;

            default :
            break;
            }
        })
    }


    getStartAndEndDat(str,data,abssance,str1,ver){
        var startDate;
        var endDate;
        console.log(str1);
       matcher(str, messageData =>{
        switch(messageData.intent){
                case "date":
                    if(str1 ==="du" || str1 ==="Du" || str1 ==="DU"){
                        if(isNaN(new Date(str)) || new Date(str)<=new Date()){
                            bot.postMessage(data.channel, "vous avez entré une date invalide ("+str+") (mm/jj/aaaa)");
                        }
                        else{
                            startDate = new Date(str);
                            abssance.startDate = startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate()+" 00:00:00";
                            ver = null;
                        }
                    }
                    if(str1 ==="à"){
                        if(isNaN(new Date(str)) || new Date(str)<=new Date()){
                            bot.postMessage(data.channel, "vous avez entré une date invalide ("+str+") (mm/jj/aaaa)" );
                        }
                        else{
                            endDate = new Date(str);
                            abssance.endDate = endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate()+" 08:30:00";
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


}

module.exports = Conges;
