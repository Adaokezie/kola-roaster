function generateRoster() {
    const names = document.getElementById("names").value.split(",").map(name => name.trim());
    if (names.length < 1) {
        alert("Please enter at least one name.");
        return;
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const chores = [
        "Washing Plates", 
        "Sweeping Sanctuary and Frontage", 
        "Sweeping Spreading Ground and Back of Kitchen", 
        "Washing Bathroom 1", 
        "Washing Bathroom 2", 
        "Washing Toilet", 
        "Sweeping Room and Kitchen Corridor", 
        "Sweeping Front and Side of Kitchen", 
        "Sweeping Courtyard and Pathway to Church"
    ];

    const waterChores = ["Washing Plates", "Washing Bathroom 1", "Washing Bathroom 2", "Washing Toilet"];
    const mopChores = ["Sweeping Sanctuary and Frontage", "Sweeping Room and Kitchen Corridor"];
    const roster = {};
    const assignedWaterChores = {}; // Keep track of water-based chores assigned per person
    const assignedDailyChores = {}; // Keep track of daily chores assigned per person per day

    days.forEach(day => roster[day] = {});

    function assignChores() {
        days.forEach(day => {
            const isWaterChoreDay = ["Wednesday", "Saturday"].includes(day);

            chores.forEach(chore => {
                let assignedPerson;

                if (chore === "Washing Plates" || (isWaterChoreDay && waterChores.includes(chore))) {
                    assignedPerson = getNextAvailablePerson(names, day, chore, assignedWaterChores, assignedDailyChores, true);
                } else if (!waterChores.includes(chore)) {
                    assignedPerson = getNextAvailablePerson(names, day, chore, assignedWaterChores, assignedDailyChores, false);
                }

                if (assignedPerson) {
                    roster[day][chore] = assignedPerson;
                    assignedDailyChores[day] = assignedDailyChores[day] || {};
                    assignedDailyChores[day][assignedPerson] = true;

                    if (waterChores.includes(chore)) {
                        assignedWaterChores[assignedPerson] = assignedWaterChores[assignedPerson] || [];
                        assignedWaterChores[assignedPerson].push(chore);
                    }

                    if (isWaterChoreDay && mopChores.includes(chore)) {
                        roster[day][chore] += " (Mop)";
                    }
                } else {
                    roster[day][chore] = ""; // No assignment if conditions are not met
                }
            });
        });
    }

    function getNextAvailablePerson(names, day, chore, assignedWaterChores, assignedDailyChores, isWaterChoreDay) {
        const candidates = names.filter(name => 
            (!assignedDailyChores[day] || !assignedDailyChores[day][name]) &&
            (!assignedWaterChores[name] || !waterChores.includes(chore) || !assignedWaterChores[name].includes(chore))
        );

        if (candidates.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    }

    assignChores();
    displayRoster(roster);
}

function displayRoster(roster) {
    const rosterDiv = document.getElementById("roster");
    rosterDiv.innerHTML = "<h2>Weekly Chore Roster</h2>";

    let tableHtml = "<table><tr><th>Day</th>";
    const chores = Object.keys(roster["Monday"]);
    chores.forEach(chore => tableHtml += `<th>${chore}</th>`);
    tableHtml += "</tr>";

    for (const [day, assignments] of Object.entries(roster)) {
        tableHtml += `<tr><td>${day}</td>`;
        chores.forEach(chore => {
            tableHtml += `<td>${assignments[chore]}</td>`;
        });
        tableHtml += "</tr>";
    }

    tableHtml += "</table>";
    rosterDiv.innerHTML = tableHtml;
}
