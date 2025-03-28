const nodes = [];
const edges = [];
let mode = 'node';
let selectedNode = null;

const svg = d3.select('#canvasGrid').append('svg')
  .attr('width', '100%')
  .attr('height', '100%');

const defs = svg.append('defs');
defs.append('marker')
  .attr('id', 'arrowhead')
  .attr('viewBox', '0 0 10 10')
  .attr('refX', 15)
  .attr('refY', 5)
  .attr('markerWidth', 8)
  .attr('markerHeight', 8)
  .attr('orient', 'auto')
  .append('path')
  .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
  .attr('fill', '#ffffff');

function addNode() {
  const id = `${nodes.length + 1}`;
  const x = Math.random() * 500 + 50;
  const y = Math.random() * 400 + 50;
  nodes.push({ id, x, y });
  updateGraph();
}

function setMode(modeType) {
  mode = modeType;
  selectedNode = null;
}

function updateGraph() {
  svg.selectAll('line').remove();
  svg.selectAll('circle').remove();
  svg.selectAll('text').remove();


  svg.selectAll('line.undirected')
    .data(edges.filter(e => !e.directed))
    .enter().append('line')
    .attr('class', 'undirected')
    .attr('x1', d => nodes.find(n => n.id === d.source).x)
    .attr('y1', d => nodes.find(n => n.id === d.source).y)
    .attr('x2', d => nodes.find(n => n.id === d.target).x)
    .attr('y2', d => nodes.find(n => n.id === d.target).y)
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 2)
    .on('click', handleEdgeClick);


  svg.selectAll('line.directed')
    .data(edges.filter(d => d.directed))
    .enter().append('line')
    .attr('class', 'directed')
    .attr('x1', d => nodes.find(n => n.id === d.source).x)
    .attr('y1', d => nodes.find(n => n.id === d.source).y)
    .attr('x2', d => nodes.find(n => n.id === d.target).x)
    .attr('y2', d => nodes.find(n => n.id === d.target).y)
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)')
    .on('click', handleEdgeClick);

  svg.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 20)
    .attr('fill', '#ffc107')
    .on('click', handleNodeClick)
    .call(d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded));

  svg.selectAll('text')
    .data(nodes)
    .enter().append('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('dy', 5).attr('dx', -10)
    .text(d => d.id).attr('fill', 'black');

  addEdgeWeights();
}

