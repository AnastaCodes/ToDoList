const mainContainer = document.querySelector(".body-container ul");
const footerContainer = document.querySelector(".footer-container");
const deleteCompleted = document.querySelector("#deleteCompleted");
const inputItem = document.querySelector("#add");
const addItem = document.querySelector("#addItem");
const deleteAll = document.querySelector("#deleteAll");

let checkboxId = 0;
let editing = false;

function createLi(inputId, inputValue) {
  const li = document.createElement("li");
  li.innerHTML = `
     <div class="input-container">
        <input type="checkbox" id="${inputId}" />
        <label for="${inputId}">${inputValue}</label>
    </div>
    <button id="editItem">
        <i class="fa-solid fa-pencil"></i>
     </button>
     <button id="deleteItem">
        <i class="fa-solid fa-xmark"></i>
     </button>
     `;
  mainContainer.appendChild(li);
}

addItem.addEventListener("submit", addNewItem);

deleteAll.addEventListener("click", () => {
  mainContainer.innerHTML = "";
  checkboxId = 0;
  checkMainContainer();
});

deleteCompleted.addEventListener("click", () => {
  mainContainer.querySelectorAll("li").forEach((el) => {
    if (el.querySelector("input").checked === true) {
      el.remove();
    }
  });
  checkMainContainer();
});

mainContainer.addEventListener("click", (event) => {
  const currentItem = event.target;
  const parentLi = currentItem.closest("li");

  // если нажат крестик
  if (event.target.parentNode.id === "deleteItem") {
    currentItem.closest("li").remove();
    checkMainContainer();
  }

  //если пока не редактируется
  if (event.target.parentNode.id === "editItem" && editing === false) {
    newItem(parentLi, event);
    return;
  }

  //если уже редактируется
  if (event.target.parentNode.id === "editItem" && editing === true) {
      const currentLi = document.querySelector(".fa-square-check");
      const currentParentLi = currentLi.closest("li");

      if (parentLi === currentParentLi) {
        const inputCurrent = parentLi.querySelector("input#edit").value;
        event.target.classList.add("fa-pencil");
        event.target.classList.remove("fa-square-check");
        editing = false;

        //если значение input не равно 0
        if (inputCurrent) {
          parentLi.querySelector("label").innerHTML = inputCurrent;
        } else {
          currentItem.closest("li").remove();
          checkMainContainer();
        }
      } else {
        const altLabel = currentParentLi.querySelector("label");
        const inputCurrent = currentParentLi.querySelector("input#edit").value;
        altLabel.innerHTML = inputCurrent;
        currentLi.classList.add("fa-pencil");
        currentLi.classList.remove("fa-square-check");
        editing = false;
        newItem(parentLi, event);
      }
    return;
  }
});

function newItem(parentLi, event) {
  const altLabel = parentLi.querySelector("label");
  event.target.classList.add("fa-square-check");
  event.target.classList.remove("fa-pencil");
  editing = true;
  let altLabelValue = altLabel.innerHTML;
  let tempInput = `<input type="text" id="edit"  value="${altLabelValue}" />`;
  altLabel.innerHTML = tempInput;
}


function addNewItem(event) {
  event.preventDefault();
  if (inputItem.value === "") {
    return;
  }
  checkboxId++;
  let inputValue = inputItem.value;
  let inputId = "checkbox-" + checkboxId;
  createLi(inputId, inputValue);
  inputItem.value = "";
  checkMainContainer();
}

function checkMainContainer() {
  if (mainContainer.querySelectorAll("li").length > 0) {
    mainContainer.style.display = "block";
    footerContainer.style.display = "flex";
    footerContainer.style.opacity = "1";
  } else {
    mainContainer.style.display = "none";
    footerContainer.style.display = "none";
    footerContainer.style.opacity = "0";
  }
}
