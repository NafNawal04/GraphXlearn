const path = require('path');

const getLearningModePage = (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files/learningMode.html'));
};

const renderGraphContent = (req, res) => {
    const graphType = req.params.graphType;
    res.json({ content: getContentByGraphType(graphType) });
};

function getContentByGraphType(graphType) {
    const contentMap = {
        'simple-graph': 'A simple graph is an undirected graph that has no loops or multiple edges.',
        'complete-graph': 'A complete graph is a graph in which every pair of vertices is connected by an edge.',
        'directed-graph': 'A directed graph, or digraph, is a graph in which edges have directions.',
        'dijkstra': "Dijkstra's algorithm finds the shortest path between nodes in a graph.",
        'bfs': 'Breadth-First Search (BFS) is an algorithm for traversing or searching tree or graph data structures.',
        'dfs': 'Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures.',
        // Add other graph types here
    };
    return contentMap[graphType] || 'Content not available for this graph type.';
}

module.exports = { getLearningModePage, renderGraphContent };

