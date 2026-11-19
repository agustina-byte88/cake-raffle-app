// ===================================================
// CAKE RAFFLE - JAVASCRIPT
// Every line has a comment explaining what it does.
// ===================================================

// Find the form where people type their name
const entryForm = document.getElementById("entryForm");

// Find the text box where the name is typed
const nameInput = document.getElementById("nameInput");

// Find the small message area under the form
const formMessage = document.getElementById("formMessage");

// Find the list where participants are shown
const participantsList = document.getElementById("participantsList");

// Find the bubble that shows how many people entered
const participantCount = document.getElementById("participantCount");

// Find the "No one has entered yet" message
const emptyMessage = document.getElementById("emptyMessage");

// Find the box where the winner is shown
const winnerDisplay = document.getElementById("winnerDisplay");

// Find the "Draw a Winner" button
const drawButton = document.getElementById("drawButton");

// Find the "Start Over" button
const resetButton = document.getElementById("resetButton");

// Create an empty list that will hold every participant's name
let participants = [];

// Remember whether a draw is happening right now (so it can't be clicked twice)
let isDrawing = false;


// ---------- SHOW THE PARTICIPANTS ON THE PAGE ----------

// This function redraws the participants list every time it changes
function showParticipants() {

    // Empty the list on the page before rebuilding it
    participantsList.innerHTML = "";

    // Go through every name in the participants list, one by one
    participants.forEach(function (name, index) {

        // Create a new list item for this person
        const item = document.createElement("li");

        // Put the person's name inside the list item
        item.textContent = name;

        // Create a small "×" button to remove this person
        const removeButton = document.createElement("button");

        // Show the "×" symbol on the remove button
        removeButton.textContent = "×";

        // Give the remove button its style
        removeButton.className = "remove-btn";

        // Describe the button for screen readers
        removeButton.setAttribute("aria-label", "Remove " + name);

        // When the "×" is clicked, remove this person from the raffle
        removeButton.addEventListener("click", function () {

            // Remove 1 name from the list at this person's position
            participants.splice(index, 1);

            // Redraw the list without that person
            showParticipants();
        });

        // Put the remove button next to the name
        item.appendChild(removeButton);

        // Add the finished list item to the page
        participantsList.appendChild(item);
    });

    // Update the counter bubble with the number of participants
    participantCount.textContent = participants.length;

    // Show the "No one has entered yet" message only if the list is empty
    emptyMessage.style.display = participants.length === 0 ? "block" : "none";

    // Only allow drawing when there are at least 2 people (and no draw is running)
    drawButton.disabled = participants.length < 2 || isDrawing;
}


// ---------- ADD A NEW PARTICIPANT ----------

// Run this code when the "Add Me!" form is submitted
entryForm.addEventListener("submit", function (event) {

    // Stop the page from refreshing (the browser's default behavior)
    event.preventDefault();

    // Read the typed name and remove extra spaces at the start and end
    const name = nameInput.value.trim();

    // If the name is empty, show a message and stop here
    if (name === "") {

        // Tell the user to type a name
        formMessage.textContent = "Please type a name first! 🙂";

        // Stop running the rest of this code
        return;
    }

    // Check if this name is already in the list (ignoring upper/lower case)
    const alreadyEntered = participants.some(function (existing) {

        // Compare both names in lowercase
        return existing.toLowerCase() === name.toLowerCase();
    });

    // If the name is already in the list, show a message and stop here
    if (alreadyEntered) {

        // Tell the user this name is taken
        formMessage.textContent = name + " is already in the raffle! 🎟️";

        // Stop running the rest of this code
        return;
    }

    // Add the new name to the participants list
    participants.push(name);

    // Show a friendly confirmation message
    formMessage.textContent = "Good luck, " + name + "! 🍀";

    // Clear the text box so the next person can type
    nameInput.value = "";

    // Put the cursor back in the text box
    nameInput.focus();

    // Redraw the participants list on the page
    showParticipants();
});


// ---------- DRAW A WINNER ----------

