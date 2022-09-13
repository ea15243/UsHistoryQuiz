const titleContainer = document.getElementById("title-container");
const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question")
const answerBtnElements = document.getElementById("answer-btn-container");
const quizControlContainer = document.getElementById("quiz-controlBtn-container");
const timerContainer = document.getElementById("timer-container");
const time = document.getElementById("timer");
const completeContainer = document.getElementById("quiz-complete-container");
const highScoresContainer = document.getElementById("highScores-container");
const highScoreText = document.getElementById("highScore-text");
const menuBar = document.getElementById("menu-bar");
const difficultyToggle = document.getElementById("difficulty");
const audioToggle = document.getElementById("audio");
const printScoreLocation = document.getElementById("quiz-score");
const highScoresList = document.getElementById("highScores-list");
const userInitials = document.getElementById("initials");
const startBtn = document.getElementById("quiz-start-btn");
const restartBtn = document.getElementById("quiz-restart-btn");
const difficultyHard = document.getElementById("settings-difficultyHard-icon");
const difficultyEasy = document.getElementById("settings-difficultyEasy-icon");
const audioOnIcon = document.getElementById("settings-audioOn-icon");
const audioOffIcon = document.getElementById("settings-audioOff-icon");

const audioCorrect = new Audio();
const audioWrong = new Audio();


audioCorrect.src = "./assets/audio/correctSF.wav";
audioCorrect.volume = 0.2;
audioWrong.src = "./assets/audio/wrongSF.wav";
audioWrong.volume = 0.2;


//variables
let shuffledQuestions, currentQuestionIndex, intervalId;
//declares a variable timeLeft and sets its value to the total seconds (minutes * 60 + seconds)
var timeLeft = 90;
var score = 0;

//event listeners
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", restartQuiz);
userInitials.addEventListener("change", () => {
    let inputForInitials = userInitials.value;
    let userObject = {userName: inputForInitials, userScore: score};
    highScoreSave(userObject);
    userInitials.value = ""
    userInitials.classList.add("hide");
    document.getElementById("initials-label").classList.add('hide');
    menuBar.classList.remove("hide");
    highScoreText.classList.remove("hide");
    highScoreText.addEventListener("click", () => {
        while (highScoresList.firstChild) {
            highScoresList.removeChild(highScoresList.firstChild);
        }
        highScoresContainer.classList.remove("hide");
        menuBar.classList.remove("hide");
        highScoreText.innerText = "back to quiz";
        highScoreText.classList.remove("hide");
        getUserStorage();
        clearInterval(intervalId);
        timeLeftDifficultyCheck();
        score = 0;
    });
});
difficultyToggle.addEventListener("change", () => {
    if (difficultyToggle.checked) {
        easyMode();
        difficultyToggle.checked = false
    } else {
        hardMode();
        difficultyToggle.checked = true
    }
})
audioToggle.addEventListener("change", () => {
    if (audioToggle.checked) {
        audioOn();
        audioToggle.checked = false
    } else {
        audioff();
        audioToggle.checked = true
    }
})
highScoreText.addEventListener("click", () => {
    hideAll();
    highScoresContainer.classList.remove("hide");
    menuBar.classList.remove("hide");
    highScoreText.innerText = "return to quiz";
    highScoreText.classList.remove("hide");
    if (difficultyToggle.checked) {
        difficultyHard.classList.remove("hide");
    } else {
        difficultyEasy.classList.remove("hide"); 
    }
    if (audioToggle.checked) {
        audioOffIcon.classList.remove("hide");
    } else {
        audioOnIcon.classList.remove("hide");
    }
    highScoreText.addEventListener("click", () => {
        highScoreText.innerText = "High Scores";
        highScoresContainer.classList.add("hide");
        restartQuiz();
    })
    getUserStorage();
    clearInterval(intervalId);
    timeLeftDifficultyCheck();
    score = 0;
});

