/**
 * This function is used onload of the body of the summary HTML page. It gets the number of the user from the link and shares it with the fillDates functions. 
 * The function also uses the function loadData to load the data from the remoteStorage (Firebase).
 * 
 */
async function initSummary() {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let actualUsers = await loadData("users");
  await fillDates(actualUsersNumber, actualUsers);
  await checkConditions();
  await fillHeaderInitials();
}

/** 
 * Generates a greeting message based on the current time:
 * - 'Good morning' before 12 PM,
 * - 'Good afternoon' between 12 PM and 6 PM,
 * - 'Good evening' otherwise.
 * Displays the greeting in an element with id 'greetingText'.
 * 
 */
document.addEventListener("DOMContentLoaded", function () {
  let today = new Date();
  let curHr = today.getHours();
  let greeting;

  if (curHr < 12) {
    greeting = "Good morning,";
  } else if (curHr < 18) {
    greeting = "Good afternoon,";
  } else {
    greeting = "Good evening,";
  }
  document.getElementById("greetingText").textContent = greeting;
});

/**
   * This function is used to check the mediaQuery and the referrer. If the mediaQuery matches and the referrer contains login.html, 
   * the showGreetingThenMain function is called. Otherwise, the mainContainer is shown.
   */
async function checkConditions() {
  var mediaQuery = window.matchMedia("(max-width: 1100px)");
  var referrer = document.referrer;
  if (mediaQuery.matches && referrer.includes("login.html")) {
    await showGreetingThenMain();
  } else {
    let mainContainer = document.getElementById('headingSectionAndMainContainer');
    mainContainer.style.display = 'flex';
  }
}

/**
 * This function is used to show the greeting and then the mainContainer.
 */

function showGreetingThenMain() {
  let greetingContainer = document.getElementById('greetingContainer');
  let mainContainer = document.getElementById('headingSectionAndMainContainer');
  mainContainer.style.display = 'none';
  greetingContainer.style.display = 'flex';
  setTimeout(function () {
    greetingContainer.style.display = 'none';
    mainContainer.style.display = 'flex';
  }, 2000);
}

/**
 * This function is used to fill the content of the summary page.
 *
 * @param {number} actualUsersNumber - The number of the user.
 * @param {array} actualUsers - The array of the users.
 *
 */
function fillDates(actualUsersNumber, actualUsers) {
  let actualUser = actualUsers[actualUsersNumber];
  getElementById("tasksToDo").innerHTML = `${actualUser["tasks"][0]["items"].length}`;
  getElementById("tasksDone").innerHTML = `${actualUser["tasks"][3]["items"].length}`;
  let tasksInBoard = actualTasksInBoard(actualUser);
  getElementById("tasksInBoard").innerHTML = `${tasksInBoard}`;
  getElementById("tasksInProgress").innerHTML = `${actualUser["tasks"][1]["items"].length}`;
  getElementById("tasksAwaitingFeedback").innerHTML = `${actualUser["tasks"][2]["items"].length}`;
  let urgentDates = [];
  fillUrgentTask(actualUser, urgentDates);
  fillUrgentDate(urgentDates);
  getElementById("greetingName").innerHTML = `${actualUsers[actualUsersNumber]["name"]}`;
}

/**
 * This function is used to get the number of the urgent tasks.
 * 
 * @param {object} actualUser - The object of the user.
 * 
 */
function actualTasksInBoard(actualUser) {
  let tasksInBoard = 0;
  for (let actualTasksStatusIndex = 0; actualTasksStatusIndex < actualUser["tasks"].length; actualTasksStatusIndex++) {
    tasksInBoard += actualUser["tasks"][actualTasksStatusIndex]["items"].length;
  }
  return tasksInBoard;
}

/**
 * This function is used to shortcut the getElementById function.
 *
 * @param {string} id - The id of the element.
 *
 */
function getElementById(id) {
  return document.getElementById(id);
}

/**
 * This function is used to fill the number of the urgent tasks.
 *
 * @param {object} actualUser - The object of the user.
 * @param {array} urgentDates - The array of the urgent dates.
 *
 */
function fillUrgentTask(actualUser, urgentDates) {
  let urgentTasksNumber = 0;
  for (let actualTasksStatusIndex = 0; actualTasksStatusIndex < actualUser["tasks"].length; actualTasksStatusIndex++) {
    let actualTasksStatusNumber = actualUser["tasks"][actualTasksStatusIndex];
    for (let actualTaskIndex = 0; actualTaskIndex < actualTasksStatusNumber["items"].length; actualTaskIndex++) {
      let actualTaskPriority = actualTasksStatusNumber["items"][actualTaskIndex]["priority"];
      if (actualTaskPriority === "urgent") {
        urgentDates.push(actualTasksStatusNumber["items"][actualTaskIndex]["date"]);
        urgentTasksNumber++;
      }
    }
  }
  getElementById("urgentTasks").innerHTML = `${urgentTasksNumber}`;
}

/**
 * This function is used to fill the date of the urgent task, that is the closest in time.
 *
 * @param {array} urgentDates - The array of the urgent dates.
 *
 */
function fillUrgentDate(urgentDates) {
  let dateInMilliseconds = urgentDates.map((date) => new Date(date).getTime());
  let earliestDateInMilliseconds = Math.min(...dateInMilliseconds);
  let earliestDate = new Date(earliestDateInMilliseconds);
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let monthName = months[earliestDate.getMonth()];
  let day = earliestDate.getDate();
  let year = earliestDate.getFullYear();
  let formattedDate = `${monthName} ${day}, ${year}`;
  getElementById("urgentDate").innerHTML = formattedDate;
}