const todoList2 = [];

const todoListElement2 = document.querySelector("#myUL2");

document.querySelector("#add_button2").addEventListener("click", addTodo2);
document.querySelector("#myInput2").addEventListener("keydown", function(e) {
  if (e.keyCode == 13) {
    addTodo2()
  }
});

//-------GETTING VALUES FROM INPUT TO ARRAY OF OBJECTS-------
function addTodo2() {
  const todoText = document.querySelector("#myInput2").value;

  if (todoText == "") {
    alert("You did not enter any item");
  } else {
    const todoObject = {
      id: todoList2.length,
      todoText: todoText,
      isDone: false,
    };

    //---WITH UNSHIFT WE ADD THE NEW ELEMENT TO THE BEGINNING OF THE ARRAY
    //--SO THAT THE NEW ITEMS SHOW UP ON TOP
    todoList2.unshift(todoObject);
    displayTodos();
  }
}

//------CHANGING THE isDone VALUE TO TRUE WHEN THE ELEMENT IS CLICKED
//------OR TO FALSE IF IT WAS TRUE BEFORE
function doneTodo(todoId) {
  const selectedTodoIndex = todoList2.findIndex((item) => item.id == todoId);

  todoList2[selectedTodoIndex].isDone
    ? (todoList2[selectedTodoIndex].isDone = false)
    : (todoList2[selectedTodoIndex].isDone = true);
  displayTodos();
}

//----TO DELETE AN ITEM; FROM THE LIST
function deleteItem(x) {
  todoList2.splice(
    todoList2.findIndex((item) => item.id == x),
    1
  );
  displayTodos();
}

//---------DISPLAYING THE ENTERED ITEMS ON THE SCREEN------
function displayTodos() {
  todoListElement2.innerHTML = "";
  document.querySelector("#myInput2").value = "";

  todoList2.forEach((item) => {
    const listElement = document.createElement("li");
    const delBtn = document.createElement("i");

    listElement.innerHTML = item.todoText;
    listElement.setAttribute("data-id", item.id);

    delBtn.setAttribute("data-id", item.id);
    delBtn.classList.add("far");
    delBtn.classList.add("fa-trash-alt");
    delBtn.setAttribute("data-id", item.id);

    if (item.isDone) {
      listElement.classList.add("checked");
    }

    listElement.addEventListener("click", function (e) {
      const selectedId = e.target.getAttribute("data-id");
      doneTodo(selectedId);
    });

    delBtn.addEventListener("click", function (e) {
      const delId = e.target.getAttribute("data-id");
      deleteItem(delId);
    });

    todoListElement2.appendChild(listElement);
    listElement.appendChild(delBtn);
  });
}