// Run this code when the "Draw a Winner" button is clicked
drawButton.addEventListener("click", function () {

    // Mark that a draw is now happening
    isDrawing = true;

    // Disable the Draw button so it can't be clicked again during the draw
    drawButton.disabled = true;

    // Show a "drawing" message in the winner box
    winnerDisplay.innerHTML = '<p class="winner-emojis">🥁</p><p class="winner-subtext">Drawing...</p>';

    // Pick the winner now: a random position from 0 up to the last person
    const winnerIndex = Math.floor(Math.random() * participants.length);

    // Get all participant items currently on the page
    const items = participantsList.querySelectorAll("li");

    // Count how many "shuffle" steps have happened so far
    let step = 0;

    // Decide how many shuffle steps to show before stopping on the winner
    const totalSteps = 20 + winnerIndex;

    // Repeat this little function every 100 milliseconds to create a shuffle effect
    const shuffle = setInterval(function () {

        // Remove the highlight from every participant
        items.forEach(function (item) {

            // Take away the yellow highlight
            item.classList.remove("highlight");
        });

        // Highlight the next participant in the list (wrapping around at the end)
        items[step % items.length].classList.add("highlight");

        // Move on to the next step
        step = step + 1;

        // When we've done enough steps, stop the shuffle and show the winner
        if (step > totalSteps) {

            // Stop repeating the shuffle
            clearInterval(shuffle);

            // Remove the yellow highlight from everyone
            items.forEach(function (item) {

                // Take away the yellow highlight
                item.classList.remove("highlight");
            });

            // Mark the winning participant in teal
            items[winnerIndex].classList.add("winner");

            // Show the winner's name with a cake and party emoji
            showWinner(participants[winnerIndex]);
        }
    }, 100);
});


// ---------- SHOW THE WINNER ----------

// This function puts the winner's name in the winner box
function showWinner(name) {

    // Clear whatever is in the winner box
    winnerDisplay.innerHTML = "";

    // Create the line with the cake and party emojis
    const emojis = document.createElement("p");

    // Add the cake and party emojis
    emojis.textContent = "🎂🎉";

    // Give the emojis their bouncing style
    emojis.className = "winner-emojis";

    // Create the line with the winner's name
    const winnerName = document.createElement("p");

    // Put the winner's name in (textContent keeps it safe from code tricks)
    winnerName.textContent = name;

    // Give the name its big pink style
    winnerName.className = "winner-name";

    // Create the "congratulations" line
    const subtext = document.createElement("p");

    // Write the congratulations message
    subtext.textContent = "Congratulations! The cake is yours! 🍰";

    // Give the congratulations line its style
    subtext.className = "winner-subtext";

    // Add the emojis to the winner box
    winnerDisplay.appendChild(emojis);

    // Add the winner's name to the winner box
    winnerDisplay.appendChild(winnerName);

    // Add the congratulations line to the winner box
    winnerDisplay.appendChild(subtext);

    // Celebrate with falling confetti
    launchConfetti();

    // The draw is finished
    isDrawing = false;

    // Allow drawing again (in case they want another winner)
    drawButton.disabled = participants.length < 2;
}


// ---------- CONFETTI CELEBRATION ----------

// This function makes colorful confetti fall from the top of the screen
function launchConfetti() {

    // The colors the confetti pieces can be
    const colors = ["#ff4081", "#00bfa5", "#ffd54f", "#7c4dff", "#ff8a65"];

    // Create 120 pieces of confetti
    for (let i = 0; i < 120; i++) {

        // Create one confetti piece
        const piece = document.createElement("div");

        // Give it the confetti style
        piece.className = "confetti";

        // Place it at a random spot across the width of the screen
        piece.style.left = Math.random() * 100 + "vw";

        // Give it a random color from the list
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Make it fall at a random speed (between 2 and 4 seconds)
        piece.style.animationDuration = 2 + Math.random() * 2 + "s";

        // Start falling after a small random delay so they don't all fall at once
        piece.style.animationDelay = Math.random() * 0.5 + "s";

        // Add the confetti piece to the page
        document.body.appendChild(piece);

        // Remove the confetti piece after 5 seconds so the page stays clean
        setTimeout(function () {

            // Delete this confetti piece from the page
            piece.remove();
        }, 5000);
    }
}


// ---------- START OVER ----------

// Run this code when the "Start Over" button is clicked
resetButton.addEventListener("click", function () {

    // Do nothing if a draw is in the middle of happening
    if (isDrawing) {

        // Stop running the rest of this code
        return;
    }

    // Empty the participants list
    participants = [];

    // Clear the message under the form
    formMessage.textContent = "";

    // Put the placeholder text back in the winner box
    winnerDisplay.innerHTML = '<p class="winner-placeholder">The winner will appear here...</p>';

    // Redraw the (now empty) participants list
    showParticipants();
});


// Show the empty participants list when the page first loads
showParticipants();
