const form = document.querySelector("#addItem");
const ul = document.querySelector("#body-container ul");
const input = document.querySelector("#add");
const btnDeleteAll = document.querySelector("#deleteAll");
const btnDeleteComplete = document.querySelector("#deleteCompleted");
const footerContainer = document.querySelector(".footer-container");

let localArr = []; //пустой массив для хранения задач и работы с LocalStoarge
let editing = false; //активное редактирование задачи
let currentlyEditingTask = null; //переменная, котоая нужна для того, чтобы сохранять текущую задачу во время клика на другую задачу

//добавление новой задачи
form.addEventListener("submit", function (event) {
  event.preventDefault(); //отменяем стандартное действие события "submit"
  if (input.value === "") {
    return; //если ничего не ввели, то прерываем выполнение функции
  }
  let id = new Date(); //объект Date содержит число миллисекунд, прошедших с полуночи (00:00:00 UTC) 1 января 1970 года
  id = id.getTime(); //возвращает числовое значение, соответствующее указанной дате по всемирному координированному времени
  addTask(input.value, id, (isDone = false)); //функция добавления новой задачи с передаваемыми в нее параметрами: значение в инпуте, айди, сделанна ли задача (по дефолту - не сделана)
  localArr.push({ //пушим в localArr наш новый обьект
    textTask: input.value,
    isDone: false,
    idTask: id,
  });
  localStorage.setItem("toDoList", JSON.stringify(localArr)); //назначаем ключу "toDoList" значение, приведенное к localArr строке
  input.value = ""; // Возвращает пустое поле в input
});

//функция добавления с тремя параметрами, которые являютсяя ключами массива из 21-ой строки
function addTask(text, id, isDone) {
  let task = document.createElement("li"); //создаём li
  /* ${isDone? "check" : ""}" //класс для управления состоянием выполнения задания ${isDone? "checked" : ""} //для показывания галочки */
  task.innerHTML = `
    <div class="input-container">
        <input class="checkbox ${isDone? "check" : ""}" id="${id}" type="checkbox" ${isDone? "checked" : ""}> 
            <label class="checkboxLabel" for="${id}">
                ${text}
            </label> 
        </div>
        <button class="editItem">
        <i class="fa-solid fa-pencil"></i>
     </button>
    <button class="deleteItem">
      <i class="fa-solid fa-xmark"></i>
    </button>`;

ul.append(task); //добавляем наш li в ul
  deleteTask(task); //вызываем наши функции с различными слушателями событий
  checkTask(task);
  editTask(task);
  checkUl();
 // localStorage.setItem("id", "task"); // 
}

//редактирование записи, в функцию передается task - li
function editTask(task) {
  const editItem = task.querySelector(".editItem"); 

  editItem.addEventListener("click", function () {
    if (!editing) {
      startEditing(task, editItem);
    } else {
      if (currentlyEditingTask !== task) {
        saveCurrentTask();
        startEditing(task, editItem);
      } else {
        saveCurrentTask();
      }
    }
  });
}

function startEditing(task, editItem) {
  editItem.firstElementChild.classList.add("fa-square-check");
  editItem.firstElementChild.classList.remove("fa-pencil");
  editing = true;

  //закомментить всё
  currentlyEditingTask = task;
  const altLabel = task.querySelector("label");
  const altLabelValue = altLabel.innerText;
  let tempInput = `<input type="text" id="edit" value="${altLabelValue}" />`;
  altLabel.innerHTML = tempInput;
  editItem.removeEventListener("click", editTask); //подробнее изучить
  editItem.addEventListener("click", saveCurrentTask);
  //менять localstoarge при каждом введенном символе
}

function saveCurrentTask() {
  if (currentlyEditingTask) {
    const editItem = currentlyEditingTask.querySelector(".editItem");
    const altLabel = currentlyEditingTask.querySelector("label");
    const inputValue = currentlyEditingTask.querySelector("input#edit").value;
    const id = currentlyEditingTask.querySelector(".checkbox").id;
    currentItem = localArr.find((el) => el.idTask === +id);
    currentItem.textTask = inputValue;
    altLabel.innerText = inputValue;
    localStorage.setItem("toDoList", JSON.stringify(localArr));
    editItem.firstElementChild.classList.add("fa-pencil");
    editItem.firstElementChild.classList.remove("fa-square-check");
    editing = false;
    currentlyEditingTask = null;
  }
  //через enter или через клик вне поля (потеря фокуса)
}

// красный крестик
function deleteTask(task) {
  let deleteItem = task.querySelector(".deleteItem");
  deleteItem.addEventListener("click", function () {
    let id = task.querySelector(".checkbox").id;
    localArr = localArr.filter((el) => el.idTask !== +id); // +id превращает из строки в число
    localStorage.setItem("toDoList", JSON.stringify(localArr));
    task.remove();
    checkUl();
  });
}

//Выполнено / не выполнено
function checkTask(task) {
  let check = task.querySelector(".checkbox");
  let id = task.querySelector("input").id;

  check.addEventListener("click", function () {
    check.classList.toggle("check");
    localArr = JSON.parse(localStorage.getItem("toDoList"));

    //Найти соотвествующую запись в массиве localArr по айди
    let currentTask = localArr.find((el) => el.idTask === +id);

    //поменять true и false
    if (currentTask) {
      currentTask.isDone = !currentTask.isDone;
    }
    localStorage.setItem("toDoList", JSON.stringify(localArr)); // Перезапись localStorage
  });
}

// Проверить количество записей в ul
function checkUl() {
  if (ul.querySelectorAll("li").length > 0) {
    ul.style.display = "block";
    footerContainer.style.display = "flex";
    footerContainer.style.opacity = "1";
  } else {
    ul.style.display = "none";
    footerContainer.style.display = "none";
    footerContainer.style.opacity = "0";
  }
}

// Удалить все
btnDeleteAll.addEventListener("click", function () {
  ul.innerHTML = ""; //заменяем все содердимое ul на пустоту
  localStorage.clear(); //очищаем весь localStorage
  checkUl();
});

// Удалить завершенные
btnDeleteComplete.addEventListener("click", function () {
  let checkedItems = document.querySelectorAll(".check");
  checkedItems.forEach((el) => el.parentElement.parentElement.remove());
  localArr = localArr.filter((el) => el.isDone === false);
  localStorage.setItem("toDoList", JSON.stringify(localArr));
  checkUl();
});

if (localStorage.getItem("toDoList")) {
  localArr = JSON.parse(localStorage.getItem("toDoList"));
  localArr.forEach((el) => addTask(el.textTask, el.idTask, el.isDone));
}