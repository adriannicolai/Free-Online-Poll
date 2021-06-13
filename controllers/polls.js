class Polls{
    index(req, res){
        res.render('index');
    }
    createPoll(req, res){
        res.render('createPoll');
    }
    answerPoll(req, res){
        let id = req.params.id;
        res.render('answerPoll', {id: id});
    }
    showResult(req, res){
        res.render('result', {formData: req.body});
    }
    voteResult(req, res){
        res.render('userResult', {formData: req.body});
    }
}
module.exports = new Polls;