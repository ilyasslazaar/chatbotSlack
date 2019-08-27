
const express = require("express");
const app = express();


class WebService{

    webService(){

        app.use(express.json());
        
        app.post('/', function(req, res){
            var body = req.body;
            var userName = getUserName(body.email, users);
            var ver = 0;
            for(var j=0 ; j<body.messages.length ; j++){
                var str = ""; 
                var i = 0;

                if(ver === 1 && j!=0)
                    j--;
                var k = j;
                ver1 = 1;
 
                str = str + body.messages[j].message+"\n";
                while(body.messages[j].actions[i]){
                    str = str +"- " + body.messages[j].actions[i].title + "\n";
                    i++;
                }

                if(ver === 0){
                bot.postMessageToUser(userName,str);
                ver = 1;
                }
                sleep(1);        
                bot.on("message" , function(data){
                    if (data.type !== "message") {
                         return;
                    }

                    for(var i=0 ; i<body.messages[k].actions.length ; i++)
                        if(data.text.toUpperCase() === body.messages[k].actions[i].title.toUpperCase() && ver===1){
                            ver = 0;
                            bot.postMessageToUser(userName,body.messages[k].actions[i].message);
                        }    
                })  
            }
            ver1 = null;
        });

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
  console.log(`Server listening on port ${PORT}...`);
});

}

}

module.exports = WebService;
