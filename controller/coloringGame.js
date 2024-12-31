const graphs = [
    {
        nodes: [0, 1, 2, 3],
        edges: [[0, 1], [1, 2], [2, 3], [3, 0]],
    },
    {
        nodes: [0, 1, 2, 3, 4],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
    },
    {
        nodes: [0, 1, 2, 3, 4],
        edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]],
    },
];

let selectedColor = null;
let nodeColors = {};

function loadRandomGraph() {
    const randomIndex = Math.floor(Math.random() * graphs.length);
    const selectedGraph = graphs[randomIndex];

    drawGraph(selectedGraph.nodes, selectedGraph.edges);
    initializeNodeColors(selectedGraph.nodes);
}

function drawGraph(nodes, edges) {
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positions = {
        0: { x: 100, y: 200 },
        1: { x: 300, y: 100 },
        2: { x: 300, y: 300 },
        3: { x: 500, y: 200 },
        4: { x: 700, y: 200 },
    };

    edges.forEach(([from, to]) => {
        ctx.beginPath();
        ctx.moveTo(positions[from].x, positions[from].y);
        ctx.lineTo(positions[to].x, positions[to].y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    });

    nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(positions[node].x, positions[node].y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = nodeColors[node] || "yellow";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "black";
        ctx.fillText(node, positions[node].x - 5, positions[node].y + 5);
    });
}

function initializeNodeColors(nodes) {
    nodes.forEach((node) => {
        nodeColors[node] = null;
    });
}

function selectColor(color) {
    selectedColor = color;
    document.getElementById("selected-color").textContent = `Selected Color: ${color}`;
}

function submitColoring() {
    const feedbackElement = document.getElementById("feedback");
    const isValid = validateColoring();

    if (isValid) {
        feedbackElement.textContent = "Correct! You colored the graph properly.";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = "Incorrect. Some nodes share the same color!";
        feedbackElement.style.color = "red";
    }
}

function validateColoring() {
    return graphs[0].edges.every(([from, to]) => nodeColors[from] !== nodeColors[to]);
}

document.getElementById("graphCanvas").addEventListener("click", (event) => {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const positions = {
        0: { x: 100, y: 200 },
        1: { x: 300, y: 100 },
        2: { x: 300, y: 300 },
        3: { x: 500, y: 200 },
        4: { x: 700, y: 200 },
    };

    Object.keys(positions).forEach((node) => {
        const { x: nx, y: ny } = positions[node];
        const distance = Math.sqrt((x - nx) ** 2 + (y - ny) ** 2);

        if (distance <= 20) {
            nodeColors[node] = selectedColor;
            drawGraph(Object.keys(positions).map(Number), graphs[0].edges);
        }
    });
});

window.onload = () => {
    loadRandomGraph();
};