function audioOn() {
    audioCorrect.volume = 0.2;
    audioWrong.volume = 0.2;
    audioOnIcon.classList.remove("hide");
    audioOffIcon.classList.add("hide");
}

function audioff() {
    audioCorrect.volume = 0.0;
    audioWrong.volume = 0.0;
    audioOnIcon.classList.add("hide");
    audioOffIcon.classList.remove("hide");
}

function easyMode() {
    questions = questions.slice(0, 10);
    console.log(questions);
    difficultyEasy.classList.remove("hide");
    difficultyHard.classList.add("hide");
    clearInterval(intervalId);
    quizContainer.classList.add("hide");
    restartQuiz();
}

function hardMode() {
    questions = questions.concat(questionsHard);
    console.log(questions);
    difficultyEasy.classList.add("hide");
    difficultyHard.classList.remove("hide");
    clearInterval(intervalId);
    quizContainer.classList.add("hide");
    restartQuiz();
}

function timeLeftDifficultyCheck() {
    if (difficultyToggle.checked) {
        timeLeft = 130;
    } else {
        timeLeft = 90;
    }
}

function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// let menuState = false;
// menuState = !menuState

function hideAll() {
    titleContainer.classList.add("hide");
    quizContainer.classList.add("hide");
    answerBtnElements.classList.add("hide");
    quizControlContainer.classList.add("hide");
    timerContainer.classList.add("hide");
    completeContainer.classList.add("hide");
    highScoresContainer.classList.add("hide");
    highScoreText.classList.add("hide");
    menuBar.classList.add("hide");
    startBtn.classList.add("hide");
    restartBtn.classList.add("hide");
    difficultyHard.classList.add("hide");
    difficultyEasy.classList.add("hide");
    audioOnIcon.classList.add("hide");
    audioOffIcon.classList.add("hide");
    while (highScoresList.firstChild) {
        highScoresList.removeChild(highScoresList.firstChild);
    }
}

function restartQuiz() {
    timeLeftDifficultyCheck();
    score = 0
    titleContainer.classList.remove("hide");
    startBtn.classList.remove("hide");
    menuBar.classList.remove("hide");
    highScoreText.classList.remove("hide");
    highScoreText.addEventListener("click", () => {
        highScoresContainer.classList.remove("hide");
        menuBar.classList.remove("hide");
        highScoreText.innerText = "return to quiz";
        highScoreText.classList.remove("hide");
        if (difficultyToggle.checked) {
            difficultyHard.classList.remove("hide");
        } else {
            difficultyEasy.classList.remove("hide"); 
        }
        if (audioToggle.checked) {
            audioOffIcon.classList.remove("hide");
        } else {
            audioOnIcon.classList.remove("hide");
        }
        highScoreText.addEventListener("click", () => {
            highScoreText.innerText = "High Scores";
            highScoresContainer.classList.add("hide");
            restartQuiz();
        })
        getUserStorage();
        clearInterval(intervalId);
        timeLeftDifficultyCheck();
        score = 0;
    });
}

function startQuiz() { 
        //executes the resetAnswerBtns function (to clear any btns before loading the next question)
    resetAnswerBtns();

    renderTimeLeft(timeLeft);
        //executes the startTimer function with the parameters time (element), 2 (minutes), 15 (seconds).
    timerInterval();
        //adds the class of hide to the title container
    menuBar.classList.add("hide");
    highScoreText.classList.add("hide");
    titleContainer.classList.add("hide");
        //removes the class of hide from the question container
    quizContainer.classList.remove('hide');
    answerBtnElements.classList.remove("hide");
        //adds the class of hide to the startBtn
    startBtn.classList.add("hide");
        //neat way to shuffle. since math random returns a value of 0-1 and sort will sort differently based on + and - integers, when we subtract .5 from Math.random approx half of the returned values will be - and half +, sort will shuffle accordingly.
    shuffledQuestions = questions.sort(() => Math.random() - .5);
        //sets the currentQuestionIndex to 0 (it will later increment from nextQuestion())
    currentQuestionIndex = 0;
        //executes the nextQuestion function to load the next question automatically
    nextQuestion();
    userInitials.classList.remove("hide");
    document.getElementById("initials-label").classList.remove('hide');
}

