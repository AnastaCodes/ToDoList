const mainContainer = document.querySelector(".body-container ul");
const footerContainer = document.querySelector(".footer-container");
const inputItem = document.querySelector("#add");
const addItem = document.querySelector("#addItem");
const deleteAll = document.querySelector("#deleteAll");
const deleteCompleted = document.querySelector("#deleteCompleted");

let val = 0;

function createLi(inputId, inputValue) {
  const li = document.createElement("li");
  li.innerHTML = `
     <div class="input-container">
        <input type="checkbox" id="${inputId}" />
        <label for="${inputId}">${inputValue}</label>
    </div>
     <button id="deleteItem">
        <i class="fa-solid fa-xmark"></i>
     </button>`;
   mainContainer.appendChild(li);
}

addItem.addEventListener("submit", addNewItem);

deleteAll.addEventListener("click", () => {
  mainContainer.innerHTML = "";
  val = 0;
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
  if (event.target.parentNode.id === "deleteItem") {
    currentItem.closest("li").remove();
    checkMainContainer();
  }
});




function addNewItem(event) {
  event.preventDefault();
  if (inputItem.value === "") {
    return;
  }
  val++;
  let inputValue = inputItem.value;
  let inputId = "checkbox-" + val;
  createLi(inputId, inputValue);
  inputItem.value = "";
  checkMainContainer()
}

function checkMainContainer(){
    if(mainContainer.querySelectorAll("li").length > 0){
        mainContainer.style.display = "block";
        footerContainer.style.display = "flex";
        footerContainer.style.opacity = "1";
    }else{
        mainContainer.style.display = "none";
        footerContainer.style.display = "none";
        footerContainer.style.opacity = "0";
    }
}
