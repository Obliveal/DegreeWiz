window.onload = function() {
    createDroppableBoxes();
}

async function searchClasses() {
    var query = document.getElementById("searchInput").value;
    
    var url = "https://content.osu.edu/v2/classes/search?q=" + encodeURIComponent(query);
    console.assert(url.includes("https://content.osu.edu/v2/classes/search?q="), "URL does not match expected format.");

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.assert(Array.isArray(data.data.courses), "Expected data.data.courses to be an array.");
        displayResults(data.data.courses);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(results) {
    console.assert(Array.isArray(results), "Expected results to be an array.");
    var resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";

    var courseNames = [];

    results.forEach(function(course, index) {
        console.assert(course.course, "Expected course data to be present.");
        if (!courseNames.includes(course.course.title)) {
            courseNames.push(course.course.title);

            var listing = document.createElement("div");
            console.assert(listing !== null, "Failed to create a div element.");

            listing.className = "draggable";
            listing.id = "result_" + index;

            listing.setAttribute('name', course.course.subject + " " + course.course.catalogNumber);
            listing.setAttribute('courseTitle', course.course.shortDescription);
            listing.setAttribute('hours', course.course.minUnits);
            listing.setAttribute('description', course.course.description);

            listing.draggable = true;
            listing.setAttribute("ondragstart", "drag(event)");

            listing.innerHTML = `
                <span>${listing.getAttribute('courseTitle')} - ${listing.getAttribute('name')}</span>
                <p>${listing.getAttribute('description')}</p>
                <p>Credit Hours: ${listing.getAttribute('hours')}</p>
            `;

            resultsContainer.appendChild(listing);
        }
    });
}

function createDroppableBoxes() {
    var planGrid = document.getElementById("plangrid");
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 2; j++) {
            var semesterBox = document.createElement("div");
            semesterBox.id = "semester" + i;

            semesterBox.className = "droppable";
            semesterBox.addEventListener("drop", dropClass);
            semesterBox.addEventListener("dragover", allowDrop);

            if (j == 0) {
                semesterBox.innerHTML = `
                    <div class="title">AUT ${23 + j + i}</div>
                    <div class="credit-hours">Total Credit Hours: 0</div>
                `;
            } else {
                semesterBox.innerHTML = `
                    <div class="title">SPR ${23 + j + i}</div>
                    <div class="credit-hours">Total Credit Hours: 0</div>
                `;
            }

            planGrid.appendChild(semesterBox);
        }
    }
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dropClass(event) {
    event.preventDefault();

    var droppable;
    if (event.target.className == "droppable") {
        droppable = event.target;
    } else {
        // user is dropping element into another element in the box
        droppable = event.target.parentElement;
    }

    if (droppable.className == "droppable") {
        var data = event.dataTransfer.getData("text");
        var draggable = document.getElementById(data);

        var newElement = document.createElement("div");
        newElement.className = "plannedCourse";
        newElement.innerText = draggable.getAttribute('name');
        newElement.setAttribute('hours', draggable.getAttribute('hours'));

        // handle the X button
        var removeButton = document.createElement("button");
        removeButton.innerText = "x";
        removeButton.onclick = function() {
            droppable.removeChild(newElement);
            updateCreditHours(droppable);
        };

        newElement.appendChild(removeButton);

        // example tags, not yet implemented
        newElement.onclick = function() {
            showCourseInfo(this.childNodes[0].textContent);
        };

        droppable.appendChild(newElement);
        updateCreditHours(droppable);
    }
}

function allowDrop(event) {
    event.preventDefault();
    event.stopPropagation();
}

function showCourseInfo(courseName) {
    var tagBox = document.getElementById('courseInfo');

    // if fully implemented, would confer with a database
    // for example purposes, set example tags are used
    var tags = 'easy';
    if (courseName == 'ENGR 1282.04H') tags = 'team-focused, project-based';
    if (courseName == 'MATH 1151') tags = 'difficult, homework-heavy';

    tagBox.innerText = 'Students have tagged ' + courseName + ' as: '+ tags;
}

function clearCourseInfo() {
    var tagBox = document.getElementById('courseInfo');
    tagBox.innerText = '';
}

function updateCreditHours(droppableElement) {
    var creditHoursElement = droppableElement.querySelector('.credit-hours');
    var totalCreditHours = 0;
    droppableElement.querySelectorAll('.plannedCourse').forEach(function(course) {
        var hours = parseInt(course.getAttribute('hours'));
        console.assert(!isNaN(hours), "Expected 'hours' to be a number.");
        totalCreditHours += hours;
    });
    creditHoursElement.textContent = "Total Credit Hours: " + totalCreditHours;
    console.assert(typeof totalCreditHours === 'number', "Total Credit Hours calculation failed, expected a number.");
}

function savePlan() {
    // not implemented
}

function checkPrerequisites() {
    // not implemented
}