function resetAnswerBtns() {
    while (answerBtnElements.firstChild) {
        answerBtnElements.removeChild(answerBtnElements.firstChild);
    }
}

function renderTimeLeft(timeRemaining) {
    var minutes = Math.floor(timeRemaining / 60);
    if (minutes < 10) 
        minutes = "0" + minutes;
    var seconds = timeRemaining % 60;
    if (seconds < 10)
        seconds = "0" + seconds;
    var text = `${minutes}:${seconds}`;
    time.innerHTML = text;
    return text;
}

let timerInterval = () => {
    timerContainer.classList.remove("hide");
    intervalId = setInterval(() => {
        if (timeLeft <= 0) {
            return stopTimer();
        }
        timeLeft--;
        renderTimeLeft(timeLeft);
    }, 1000);
}

function stopTimer() {
    time.innerHTML = "time is up"
    clearInterval(intervalId);
    quizContainer.classList.add("hide");
    completeContainer.classList.remove("hide");
    setTimeout(function() {
        timerContainer.classList.add("hide");          
    }, 3500);
}

function endQuiz() {
    setTimeout(function() {
        hideAll();
        restartBtn.classList.remove("hide");
        timerContainer.classList.remove("hide");
        if (difficultyToggle.checked) {
            difficultyHard.classList.remove("hide");
        } else {
            difficultyEasy.classList.remove("hide"); 
        }
        if (audioToggle.checked) {
            audioOffIcon.classList.remove("hide");
        } else {
            audioOnIcon.classList.remove("hide");
        }
        completeContainer.classList.remove("hide");
        menuBar.classList.remove("hide");
        highScoreText.classList.remove("hide");
        quizEndScoreUpdate(timeLeft);
        time.innerHTML = renderTimeLeft(timeLeft);
        clearInterval(intervalId);
        restartBtn.classList.remove("hide");
    }, 650);
}

function quizEndScoreUpdate(timeRemaining) {
    if (timeRemaining > 0) {
        var addedPoints10secs = Math.floor(timeRemaining / 10);
        var addedPointsUnder10sec = timeRemaining % 10;
        addedPoints10secs = addedPoints10secs * 15;
        addedPointsUnder10sec = addedPointsUnder10sec * 1;
        score += addedPoints10secs + addedPointsUnder10sec;
    } else {
        score -= 20
    }

    console.log(`current score is... ${score}`);
    printScoreLocation.innerText = score;
}

function highScoreSave(userObject) {
    localStorage.setItem(`user${generateUserId()}`, JSON.stringify(userObject));
    getUserStorage()
}


function getUserStorage() {
    let storage = Object.keys(localStorage).map(user => {
        let retrievedUser = localStorage.getItem(user);
        return JSON.parse(retrievedUser)
    });
    
    storage.sort((a, b) => b.userScore - a.userScore).slice(0, 5).forEach((userObject) => {
        var userContainer = document.createElement('div');
        userContainer.classList.add("user__container");
        var usersName = document.createElement('h5');
        usersName.innerText = userObject.userName;
        var usersScore = document.createElement('p');
        usersScore.innerText = userObject.userScore;
        if (!highScoresList.firstChild) {
            usersName.classList.add("highest__score");
            usersScore.classList.add("highest__score");
        }

        userContainer.appendChild(usersName);
        userContainer.appendChild(usersScore);

        highScoresList.appendChild(userContainer);
    });
}

function nextQuestion() {
   //executes the displayQuestion function for the shuffledQuestions at the index position of the currentQuestionIndex
    displayQuestion(shuffledQuestions[currentQuestionIndex]);
}

