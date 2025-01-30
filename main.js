let input = document.querySelector(".input");
let contentTask = document.querySelector(".content");
let addBtn = document.querySelector(".add");
let tasksContainer = document.querySelector(".tasks-container")
let taskDetailWindow = document.querySelector(".task-detail-window")

let arrayOfTasks = [];


// check if i have an old data in my localStorage
if (window.localStorage.tasks) {
    arrayOfTasks = JSON.parse(window.localStorage.tasks);
    tasksContainer.innerHTML = "";
    addAllTasks();
} else {
    tasksContainer.innerHTML = "add Task to see it here";
}

// presse on the add task button
addBtn.onclick = function () {
    if (input.value !== '') {
        tasksContainer.innerHTML = "";
        createTask(input.value, contentTask.value);
        input.parentElement.style.outline = "2px solid blue";
        input.value = "";
        contentTask.value = "";
    } else {
        input.parentElement.style.outline = "2px solid red";
    }
}

tasksContainer.addEventListener("click", function (ele) {
    if (ele.target.className === "done-btn") {
        loadingScene();
        let geteleid = ele.target.parentElement.parentElement.getAttribute("data-id");
        ele.target.parentElement.parentElement.classList.toggle("done");
        modifyData(geteleid);
    }
    if (ele.target.className === "delete-btn") {
        let geteleid = ele.target.parentElement.parentElement.getAttribute("data-id");
        ele.target.parentElement.parentElement.remove();
        removeData(geteleid);
    }
    if (ele.target.className === "task") {
        let geteleid = ele.target.getAttribute("data-id");
        showTaskDetails(geteleid);
        taskDetailWindow.classList.add("active");
    } else if (ele.target.className === "task-content") {
        let geteleid = ele.target.parentElement.getAttribute("data-id");
        showTaskDetails(geteleid);
        taskDetailWindow.classList.add("active");
    }
})


taskDetailWindow.addEventListener("click", function (ele) {
    if (ele.target.classList.contains("task-detail-window")) {
        loadingScene();
        let getid = ele.target.getAttribute("data-id");
        let title = document.querySelector(".taskTitle");
        let content = document.querySelector(".taskContent");
        modifyTitleAndContent(title.value, content.value, getid);
        taskDetailWindow.classList.remove("active");
        taskDetailWindow.innerHTML = "";
    }
})

function addTaskToPage(taskTitle, taskId, taskDate, complated = false) {
    // create loading Scene first 
    let loading = document.createElement("div");
    loading.className = "loading-scene";
    loading.appendChild(document.createElement("span"));
    tasksContainer.appendChild(loading);
    // now create elemet
    let taskEle = document.createElement("li");
    taskEle.className = "task";
    taskEle.setAttribute("data-id", taskId);
    if (complated)
        taskEle.classList.add("done");

    // create data element 
    let dateele = document.createElement("span");
    dateele.className = "date";

    let dateContent = JSON.stringify(taskDate);
    dateContent = JSON.parse(dateContent).slice(0, 10);
    let time = JSON.stringify(taskDate);
    time = JSON.parse(time).slice(11, 16);

    dateele.appendChild(document.createTextNode(dateContent + " at " + time));
    taskEle.appendChild(dateele);
    taskEle.setAttribute("data-date", `${dateContent} + at + ${time}`);
    let taskcontent = document.createElement("p");
    taskcontent.appendChild(document.createTextNode(taskTitle));
    taskcontent.className = "task-content";
    taskEle.appendChild(taskcontent);

    let btns = document.createElement("div");
    btns.className = "btns";
    let donebtn = document.createElement("span");
    donebtn.appendChild(document.createTextNode("Done"))
    donebtn.className = "done-btn";
    btns.appendChild(donebtn)
    let dleletebtn = document.createElement("span");
    dleletebtn.appendChild(document.createTextNode("Delete"));
    dleletebtn.className = "delete-btn";
    btns.appendChild(dleletebtn)
    taskEle.appendChild(btns)

    tasksContainer.appendChild(taskEle);

}

function createTask(taskTitle, taskcontent) {
    let task = {
        id: randomId(),
        title: taskTitle,
        complated: false,
        date: new Date(),
        content: taskcontent,
    };
    arrayOfTasks.push(task);
    addAllTasks();
}

function randomId(start = 100, end = 999) {
    let randomNum = Math.trunc(Math.random() * (end - start) + 1) + start;
    for (let i = 0; i < arrayOfTasks.length; i++) {
        if (arrayOfTasks[i].id === randomId)
            randomId();
    }
    return randomNum;
}

function addAllTasks() {
    tasksContainer.innerHTML = "";
    window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks))
    for (let i = 0; i < arrayOfTasks.length; i++) {
        addTaskToPage(arrayOfTasks[i].title, arrayOfTasks[i].id, arrayOfTasks[i].date, arrayOfTasks[i].complated);
    }

}

function removeData(taskid) {
    arrayOfTasks = arrayOfTasks.filter(function (ele) {
        return ele.id != taskid;
    })
    window.localStorage.tasks = JSON.stringify(arrayOfTasks);
}
function modifyData(taskid) {
    for (let i = 0; i < arrayOfTasks.length; i++) {
        if (arrayOfTasks[i].id == taskid) {
            arrayOfTasks[i].complated === false ? arrayOfTasks[i].complated = true : arrayOfTasks[i].complated = false;
        }
    }
    window.localStorage.tasks = JSON.stringify(arrayOfTasks);
}

function modifyTitleAndContent(taskTitle, taskContent, taskId) {
    for (let i = 0; i < arrayOfTasks.length; i++) {
        if (arrayOfTasks[i].id == taskId) {
            arrayOfTasks[i].title = taskTitle;
            arrayOfTasks[i].content = taskContent;
        }
    }
    addAllTasks();
}


function loadingScene() {
    document.querySelector(".loading-scene").classList.add("active");
    setTimeout(function () {
        document.querySelector(".loading-scene").classList.remove("active");
    }, 400)
}

function createtaskDetail(taskTitle, taskContent, taskDate, taskId) {
    let taskDetail = document.createElement("div");
    taskDetail.className = "task-detail";

    let div = document.createElement("div");
    let title = document.createElement("input");
    title.className = "taskTitle";
    title.value = taskTitle;
    title.placeholder = "Title...";
    title.type = "text";

    let span = document.createElement("span");
    span.className = "taskDate";

    let date = JSON.stringify(taskDate);
    date = JSON.parse(date).slice(0, 10);
    let time = JSON.stringify(taskDate);
    time = JSON.parse(time).slice(11, 16);

    span.appendChild(document.createTextNode(date + " at " + time))
    div.appendChild(title);
    div.appendChild(span);
    let content = document.createElement("textarea");
    content.className = "taskContent";
    content.value = taskContent;
    title.placeholder = "Task Content...";

    taskDetail.appendChild(div);
    taskDetail.appendChild(content);
    taskDetailWindow.appendChild(taskDetail);
    taskDetailWindow.setAttribute("data-id", taskId);
}
function showTaskDetails(taskId) {
    for (let i = 0; i < arrayOfTasks.length; i++) {
        if (arrayOfTasks[i].id == taskId) {
            createtaskDetail(arrayOfTasks[i].title, arrayOfTasks[i].content, arrayOfTasks[i].date, arrayOfTasks[i].id)
        }
    }
}
