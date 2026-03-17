const inputBox = document.getElementById("input-box");
const timeBox = document.getElementById("time-box");
const repeatBox = document.getElementById("repeat-box");
const listContainer = document.getElementById("list-container");
const alarmSound = new Audio("mixkit-classic-alarm-995.wav");

// ADD TASK
function addTask(){

    if(inputBox.value === ''){
        alert("Please enter a task!");
        return;
    }

    let li = document.createElement("li");

    if(timeBox.value !== ""){
        li.innerHTML = `<span class="task-text">${inputBox.value} (${timeBox.value})</span>`;
        li.setAttribute("data-time", timeBox.value);
    } else {
        li.innerHTML = `<span class="task-text">${inputBox.value}</span>`;
        li.setAttribute("data-time", "");
    }

    let repeatValue = repeatBox.value || "0";
    li.setAttribute("data-repeat", repeatValue);
    li.setAttribute("data-last-alert", "");

    let deleteBtn = document.createElement("span");
    deleteBtn.innerHTML = "\u00d7";
    deleteBtn.classList.add("delete-btn");

    li.appendChild(deleteBtn);
    listContainer.appendChild(li);

    inputBox.value = "";
    timeBox.value = "";
    repeatBox.value = "";

    saveData();
}


// CLICK EVENTS
listContainer.addEventListener("click", function(e){

    // click anywhere on task → toggle complete
    if(e.target.tagName === "LI" || e.target.classList.contains("task-text")){
        let li = e.target.closest("li");
        li.classList.toggle("checked");
        saveData();
    }

    // delete
    else if(e.target.classList.contains("delete-btn")){
        e.target.parentElement.remove();
        saveData();
    }

}, false);


// SAVE / LOAD
function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}

showTask();


// TIMER
setInterval(() => {

    let now = new Date();

    let currentTime =
        now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0');

    let currentMinutes = now.getHours() * 60 + now.getMinutes();

    let tasks = document.querySelectorAll("li");

    tasks.forEach(task => {

        let taskTime = task.getAttribute("data-time");
        if(!taskTime) return;

        let repeat = parseInt(task.getAttribute("data-repeat")) || 0;
        let lastAlert = task.getAttribute("data-last-alert");

        let [h, m] = taskTime.split(":");
        let taskMinutes = parseInt(h) * 60 + parseInt(m);

        if(currentTime === taskTime && lastAlert !== currentTime){
            alarmSound.currentTime=0;
            alarmSound.play();
            setTimeout(() => {
                alert("⏰ Time to: " + task.innerText);
            }, 1000);
            task.setAttribute("data-last-alert", currentTime);
        }

        if(repeat > 0){
            let diff = currentMinutes - taskMinutes;

            if(diff >= 0 && diff % repeat === 0 && lastAlert !== currentMinutes.toString()){
                alarmSound.play();
                alert("🔔 Reminder: " + task.innerText);
                task.setAttribute("data-last-alert", currentMinutes.toString());
            }
        }

    });

}, 60000);