function displayQuestion(question) {
    //sets the inner text for the question to the value of question in the questions object at the currentQuestionIndex
    questionElement.innerText = question.question;
    resetAnswerBtns();
    var shuffledAnswers = question.answers.sort(() => Math.random() - .5)
    //recreates the answerBtns for each answer in the questions object at the currentQuestionIndex
    shuffledAnswers.forEach(answer => {
            //creates the btn elements
        const btn = document.createElement("button");
            //adds the answer.text, from the questions object, to the btns
        btn.innerText = answer.text;
            //styles the answerBtns by adding the class="answer-btn"
        btn.classList.add("answer-btn");
            //adds an eventListener on the new buttons that will execute the selectedAnswer function.
        btn.addEventListener("click", (e) => selectedAnswer(e));
            //appends the btns to the answer btn container.
        answerBtnElements.appendChild(btn);
    });
}

function onlyOnePlease() {
    document.querySelectorAll('button.answer-btn').forEach(elem => {
        elem.disabled = true;
    });
}
    
function selectedAnswer(e) {
    onlyOnePlease();
    let selectedAnswerBtn = e.target;
    shuffledQuestions[currentQuestionIndex].answers.forEach(answer => {
        if (selectedAnswerBtn.innerText === answer.text) {
            if (answer.correct) {
                selectedAnswerBtn.classList.add("correct");
                score += 5;
                audioCorrect.play();
            } else {
                timeLeft = timeLeft - 10
                if (timeLeft < 0) {
                    timeLeft = 0;
                }
                selectedAnswerBtn.classList.add("wrong");
                score -= 5;
                audioWrong.play();
            }
        }
    });
    currentQuestionIndex++;
    if (shuffledQuestions.length < currentQuestionIndex + 1) {
        setTimeout(function() {
        endQuiz();
        })
    } else {
        setTimeout(function() {
        nextQuestion();
    }, 650);}
    
}

