let editor; 

    document.addEventListener('DOMContentLoaded', function () {

    require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.40.0/min/vs' } });

    require(['vs/editor/editor.main'], function () {
        console.log('Monaco editor is successfully loaded.');

        editor = monaco.editor.create(document.getElementById('editor'), {
            value: `import networkx as nx
import matplotlib.pyplot as plt   
G = nx.Graph()
G.add_edges_from([(1, 2), (2, 3), (3, 4)])
nx.draw(G, with_labels=True)
plt.savefig("graph.png")`,
            language: 'python',
            theme: 'vs-dark'
        });

        console.log('Monaco editor has been initialized.');


        function sendCodeToBackend(code) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/code-execute', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
                  
                if (xhr.readyState === 4) {
                    
                    const outputElement = document.getElementById('output');
                    outputElement.innerHTML = '';
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);

                        if (response.error) {
                            document.getElementById('aiAnalysisButton').style.display = 'block';
                            outputElement.innerHTML = `<pre style="color: red;">${response.error}</pre>`;
                        } else {
                            outputElement.innerHTML = `<pre>${response.output}</pre>`;

                            if (code.includes("plt.show()") || code.includes("plt.savefig")) {
                                const timestamp = new Date().getTime();
                                const img = document.createElement('img');
                                img.src = `./graph.png?timestamp=${timestamp}`;
                                img.alt = 'Graph Output';
                                img.style = 'max-width: 100%; height: auto; margin-top: 5px;';
                                outputElement.appendChild(img);
                            }
                            document.getElementById('aiAnalysisButton').style.display = 'none';
                            document.getElementById('aiAnalysisContainer').style.display = 'none';
                                
                        }
                    } else {
                        outputElement.innerHTML = `<pre style="color: red;">Backend error: ${xhr.status} ${xhr.statusText}</pre>`;
                    }
                }
            };

            xhr.send(JSON.stringify({ code: code}));
        }


        document.getElementById('saveButton').addEventListener('click', function () {
            if (!editor) {
                console.error("Editor is not initialized yet.");
                return;
            }
            const code = editor.getValue();
            sendCodeToBackend(code);
        });


        function sendCodeForAnalysis(code,errorText) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/ai-analyze', true);  
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log('AI Analysis response:', xhr.responseText); 

                const analysisElement = document.getElementById('aiAnalysisResults');
                analysisElement.innerHTML = '';

                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    analysisElement.innerHTML = `<pre>${response.suggestions}</pre>`;
                    document.getElementById('aiAnalysisContainer').style.display = 'block';
                } else {
                    analysisElement.innerHTML = `<pre style="color: red;">Failed to get analysis: ${xhr.status} ${xhr.statusText}</pre>`;
                }
            }
        };

        xhr.send(JSON.stringify({ code: code , error: errorText}));
    }


        document.getElementById('aiAnalysisButton').addEventListener('click', function () {
            if (!editor) {
                console.error("Editor is not initialized yet.");
                return;
            }
            const code = editor.getValue();
            const errorText = document.getElementById('output').innerText;
            sendCodeForAnalysis(code,errorText); 
        });
    });
});


        document.getElementById('infoButton').addEventListener('click', function () {
            const popup = document.getElementById('infoPopup');
            if (popup.style.right === "-190px") {
                popup.style.right = "-550px"; 
            } else {
                popup.style.right = "-190px";
            }
        });

        