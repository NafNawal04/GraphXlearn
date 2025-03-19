async function askQuestion() {
    const question = document.getElementById('inputBox').value;
    const outputBox = document.getElementById('outputBox');
    const historyList = document.getElementById('historyList');
    outputBox.textContent = "Generating response...";

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      outputBox.textContent = data.answer || 'No answer received.';
    
      const li = document.createElement('li');
      li.innerHTML = `<span class="history-question">Q: ${question}</span><br>
                      <span class="history-answer">A: ${data.answer}</span>`;
      historyList.appendChild(li);
    } catch (error) {
      console.error(error);
      outputBox.textContent = 'An error occurred while getting the answer.';
    }
  }
  
  async function loadUserHistory() {
  try {
      const response = await fetch('/api/history', { credentials: 'include' }); 
      const data = await response.json();

      if (data.history.length > 0) {
          const historyList = document.getElementById('historyList');
          historyList.innerHTML = ''; 

          data.history.forEach(entry => {
              const li = document.createElement('li');
              li.innerHTML = `<span class="history-question">Q: ${entry.question}</span><br>
                              <span class="history-answer">A: ${entry.answer}</span>`;
              historyList.appendChild(li);
          });
      }
  } catch (error) {
      console.error("Error loading history:", error);
  }
}

window.onload = loadUserHistory;

