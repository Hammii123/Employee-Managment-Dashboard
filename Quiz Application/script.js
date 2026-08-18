let currentQuestion = 0;
let score= 0;
let selectedAnswer = null;

let questions =[];



const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answer");
const progressElement = document.getElementById("progress");

const nextButton = document.getElementById("next");

const quizElement = document.getElementById("quiz");
const resultElement = document.getElementById("result");
const scoreElement = document.getElementById("score");

const restartBUtton = document.getElementById("restart");

function showQuestion(){
    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    progressElement.textContent =`Question ${currentQuestion +1} of ${questions.length}`;
    answerElement.innerHTML = "";

    question.answer.forEach(answer =>{
            const button = document.createElement("button");
            button.textContent =answer ;
            
            answerElement.appendChild(button);
    });

}
fetch("questions.json")
.then(Response  =>  Response.json())
.then(data =>{
    questions =data ;

    showQuestion();
}) ;
