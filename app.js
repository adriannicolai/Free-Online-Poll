const express    = require('express');
const app        = express();
const ejs        = require('ejs');
const Router     = require('./routes'); 
const bodyParser = require('body-parser');

const server  = app.listen(proceess.env.PORT);
const io      = require('socket.io')(server);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/assets'));

app.use(Router);
var activePolls = [];
function randomNumber(takenId){
    let randomNumber = Math.floor(Math.random()*99999);
    if(randomNumber != takenId){
        return randomNumber;
    }
    randomNumber(takenId);
}

io.on('connect', function(socket){

    /* runs every new poll */
    socket.on('newPoll', function(){
        let pollId = randomNumber();
        if(activePolls.length>0){
            for(let x=0; x<activePolls.length; x++){
                if(pollId == activePolls[x].socketId){
                    pollId = randomNumber(activePolls[x].socketId);
                }
            }
            activePolls.push({pollId:pollId, socketId:socket.id, voteCount: 0});
            socket.join(pollId);
            socket.emit('servePollId', pollId);
        }
        else{
            activePolls.push({pollId:pollId, socketId:socket.id, voteCount: 0});
            socket.join(pollId);
            socket.emit('servePollId', pollId);
        }
    });
    socket.on('joinPoll', function(joinId){
        let intJoinId = parseInt(joinId);
        socket.join(intJoinId);
        for(let x=0; x<activePolls.length; x++){
            if(activePolls[x].pollId == intJoinId && (activePolls[x].question || activePolls[x].optionsValues)){
                socket.emit('serveQuestions', activePolls[x]);
            }
        }
    });
    socket.on('formSubmited', function(formData){
        for(let x=0; x<activePolls.length; x++){
            if(activePolls[x].pollId == formData.pollId){
                activePolls[x].voteCount += 1;
                for(let y in activePolls[x].optionsValues){
                    if(activePolls[x].optionsValues[y].option == formData.selectedOption)
                    activePolls[x].optionsValues[y].voteCount+= 1;
                }
            }
        }
        socket.to(parseInt(formData.pollId)).emit('newVote');
    });
    socket.on('updateAnswerPollForm', function(data){
        /* add the qestions in active polls so when a new user joins, i can emit */
        for(let x=0; x<activePolls.length; x++){
            if(activePolls[x].pollId == data.pollId){
                activePolls[x].question = data.question;
                activePolls[x].optionsValues = data.optionsValues;
            }
        }
        socket.to(data.pollId).emit('updateAnswerPollForm', data);
    });
    socket.on('checkPollResult', function(pollId){
        pollId = parseInt(pollId);
        socket.join(pollId);
        for(let x=0; x<activePolls.length; x++){
            if(activePolls[x].pollId == pollId){
                socket.emit('servePollResult', activePolls[x]);
            }
        }
    });
});