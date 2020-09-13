const toDoform = document.querySelector(".toDoForm"),
    toDoInput = toDoform.querySelector("input"),
    toDoList = document.querySelector(".toDoList");

const TODOS = 'toDos';

let TODO_li = [];

function deleteToDo(event){
    const btn = event.target;
    const del_li = btn.parentNode;
    toDoList.removeChild(del_li);
    const TODO_clean = TODO_li.filter(function(toDo) {
        return toDo.id !== parseInt(del_li.id);
    });
    //console.log(TODO_clean);
    TODO_li = TODO_clean;
    saveToDo();
}

function saveToDo() {
    localStorage.setItem(TODOS, JSON.stringify(TODO_li));
}

function paintToDo(txt) {
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const span = document.createElement("span");
    const newId = TODO_li.length + 1;
    delBtn.innerText = "❌";
    delBtn.addEventListener("click", deleteToDo);
    span.innerText = txt;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.id = newId;
    toDoList.appendChild(li);

    const TODO_obj = {
        txt: txt,
        id: newId
    };
    TODO_li.push(TODO_obj);
    saveToDo();
}

function handleSubmit(event) {
    event.preventDefault();
    const currentVal = toDoInput.value;
    paintToDo(currentVal);
    toDoInput.value = "";
}

function loadToDos() {
    const TODO_loaded = localStorage.getItem(TODOS);
    if (TODO_loaded !== null) {
        const TODO_parsed = JSON.parse(TODO_loaded);
        TODO_parsed.forEach(function(el) {
            paintToDo(el.txt);
        });
    }
}

function init() {
    loadToDos();
    toDoform.addEventListener("submit", handleSubmit)
}

init();