let questions = [
    {
        question: "What is the name of the U.S. National Anthem?",
        answers: [
            {text: "The Star Spangled Banner", correct: true},
            {text: "America the Beautiful", correct: false},
            {text: "My Country Tis of Thee", correct: false},
            {text: "God Bless The Queen", correct: false},
        ]
    },
    {
        question: "What was the main concern of the United States during the Cold War?",
        answers: [
            {text: "Communism", correct: true},
            {text: "Slavery", correct: false},
            {text: "Great Depression", correct: false},
            {text: "Climate Change", correct: false}
        ]
    },
    {
        question: "What was One of the Thirteen Colonies?",
        answers: [
            {text: "Ohio", correct: false},
            {text: "California", correct: false},
            {text: "Georgia", correct: true},
            {text: "Hawaii", correct: false}
        ]
    },
    {
        question: "What did Martin Luther King, Jr. do?'",
        answers: [
            {text: "Ran for the president of the United States", correct: false},
            {text: "Fought for women's suffrage", correct: false},
            {text: "Became a U.S. Senator", correct: false},
            {text: "Fought for civil rights", correct: true}
        ]
    },
    {
        question: "Why did the United States enter the Korean War?",
        answers: [
            {text: "It was rich in resources", correct: false},
            {text: "Stop the spread of communism", correct: true},
            {text: "Stop the spread of fascism", correct: false},
            {text: "Fight the Japanese", correct: false}
        ]
    },
    {
        question: "Why did the United States enter the Persian Gulf War?",
        answers: [
            {text: "Stop the spread of communism", correct: false},
            {text: "Stop the spread of Iran's influence", correct: false},
            {text: "To force the Iraqi military from Kuwait", correct: true},
            {text: "for its resources", correct: false}
        ]
    },
    {
        question: "What was one important thing that Abraham Lincoln did?",
        answers: [
            {text: "Declared war on Great Britain", correct: false},
            {text: "Established the United Nations", correct: false},
            {text: "Purchased Alaska", correct: false},
            {text: "Saved (or preserved) the Union", correct: true}
        ]
    },
    {
        question: "What are three rights of everyone living in the United States?",
        answers: [
            {text: "Freedom to petition the government, freedom of expression and freedom to disobey traffic laws", correct: false},
            {text: "Freedom of speech, freedom of expression and freedom to run for president", correct: false},
            {text: "Freedom of religion, freedom of expression and freedom to make treaties with other countries", correct: false},
            {text: "Freedom of speech, freedom of religion and freedom of expression", correct: true}
        ]
    },
    {
        question: "Who was the first President of USA?",
        answers: [
            {text: "Donald Trump", correct: false},
            {text: "Barack Obama", correct: false},
            {text: "Abraham Lincoln", correct: false},
            {text: "George Washington", correct: true}
        ]
    },
    {
        question: "What is the responsibility that is only for U.S. Citizens?",
        answers: [
            {text: "Serve on a jury", correct: true},
            {text: "Obey the law", correct: false},
            {text: "Be respectful of others", correct: false},
            {text: "Pay taxes", correct: false}
        ]
    },
]
let questionsHard = [
    {
        question: "What territory did the U.S. Buy from France in 1803? ",
        answers: [
            {text: "Minnesota", correct: false},
            {text: "Alabama", correct: false},
            {text: "Louisiana", correct: true},
            {text: "Colorado", correct: false},
        ]
    },
    {
        question: "The Civil War had many important events. Name one.?",
        answers: [
            {text: "14th Ammendment", correct: false},
            {text: "Lincoln assassination", correct: false},
            {text: "War of 1812", correct: false},
            {text: "Emancipation Proclamation", correct: true}
        ]
    },
    {
        question: "Name the U.S. War between the North and the South.",
        answers: [
            {text: "The war of 1812", correct: false},
            {text: "The Civil War", correct: true},
            {text: "World War II", correct: false},
            {text: "Ukraine War", correct: false}
        ]
    },
    {
        question: "What U.S. war ended slavery?",
        answers: [
            {text: "The Civil War", correct: true},
            {text: "The Revolutionary War", correct: false},
            {text: "War of 1812", correct: false},
            {text: "World War III", correct: false}
        ]
    },
    {
        question: "What is Veterans Day?",
        answers: [
            {text: "A holiday to honor soldiers who died in military service", correct: true},
            {text: "A holiday to honor the people who died fighting for civil rights", correct: false},
            {text: "A holiday that recognizes everyone who served in the Armed Forces", correct: true},
            {text: "A holiday to honor the victims of 9/11", correct: false}
        ]
    },
    {
        question: "Name two national U.S. holidays.",
        answers: [
            {text: "Valentine's Day and President's Day", correct: false},
            {text: "April Fool's Day and Labor Day", correct: false},
            {text: "Labor Day and Thanksgiving", correct: true},
            {text: "Citizenship Day and Columbus Day", correct: false}
        ]
    },
    {
        question: "What movement tried to end racial discrimination?",
        answers: [
            {text: "Civil rights movement", correct: true},
            {text: "Women's suffrage", correct: false},
            {text: "Prohibition", correct: false},
            {text: "Conservation", correct: false}
        ]
    },
    {
        question: "Who was the United States’ main rival during the Cold War?",
        answers: [
            {text: "Austrailia", correct: false},
            {text: "Great Brittain", correct: false},
            {text: "China", correct: false},
            {text: "The Soviet Union", correct: true}
        ]
    },
    {
        question: "When did the Great Depression Start?",
        answers: [
            {text: "2020", correct: false},
            {text: "1929", correct: true},
            {text: "2014", correct: false},
            {text: "1914", correct: false}
        ]
    },
    {
        question: "Name one example of an American innovation",
        answers: [
            {text: "Skyscrapers", correct: false},
            {text: "Light bulb", correct: true},
            {text: "Assembly line", correct: false},
            {text: "All of the above", correct: false}
        ]
    },
]