// Function to fetch and parse the log file
async function fetchLogs() {
    const response = await fetch('log.txt'); // Assuming your log file is named log.txt
    const logText = await response.text();   // Read the file as text
    const logLines = logText.split('\n');    // Split by new lines
    const logs = [];

    // Regular expression to extract timestamp, username, and message
    const messagePattern = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\t([^\s]+)\t(.+)/;

    // Parse each line and extract relevant data
    logLines.forEach(line => {
        const match = messagePattern.exec(line);
        if (match) {
            const [_, timestamp, username, message] = match;
            logs.push({ timestamp, username, message });
        }
    });

    return logs; // Return the parsed logs
}

// Function to search and display messages by username
async function searchMessages(event) {
    event.preventDefault(); // Prevent form submission

    // Get the search query (username)
    const username = document.getElementById("username").value.toLowerCase();
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Clear previous results

    // Fetch the logs from the txt file
    const logs = await fetchLogs();

    // Filter logs by username
    const results = logs.filter(log => log.username.toLowerCase().includes(username));

    // Display the results as clickable messages
    if (results.length > 0) {
        results.forEach((result, index) => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");
            messageDiv.innerHTML = `<span class="timestamp">${result.timestamp}</span>
                                    <span class="username">${result.username}</span>: ${result.message}`;

            // Add a click event to each message to show it in context of the full log
            messageDiv.onclick = () => showMessageInContext(result.timestamp);
            resultsContainer.appendChild(messageDiv);
        });
    } else {
        resultsContainer.innerHTML = "<p>No messages found for this username.</p>";
    }
}

// Function to display the complete log with the clicked message highlighted
async function showMessageInContext(clickedTimestamp) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Clear previous results

    // Fetch the logs from the txt file
    const logs = await fetchLogs();

    // Display the complete log and highlight the clicked message
    logs.forEach(result => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        // Check if the current message is the one that was clicked
        if (result.timestamp === clickedTimestamp) {
            messageDiv.style.backgroundColor = "#ffeb3b"; // Highlight the clicked message
        }

        messageDiv.innerHTML = `<span class="timestamp">${result.timestamp}</span>
                                <span class="username">${result.username}</span>: ${result.message}`;
        resultsContainer.appendChild(messageDiv);

        // Scroll to the clicked message after rendering
        if (result.timestamp === clickedTimestamp) {
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Function to display the complete log
async function showCompleteLog() {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Clear previous results

    // Fetch the logs from the txt file
    const logs = await fetchLogs();

    // Display the complete log
    logs.forEach(result => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.innerHTML = `<span class="timestamp">${result.timestamp}</span>
                                <span class="username">${result.username}</span>: ${result.message}`;
        resultsContainer.appendChild(messageDiv);
    });
}