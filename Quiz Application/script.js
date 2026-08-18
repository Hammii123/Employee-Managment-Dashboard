let currentQuestion = 0;
let score= 0;
let selectedAnswer = null;

let questions =[];



const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answers");
const progressElement = document.getElementById("progress");
const progressFill = document.getElementById("progrss-fill");

const nextButton = document.getElementById("next");

const quizElement = document.getElementById("quiz");
const resultElement = document.getElementById("result");
const scoreElement = document.getElementById("score");

const restartButton = document.getElementById("restart");

const resultMessageElement = document.getElementById("result-message");
function showQuestion(){
    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    progressElement.textContent =`Question ${currentQuestion +1} of ${questions.length}`;
    const progress = ((currentQuestion + 1)/ questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    answerElement.innerHTML = "";

    question.answer.forEach(answer =>{
            const button = document.createElement("button");
            button.textContent =answer ;

            button.addEventListener("click" , ()=>{
                const buttons  = answerElement.querySelectorAll("button");
                buttons.forEach(button => {
                    button.classList.remove("selected");
                });

                selectedAnswer = answer;
                button.classList.add("selected");

                console.log(selectedAnswer);
            });
            
            answerElement.appendChild(button);

            restartButton.addEventListener("click" , ()=>{
                currentQuestion=0;
                score=0;
                 selectedAnswer = null;

                 quizElement.style.display = "block";
                 resultElement.style.display = "none";
                 
                 showQuestion();
            });
    });

}
fetch("questions.json")
.then(Response  =>  Response.json())
.then(data =>{
    questions =data ;

    showQuestion();
}) ;


nextButton.addEventListener("click" , ()=>{
    if(selectedAnswer === null){
        alert("please select an answer");
        return;
    }
    if(selectedAnswer === questions[currentQuestion].correctAnswer){
        score++;
    }

    if(currentQuestion === questions.length-1){
        showResult();
    }  else  {
        currentQuestion++;
        selectedAnswer = null ;
        showQuestion();
    }
});

function showResult(){

    quizElement.style.display = "none";
    resultElement.style.display = "block";

    const percentage =Math.round((score / questions.length) *100);

    scoreElement.textContent = 
    `your score is ${score} out of ${questions.length} (${percentage}%)`;

     let message;

if (percentage >= 80) {
    message = "Excellent work!";
} else if (percentage >= 60) {
    message = "Good job!";
} else if (percentage >= 40) {
    message = "Not bad, keep practicing!";
} else {
    message = "Keep learning and try again!";
}

        resultMessageElement.textContent = message;
}