function addEdgeWeights() {
  svg.selectAll('.weight').remove();
  svg.selectAll('.weight')
    .data(edges)
    .enter().append('text')
    .attr('class', 'weight')
    .attr('x', d => (nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)
    .attr('y', d => (nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2)
    .attr('dy', -5)
    .attr('fill', '#ffc107')
    .text(d => d.weight);
}

function handleEdgeClick(event, d) {
  if (mode === 'removeEdge') {

    const index = edges.findIndex(edge => edge.source === d.source && edge.target === d.target && edge.directed === d.directed);
    if (index > -1) {
      edges.splice(index, 1);
    }
    updateGraph();
  } else if (mode === 'edge' || mode === 'directedEdge') {
    updateEdgeWeight(d);
  }
}

function updateEdgeWeight(edge) {
  const newWeight = prompt("Enter the new weight for this edge:", edge.weight);
  if (newWeight !== null) {
    edge.weight = parseInt(newWeight, 10) || edge.weight;
    updateGraph();
  }
}

function generateGraphFromCSV() {
  const fileInput = document.getElementById('csvFileInput');
  const file = fileInput.files[0];
  if (!file) return alert("Please upload a CSV file.");

  Papa.parse(file, {
    header: true,
    complete: (results) => {
      const data = results.data.filter(row => row.NodeID && row.Target);
      nodes.length = 0;
      edges.length = 0;

      data.forEach(row => {
        const { NodeID, Target, Weight, Directed } = row;

        if (!nodes.find(n => n.id === NodeID)) {
          nodes.push({ id: NodeID, x: Math.random() * 500 + 50, y: Math.random() * 400 + 50 });
        }
        if (!nodes.find(n => n.id === Target)) {
          nodes.push({ id: Target, x: Math.random() * 500 + 50, y: Math.random() * 400 + 50 });
        }

        edges.push({
          source: NodeID,
          target: Target,
          weight: parseInt(Weight) || 0,
          directed: Directed === 'true'
        });
      });

      updateGraph();
    },
    error: (error) => console.error("Error parsing CSV file:", error),
  });
}

function handleNodeClick(event, d) {
  if (mode === 'edge' || mode === 'directedEdge') {
    if (selectedNode === null) {
      selectedNode = d;
      d3.select(this).attr('fill', 'green');
    } else {
      if (mode === 'edge') {
        edges.push({ source: selectedNode.id, target: d.id, weight: 0, directed: false });
      } else if (mode === 'directedEdge') {
        edges.push({ source: selectedNode.id, target: d.id, weight: 0, directed: true });
      }
      updateGraph();
      selectedNode = null;
      svg.selectAll('circle').attr('fill', '#007bff');
    }
  }
}

function dragStarted(event, d) {
  d3.select(this).raise().attr('stroke', 'black');
}

function dragged(event, d) {
  d3.select(this).attr('cx', d.x = event.x).attr('cy', d.y = event.y);
  updateGraph();
}

function dragEnded(event, d) {
  d3.select(this).attr('stroke', null);
}

function downloadAsJPG() {
  const canvasContainer = document.getElementById('canvasGrid');

  html2canvas(canvasContainer).then((canvas) => {
    const dataURL = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'graph-visualization.jpg';
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.error('Error capturing the canvas:', error);
  });
}


class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(item, priority) {
    this.queue.push({ item, priority });
    this.queue.sort((a, b) => a.priority - b.priority); // Sort by priority
  }

  dequeue() {
    return this.queue.shift().item;
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

async function applyDijkstra() {
  const startNodeId = prompt("Enter the starting node for Dijkstra's algorithm:");

  const startNode = nodes.find(n => n.id === startNodeId);
  if (!startNode) {
    alert("Starting node not found.");
    return;
  }

  const distances = {};
  const previous = {};
  const visited = new Set();
  const pq = new PriorityQueue();

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[startNode.id] = 0;

  pq.enqueue(startNode.id, 0);

  while (!pq.isEmpty()) {
    const currentNodeId = pq.dequeue();

    if (visited.has(currentNodeId)) continue;
    visited.add(currentNodeId);


    highlightNode(currentNodeId, '#ff7207');
    await delay(1500);


    const neighbors = edges.filter(edge => edge.source === currentNodeId);
    for (const edge of neighbors) {
      const newDist = distances[currentNodeId] + edge.weight;

      if (newDist < distances[edge.target]) {
        distances[edge.target] = newDist;
        previous[edge.target] = currentNodeId;
        pq.enqueue(edge.target, newDist);


        highlightEdge(edge, '#ff7207');
        showShortestDistances(distances);
        await delay(1500);
      }
    }
  }
  showShortestDistances(distances);

  visualizeShortestPaths(previous, startNodeId, distances);

}

function highlightNode(nodeId, color) {
  svg.selectAll('circle')
    .filter(d => d.id === nodeId)
    .attr('fill', color);
}

function highlightEdge(edge, color) {
  svg.selectAll('line')
    .filter(d => d.source === edge.source && d.target === edge.target)
    .attr('stroke', color)
    .attr('stroke-width', 3);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



function showShortestDistances(distances) {
  svg.selectAll('.distance-label').remove();

  svg.selectAll('.distance-label')
    .data(nodes)
    .enter()
    .append('text')
    .attr('class', 'distance-label')
    .attr('x', d => d.x)
    .attr('y', d => d.y - 35)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('font-size', '16px')
    .text(d => distances[d.id] === Infinity ? '∞' : distances[d.id]);

  const resultsBox = document.getElementById('resultsBox');
  resultsBox.innerHTML = '';

  nodes.forEach(node => {
    const distance = distances[node.id] === Infinity ? '∞' : distances[node.id];
    resultsBox.innerHTML += `Node ${node.id}: ${distance}\n`;
  });
}



function visualizeShortestPaths(previous, startNodeId, distances) {
  const resultsBox = document.getElementById('resultsBox');
  resultsBox.innerHTML = '';
  resultsBox.innerHTML = `<strong>Shortest Paths:</strong><br/>`;

  nodes.forEach(node => {
    const targetNodeId = node.id;
    let path = [];
    let currentNodeId = targetNodeId;


    while (currentNodeId && currentNodeId !== startNodeId) {
      path.push(currentNodeId);
      currentNodeId = previous[currentNodeId];
    }

    if (currentNodeId === startNodeId) {
      path.push(startNodeId);
      path.reverse();


      const totalDistance = distances[targetNodeId] === Infinity ? '∞' : distances[targetNodeId];
      const formattedPath = path.join(' -> ');
      resultsBox.innerHTML += `<li>Node ${targetNodeId}: ${formattedPath} (total distance = ${totalDistance})</li>`;
    }
  });
}



function animateShortestPath(path) {
  path.forEach((nodeId, index) => {
    setTimeout(() => {
      svg.selectAll('circle').filter(d => d.id === nodeId).attr('fill', 'purple');
    }, index * 1000);
  });
}




async function applyBellmanFord() {
  const startNodeId = prompt("Enter the starting node for Bellman-Ford algorithm:");
  const startNode = nodes.find(n => n.id === startNodeId);

  if (!startNode) {
    alert("Starting node not found.");
    return;
  }

  const distances = {};
  const previous = {};
  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[startNode.id] = 0;

  console.log("Initial distances:", distances);


  for (let i = 1; i < nodes.length; i++) {
    console.log(`\nIteration ${i}:`);
    for (const { source, target, weight } of edges) {
      console.log(`Processing edge ${source} -> ${target} with weight ${weight}`);

      await highlightEdge({ source, target }, 'orange');
      await highlightNode(source, 'blue');
      await highlightNode(target, 'green');

      if (distances[source] + weight < distances[target]) {
        distances[target] = distances[source] + weight;
        previous[target] = source;
        console.log(`Updated distance of ${target} to ${distances[target]}`);
        showShortestDistances(distances);
        await delay(1500);
      }

    }
  }

  for (const { source, target, weight } of edges) {
    if (distances[source] + weight < distances[target]) {
      alert("Graph contains a negative weight cycle!");
      console.log("Negative cycle detected!");
      return;
    }
  }

  console.log("Final distances:", distances);
  showShortestDistances(distances);

  highlightFinalPaths(previous, startNodeId);

  visualizeShortestPaths(previous, startNodeId, distances);
}


function highlightFinalPaths(previous, startNodeId) {
  const edgesToHighlight = [];


  nodes.forEach(node => {
    let currentNode = node.id;

    while (previous[currentNode] !== null) {
      edgesToHighlight.push({
        source: previous[currentNode],
        target: currentNode
      });
      currentNode = previous[currentNode];
    }
  });

  svg.selectAll('line')
    .attr('stroke', d => {
      return edgesToHighlight.some(e => e.source === d.source && e.target === d.target)
        ? 'orange'
        : '#007bff';

    })
    .attr('stroke-width', d => {
      return edgesToHighlight.some(e => e.source === d.source && e.target === d.target)
        ? 3
        : 2;
    });
}




async function applyBFS() {
  const startNodeId = prompt("Enter the starting node for BFS:");
  const startNode = nodes.find(n => n.id === startNodeId);

  if (!startNode) {
    alert("Starting node not found.");
    return;
  }

  const queue = [startNode.id];
  const visited = new Set();
  const traversalOrder = [];


  initializeBFSVisualization();

  while (queue.length > 0) {
    const currentNodeId = queue.shift();

    if (visited.has(currentNodeId)) continue;
    visited.add(currentNodeId);
    traversalOrder.push(currentNodeId);


    highlightNode(currentNodeId, 'orange');
    updateBFSVisualization(visited, queue, currentNodeId);
    await delay(1500);


    const neighbors = edges.filter(edge => edge.source === currentNodeId);
    for (const edge of neighbors) {
      const targetNodeId = edge.target;

      if (!visited.has(targetNodeId) && !queue.includes(targetNodeId)) {
        queue.push(targetNodeId);
        highlightEdge(edge, 'orange');
        highlightNode(targetNodeId, 'green');
        updateBFSVisualization(visited, queue);
        await delay(1500);
      }
    }

    // resetHighlights(); // Reset highlights for clarity
  }


  finalizeBFSVisualization(traversalOrder);

}

function initializeBFSVisualization() {
  const resultsBox = document.getElementById('resultsBox');
  resultsBox.innerHTML = `
<strong>BFS Visualization:</strong><br/>
<div><strong>Visited:</strong></div>
<div id="visitedBox" class="bfs-row"></div>
<div><strong>Queue:</strong></div>
<div id="queueBox" class="bfs-row"></div>
`;
}

function updateBFSVisualization(visited, queue, currentNodeId = null) {
  const visitedBox = document.getElementById('visitedBox');
  const queueBox = document.getElementById('queueBox');


  visitedBox.innerHTML = '';
  Array.from(visited).forEach(nodeId => {
    visitedBox.innerHTML += `<div class="bfs-cell">${nodeId}</div>`;
  });


  queueBox.innerHTML = '';
  queue.forEach(nodeId => {
    queueBox.innerHTML += `<div class="bfs-cell ${nodeId === currentNodeId ? 'current' : ''}">${nodeId}</div>`;
  });
}

function finalizeBFSVisualization(traversalOrder) {
  const resultsBox = document.getElementById('resultsBox');
  resultsBox.innerHTML = `<strong>BFS Traversal Order:</strong><br/>`;
  resultsBox.innerHTML += traversalOrder.join(' -> ');
}


function resetHighlights() {
  svg.selectAll('circle').attr('fill', '#ffa500');
  svg.selectAll('line').attr('stroke', '#007bff').attr('stroke-width', 2);
}



function finalizeDFSVisualization(traversalOrder) {
  const resultsBox = document.getElementById('resultsBox');
  resultsBox.innerHTML += `<strong><br/>DFS Traversal Order:</strong><br/>`;
  resultsBox.innerHTML += traversalOrder.join(' -> ');

  setTimeout(() => {
    svg.selectAll('circle').attr('fill', '#ffc107');
    svg.selectAll('line').attr('stroke', '#ffffff').attr('stroke-width', 2);
  }, 2000);
}


async function applyDFS() {
  const startNodeId = prompt("Enter the starting node for DFS:");
  if (!startNodeId) return;

  const startNode = nodes.find(n => n.id === startNodeId.trim());
  if (!startNode) {
    alert("Starting node not found.");
    return;
  }

  const visited = new Set();
  const stack = [];
  const traversalOrder = [];

  initializeDFSVisualization();

  stack.push(startNode.id);
  updateDFSVisualization(visited, stack);

  while (stack.length > 0) {
    const currentNodeId = stack.pop();
    updateStackVisualization(stack);

    if (!visited.has(currentNodeId)) {
      visited.add(currentNodeId);
      traversalOrder.push(currentNodeId);

      highlightNode(currentNodeId, 'purple');
      await delay(1500);

      const neighbors = getNeighbors(currentNodeId);


      for (const neighborId of neighbors) {
        if (!visited.has(neighborId) && !stack.includes(neighborId)) {
          stack.push(neighborId);
          highlightEdge({ source: currentNodeId, target: neighborId }, 'purple');
          updateStackVisualization(stack);
          await delay(1500);
        }
      }

      updateDFSVisualization(visited, stack);
    }
  }

  finalizeDFSVisualization(traversalOrder);
}
function getNeighbors(nodeId) {
  return edges.reduce((acc, edge) => {
    if (edge.source === nodeId) {
      acc.push(edge.target);
    }

    if (!edge.directed && edge.target === nodeId) {
      acc.push(edge.source);
    }
    return acc;
  }, []);
}


async function dfsVisit(nodeId, visited, stack, traversalOrder) {
  console.log(`Visiting Node: ${nodeId}`);
  visited.add(nodeId);
  traversalOrder.push(nodeId);
  stack.push(nodeId);

  highlightNode(nodeId, 'purple');
  updateDFSVisualization(visited, stack, nodeId);
  await delay(1500);


  const neighbors = edges.reduce((acc, edge) => {
    if (edge.source === nodeId) {
      acc.push(edge.target);
    }

    if (!edge.directed && edge.target === nodeId) {
      acc.push(edge.source);
    }
    return acc;
  }, []);

  console.log(`Neighbors of ${nodeId}:`, neighbors);

  for (const neighborId of neighbors) {
    if (!visited.has(neighborId)) {
      console.log(`Traversing to Neighbor: ${neighborId}`);
      highlightEdge({ source: nodeId, target: neighborId }, 'purple');
      await delay(1500);
      await dfsVisit(neighborId, visited, stack, traversalOrder);
    }
  }

  stack.pop();
  updateDFSVisualization(visited, stack);
}

function initializeDFSVisualization() {
  const resultsBox = document.getElementById('resultsBox');
  resultsBox.innerHTML = `
<strong>DFS Visualization:</strong><br/>
<div><strong>Visited:</strong></div>
<div id="visitedBox" class="visited-row"></div>
<div><strong>Stack:</strong></div>
<div id="stackBox" class="stack-column"></div>
`;
}

function updateDFSVisualization(visited, stack) {
  const visitedBox = document.getElementById('visitedBox');
  const stackBox = document.getElementById('stackBox');


  visitedBox.innerHTML = '';
  Array.from(visited).forEach(nodeId => {
    visitedBox.innerHTML += `<div class="dfs-cell">${nodeId}</div>`;
  });


  stackBox.innerHTML = '';
  stack.slice().reverse().forEach((nodeId, index) => {
    const isTop = index === 0;
    stackBox.innerHTML += `<div class="dfs-cell ${isTop ? 'current' : ''}">${nodeId}</div>`;
  });
}

function updateStackVisualization(stack) {
  const stackBox = document.getElementById('stackBox');


  stackBox.innerHTML = '';
  stack.slice().reverse().forEach((nodeId, index) => {
    const isTop = index === 0;
    stackBox.innerHTML += `<div class="dfs-cell ${isTop ? 'current' : ''}">${nodeId}</div>`;
  });
}


class UnionFind {
  constructor(nodes) {
    this.parent = {};
    nodes.forEach(node => {
      this.parent[node.id] = node.id;
    });
  }

  find(nodeId) {
    if (this.parent[nodeId] !== nodeId) {
      this.parent[nodeId] = this.find(this.parent[nodeId]);
    }
    return this.parent[nodeId];
  }

  union(node1, node2) {
    const root1 = this.find(node1);
    const root2 = this.find(node2);

    if (root1 === root2) {
      return false;
    }

    this.parent[root2] = root1;
    return true;
  }
}
async function applyKruskal() {
  
  const undirectedEdges = edges.filter(edge => !edge.directed);

  if (undirectedEdges.length === 0) {
    alert("No undirected edges available for Kruskal's Algorithm.");
    return;
  }

  
  const sortedEdges = undirectedEdges.sort((a, b) => a.weight - b.weight);

  const uf = new UnionFind(nodes);

  const mst = [];
  let totalWeight = 0;

  
  initializeKruskalVisualization();


  const sortedEdgesContainer = document.getElementById('sortedEdges');
  sortedEdges.forEach(edge => {
    sortedEdgesContainer.innerHTML += `<div class="sorted-edge">${edge.source} - ${edge.target} (${edge.weight})</div>`;
  });

  for (const edge of sortedEdges) {
   
    highlightEdge(edge, 'blue');
    await delay(1000); 

  

   
    const kruskalEdgesContainer = document.getElementById('kruskalEdges');
    kruskalEdgesContainer.innerHTML += `<div class="kruskal-edge">${edge.source} - ${edge.target} (${edge.weight})</div>`;

    const root1 = uf.find(edge.source);
    const root2 = uf.find(edge.target);

    if (root1 !== root2) {
      uf.union(edge.source, edge.target);
      mst.push(edge);
      totalWeight += edge.weight;

      
      highlightEdge(edge, 'green'); 

    

      await delay(1500);

    
      updateKruskalVisualization(mst, totalWeight);
    } else {
     
      highlightEdge(edge, 'red'); 


      await delay(1500); 
    }
  }
  finalizeKruskalVisualization(mst, totalWeight);
}


function initializeKruskalVisualization() {
  const resultsBox = document.getElementById('resultsBox');
  resultsBox.innerHTML = `
  <strong>Kruskal's Algorithm Visualization:</strong><br/>
  <div><strong>Sorted Edges:</strong></div>
  <div id="sortedEdges" class="sorted-edges"></div>
  <div><strong>Edges Considered:</strong></div>
  <div id="kruskalEdges" class="kruskal-edges"></div>
  <div><strong>MST:</strong></div>
  <div id="mstBox" class="mst-row"></div>
  <div class="legend">
      <h4>Legend:</h4>
      <div>
        <span style="background-color: blue; width: 20px; height: 10px; display: inline-block;"></span>
        Edge Being Considered
      </div>
      <div>
        <span style="background-color: green; width: 20px; height: 10px; display: inline-block;"></span>
        Edge Included in MST
      </div>
      <div>
        <span style="background-color: red; width: 20px; height: 10px; display: inline-block;"></span>
        Edge Skipped (Cycle)
      </div>
    </div>
  <div><strong>Total Weight:</strong> <span id="totalWeight">0</span></div>
`;
}

function updateKruskalVisualization(mst, totalWeight) {
  const mstBox = document.getElementById('mstBox');
  mstBox.innerHTML = '';

  mst.forEach(edge => {
    mstBox.innerHTML += `<div class="kruskal-cell">${edge.source} - ${edge.target} (${edge.weight})</div>`;
  });

  document.getElementById('totalWeight').textContent = totalWeight;
}
function finalizeKruskalVisualization(mst, totalWeight) {
  const resultsBox = document.getElementById('resultsBox');
  resultsBox.innerHTML += `<br/><strong>MST Total Weight:</strong> ${totalWeight}`;
}



function addEdgeToConsidered(edge, isIncluded = false) {
  const primEdgesContainer = document.getElementById('primEdges');
  if (!primEdgesContainer) return;

  const edgeDiv = document.createElement('div');
  edgeDiv.classList.add('prim-edge');
  edgeDiv.textContent = `${edge.source} - ${edge.target} (${edge.weight})`;

  if (isIncluded) {
    edgeDiv.style.backgroundColor = '#28a745';
  } else {
    edgeDiv.style.backgroundColor = '#17a2b8';
  }

  primEdgesContainer.appendChild(edgeDiv);
}


function highlightEdge(edge, color) {
  svg.selectAll('line')
    .filter(d => 
      (d.source === edge.source && d.target === edge.target) || 
      (d.source === edge.target && d.target === edge.source)
    )
    .transition()
    .duration(500)
    .attr('stroke', color)
    .attr('stroke-width', color === 'green' ? 4 : (color === 'red' ? 2 : 3));
}


function initializePrimVisualization() {
  const resultsBox = document.getElementById('resultsBox');
  resultsBox.innerHTML = `
    <strong>Prim's Algorithm Visualization:</strong><br/>
    <div class="prim-flex-container">
      <div class="sorted-edges-container">
        <strong>Sorted Edges:</strong>
        <div id="sortedEdges" class="sorted-edges"></div>
      </div>
      <div class="edges-considered-container">
        <strong>Edges Considered:</strong>
        <div id="primEdges" class="prim-edges"></div>
      </div>
    </div>
    <div><strong>MST:</strong></div>
    <div id="primMST" class="prim-mst-row"></div>
    <div><strong>Total Weight:</strong> <span id="primTotalWeight">0</span></div>
    <div class="legend">
      <h4>Legend:</h4>
      <div>
        <span style="background-color: blue; width: 20px; height: 10px; display: inline-block;"></span>
        Edge Being Considered
      </div>
      <div>
        <span style="background-color: green; width: 20px; height: 10px; display: inline-block;"></span>
        Edge Included in MST
      </div>
      <div>
        <span style="background-color: red; width: 20px; height: 10px; display: inline-block;"></span>
        Edge Skipped (Cycle)
      </div>
    </div>
  `;
}


function updatePrimVisualization(mst, totalWeight) {
  const primMST = document.getElementById('primMST');
  primMST.innerHTML = ''; 
  mst.forEach(edge => {
    primMST.innerHTML += `<div class="prim-cell">${edge.source} - ${edge.target} (${edge.weight})</div>`;
  });

  document.getElementById('primTotalWeight').textContent = totalWeight;
}


function finalizePrimVisualization(mst, totalWeight) {
  const resultsBox = document.getElementById('resultsBox');
  resultsBox.innerHTML += `<br/><strong>Prim's Algorithm Completed!</strong>`;
  resultsBox.innerHTML += `<br/><strong>MST Total Weight:</strong> ${totalWeight}`;
}


function delay(ms = 1500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function applyPrim() {
  
  if (nodes.length === 0 || edges.length === 0) {
    alert("Please add nodes and edges to the graph before running Prim's Algorithm.");
    return;
  }


  const startNodeId = prompt("Enter the starting node for Prim's Algorithm:", nodes[0].id);
  if (!startNodeId) return;

  const startNode = nodes.find(n => n.id === startNodeId);
  if (!startNode) {
    alert("Starting node not found.");
    return;
  }

 
  const mst = [];
  const visited = new Set();
  visited.add(startNode.id);

  
  const pq = new PriorityQueue();
  edges.forEach(edge => {
    if (edge.source === startNode.id || edge.target === startNode.id) {
      pq.enqueue(edge, edge.weight);
      highlightEdge(edge, 'blue'); 
      addEdgeToConsidered(edge);   
    }
  });


  initializePrimVisualization();

 
  const sortedEdgesContainer = document.getElementById('sortedEdges');
  sortedEdgesContainer.innerHTML = ''; 

  edges.forEach(edge => {
    sortedEdgesContainer.innerHTML += `<div class="sorted-edge">${edge.source} - ${edge.target} (${edge.weight})</div>`;
  });

  let totalWeight = 0;

  while (!pq.isEmpty()) {
    const currentEdge = pq.dequeue();

   
    const nextNodeId = visited.has(currentEdge.source) ? currentEdge.target : currentEdge.source;

    if (visited.has(nextNodeId)) {
      
      highlightEdge(currentEdge, 'red');
      addEdgeToConsidered(currentEdge, false);
      await delay(1500); 
      continue;
    }

    mst.push(currentEdge);
    totalWeight += currentEdge.weight;
    visited.add(nextNodeId);

   
    highlightEdge(currentEdge, 'green');
    addEdgeToConsidered(currentEdge, true); 
    
    updatePrimVisualization(mst, totalWeight);
    await delay(1500); 

   
    edges.forEach(edge => {
      if ((edge.source === nextNodeId && !visited.has(edge.target)) ||
          (edge.target === nextNodeId && !visited.has(edge.source))) {
        pq.enqueue(edge, edge.weight);
        highlightEdge(edge, 'blue'); 
        addEdgeToConsidered(edge);  
      }
    });

    await delay(1500); 
  }


  finalizePrimVisualization(mst, totalWeight);
}