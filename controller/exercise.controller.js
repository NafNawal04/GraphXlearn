let correctAnswer = "";
let stepByStepSolution = [];

async function loadExercise() {
    
    const exerciseContainer = document.querySelector(".exercise-container");
    const exerciseId = exerciseContainer.getAttribute("data-exercise-id");
    const apiUrl = `/api/exercise/${exerciseId}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

       
        document.getElementById("exercise-title").textContent = data.title;
        document.getElementById("exercise-question").textContent = data.question;
        correctAnswer = parseInt(data.correctAnswer, 10); 
        stepByStepSolution = data.stepByStepSolution;


        const exerciseImage = document.getElementById("exercise-image");
        exerciseImage.src = `data:image/png;base64,${data.imageBase64}`;
        exerciseImage.style.display = "block"; 
    } catch (error) {
        console.error("Error loading exercise:", error);
        document.getElementById("exercise-title").textContent = "Error loading exercise.";
    }
}


function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("userAnswer").value.trim(), 10);
    const solutionMessage = document.getElementById("solutionMessage");

    solutionMessage.innerHTML = ""; 

    if (isNaN(userAnswer)) {
        solutionMessage.textContent = "Please enter a valid answer.";
        solutionMessage.style.color = "red";
        solutionMessage.style.textShadow = "2px 2px 5px rgba(252, 252, 252, 0.2)";
    } else if (userAnswer === correctAnswer) {
        solutionMessage.textContent = "Correct!";
        solutionMessage.style.color = "green";
        solutionMessage.style.textShadow = "2px 2px 5px rgba(252, 252, 252, 0.2)"; 
    } else {
        solutionMessage.style.color = "red"; 
        solutionMessage.style.textShadow = "2px 2px 5px rgba(252, 252, 252, 0.2)";
        solutionMessage.innerHTML = "<p>Incorrect. Here is the step-by-step solution:</p>";

        
        stepByStepSolution.forEach(step => {
            const stepElement = document.createElement("p");
            stepElement.textContent = step;
            stepElement.style.color = "white"; 
            solutionMessage.appendChild(stepElement);
        });
    }
}

document.addEventListener("DOMContentLoaded", loadExercise);
