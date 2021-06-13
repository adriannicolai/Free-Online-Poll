const Express =     require('express');
const Router =      Express.Router();
const Polls =        require('./controllers/polls');

Router.get('/', Polls.index);
Router.get('/createPoll', Polls.createPoll);
Router.get('/answerPoll/:id', Polls.answerPoll);
Router.post('/showResult', Polls.showResult);
Router.post('/voteResult', Polls.voteResult);

module.exports = Router;