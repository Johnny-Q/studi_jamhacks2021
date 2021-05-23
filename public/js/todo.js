class TodoList {
    todolist = [];
    constructor(list_element, input_element, add_button) {
        this.list_element = list_element;
        this.input_element = input_element;
        this.add_button = add_button;
        this.add_button.addEventListener("click", () => {
            let todo = this.input_element.value;
            this.addTodo(todo);
            socket.emit("addTodo", todo);
        });
        this.input_element.addEventListener("keydown", (e) => {
            if (e.keyCode == 13) {
                let todo = this.input_element.value;
                this.addTodo(todo);
                socket.emit("addTodo", todo);
            }
        });
    }
    addTodo(todoText) {
        if (todoText == "") {
            alert("You did not enter any item");
        } else {
            const todoObject = {
                id: this.todolist.length,
                todoText: todoText,
                isDone: false,
            };

            //---WITH UNSHIFT WE ADD THE NEW ELEMENT TO THE BEGINNING OF THE ARRAY
            //--SO THAT THE NEW ITEMS SHOW UP ON TOP
            this.todolist.unshift(todoObject);
            this.displayTodos();
        }
    }
    doneTodo(todoId) {
        const selectedTodoIndex = this.todolist.findIndex((item) => item.id == todoId);

        this.todolist[selectedTodoIndex].isDone ? (this.todolist[selectedTodoIndex].isDone = false) : (this.todolist[selectedTodoIndex].isDone = true);
        this.displayTodos();
    }
    deleteItem(x) {
        this.todolist.splice(
            this.todolist.findIndex((item) => item.id == x),
            1
        );
        this.displayTodos();
    }
    displayTodos() {
        this.list_element.innerHTML = "";
        this.input_element.value = "";
        this.todolist.forEach((item) => {
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

            listElement.addEventListener("click", (e) => {
                const selectedId = e.target.getAttribute("data-id");
                this.doneTodo(selectedId);
                socket.emit("doneTodo", selectedId);
            });

            delBtn.addEventListener("click", (e) => {
                const delId = e.target.getAttribute("data-id");
                this.deleteItem(delId);
                socket.emit("deleteItem", delId);
            });

            this.list_element.appendChild(listElement);
            listElement.appendChild(delBtn);
        });
    }
}

selfList = new TodoList(document.querySelector("#myUL"), document.querySelector("#myInput"), document.querySelector("#add_button"));
partnerList = new TodoList(document.querySelector("#myUL2"), document.querySelector("#myInput2"), document.querySelector("#add_button2"));
