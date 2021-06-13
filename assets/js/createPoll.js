document.getElementById('copytext').addEventListener('click', function (e) {
    e.preventDefault();
    let copyText = document.getElementById('url_link').textContent;
    navigator.clipboard.writeText(copyText);
});
document.getElementById('addOption').addEventListener('click', function (e) {
    e.preventDefault();
    let numberOfOptions = document.getElementsByClassName('options');
    let currentNumberOfOptions = numberOfOptions.length + 1;
    document.getElementById('questions').insertAdjacentHTML('beforeend', '<input type="text" name="options[]" placeholder="option ' + currentNumberOfOptions++ + '" class="options">');
    let questions = document.getElementById('questions');
    questions.scrollTop = questions.scrollHeight;
});
document.getElementById('restart').addEventListener('click', function (e) {
    e.preventDefault();
    location.reload();
});
var currentPollID = '';
const socket = io("http://localhost:3000");
socket.emit('newPoll');
socket.on('servePollId', function(pollId){
    currentPollID = pollId;
    const url = 'http://localhost:3000/answerPoll/'+ pollId; 
    document.getElementById('url_link').innerHTML = url;
    document.getElementById('pollId').value = currentPollID;
});
window.onload = event =>{
    document.getElementById('pollForm').addEventListener('keyup', function () {
        let question = document.getElementById('question').value;
        let optionsValues = document.querySelectorAll('input[name="options[]"]');
        let optionArray = [];
        for(let x=0; x<optionsValues.length; x++){
            if(optionsValues[x].value != ''){
                optionArray.push({option: optionsValues[x].value, voteCount: 0});
            }
        }
        socket.emit('updateAnswerPollForm', {pollId: currentPollID, question: question, optionsValues: optionArray});
    });
}