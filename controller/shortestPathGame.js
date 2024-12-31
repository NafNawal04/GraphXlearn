const graphs = [
    {
        graph: {
            0: { 1: 4, 2: 1 },
            1: { 2: 2, 3: 1 },
            2: { 3: 5 },
            3: {}
        },
        start: 0,
        end: 3,
        question: "Find the shortest path from 0 to 3. Calculate the shortest distance and submit your answer below."
    },
    {
        graph: {
            0: { 1: 2, 3: 4 },
            1: { 2: 3, 3: 2 },
            2: { 3: 1 },
            3: {}
        },
        start: 0,
        end: 3,
        question: "Find the shortest path from 0 to 3. Calculate the shortest distance and submit your answer below."
    },
    {
        graph: {
            0: { 1: 1, 2: 4 },
            1: { 2: 2, 3: 6 },
            2: { 3: 3 },
            3: {}
        },
        start: 0,
        end: 3,
        question: "Find the shortest path from 0 to 3. Calculate the shortest distance and submit your answer below."
    }
];

let graph = {};
let startNode = 0;
let endNode = 0;
let timeLeft = 60;

// Load a random graph and question
function loadRandomGraph() {
    const randomIndex = Math.floor(Math.random() * graphs.length);
    const selectedGraph = graphs[randomIndex];

    graph = selectedGraph.graph;
    startNode = selectedGraph.start;
    endNode = selectedGraph.end;

    const instructionElement = document.getElementById("instructions");
    instructionElement.textContent = selectedGraph.question.replace(
        "from 0 to 3",
        `from ${startNode} to ${endNode}`
    );

    drawGraph();
}

// Draw the graph on the canvas
function drawGraph() {
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positions = {
        0: { x: 100, y: 200 },
        1: { x: 300, y: 100 },
        2: { x: 300, y: 300 },
        3: { x: 500, y: 200 }
    };

    for (const node in graph) {
        for (const neighbor in graph[node]) {
            const weight = graph[node][neighbor];
            ctx.beginPath();
            ctx.moveTo(positions[node].x, positions[node].y);
            ctx.lineTo(positions[neighbor].x, positions[neighbor].y);
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.closePath();

            // Draw edge weight
            const midX = (positions[node].x + positions[neighbor].x) / 2;
            const midY = (positions[node].y + positions[neighbor].y) / 2;
            ctx.fillStyle = "black";
            ctx.fillText(weight, midX, midY);
        }
    }

    for (const node in positions) {
        ctx.beginPath();
        ctx.arc(positions[node].x, positions[node].y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "black";
        ctx.fillText(node, positions[node].x - 5, positions[node].y + 5);
    }
}

// Handle the countdown timer
function startTimer() {
    const timerElement = document.getElementById("timer");
    const interval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            alert("Time's up! Try again.");
            loadRandomGraph();
            timeLeft = 60;
            startTimer();
        }
    }, 1000);
}

// Submit the answer and provide feedback
function submitAnswer() {
    const userAnswer = parseInt(document.getElementById("userAnswer").value.trim(), 10);
    const feedbackElement = document.getElementById("feedback");

    const correctAnswer = calculateShortestPath(graph, startNode, endNode);

    if (isNaN(userAnswer)) {
        feedbackElement.textContent = "Please enter a valid number.";
        feedbackElement.style.color = "red";
    } else if (userAnswer === correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
        feedbackElement.style.color = "red";
    }
}

// Calculate the shortest path using Dijkstra's Algorithm
function calculateShortestPath(graph, start, end) {
    const distances = {};
    const visited = new Set();

    for (const node in graph) {
        distances[node] = Infinity;
    }
    distances[start] = 0;

    while (visited.size !== Object.keys(graph).length) {
        let currentNode = null;

        for (const node in distances) {
            if (!visited.has(node)) {
                if (currentNode === null || distances[node] < distances[currentNode]) {
                    currentNode = node;
                }
            }
        }

        visited.add(currentNode);

        for (const neighbor in graph[currentNode]) {
            const newDistance = distances[currentNode] + graph[currentNode][neighbor];
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
            }
        }
    }

    return distances[end];
}

// Initialize the game
window.onload = () => {
    loadRandomGraph();
    startTimer();
};
