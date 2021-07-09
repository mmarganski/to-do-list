import Todo from "./todo.js";

class Todos {

    #toDoObjectsMap

    constructor(onChange) {
        this.#toDoObjectsMap = new Map()
        this.onChange = onChange
        window.localStorage.setItem('todos', '')
    }

    createNewTodo = text => {
        const newTodo = new Todo(text)

        this.#toDoObjectsMap.set(newTodo.id, newTodo)
        this.createNewListElement(text, newTodo.id)
        this.setDebuggerStrings()
        this.onChange()
    }

    clearAllTasks = () => {
        $("#toDoList").empty()
        this.#toDoObjectsMap.clear()
        this.setDebuggerStrings()
        this.onChange()
    }

    deleteTodo = id => {

        $(`#${id}`).detach()
        this.#toDoObjectsMap.delete(id)
        this.setDebuggerStrings()
        this.onChange()

        if(this.#toDoObjectsMap.keys().length === 0) {
            $("#clearAllButton").attr('hidden', true)
        }
    }

    editTodo = id => {
        $(`#${id} :button`).hide()
        $(`#${id} .inputField`).show()
        $(`#${id} .saveEditButton`).show()
        $(`#${id} .textField`).hide()
        $(`#${id} .checkBox`).hide()
    }

    editTodoText = id => {
        const inputFieldText = $(`#${id} .inputField`).val()
        const editedTodo = this.#toDoObjectsMap.get(id)

        $(`#${id} .inputField`).hide()
        $(`#${id} :button`).show()
        $(`#${id} .saveEditButton`).hide()
        $(`#${id} .textField`).show()
        $(`#${id} .checkBox`).show()

        if(inputFieldText.length > 0) {
            $(`#${id} span`).text(inputFieldText)
            editedTodo.changeText(inputFieldText)
            this.setDebuggerStrings()
            this.onChange()
        }
    }

    toggleTodo = id => {
        const toggledTodo = this.#toDoObjectsMap.get(id)

        if(!$(`#${id} .checkBox`).is(':checked')) {
            $(`#${id} .editButton`).show()
            $(`#${id} .deleteButton`).show()
            $(`#${id} .textField`).css('text-decoration', '')
            toggledTodo.toggle()
            this.setDebuggerStrings()
            this.onChange()

            return
        }

        $(`#${id} :button`).hide()
        $(`#${id} .textField`).css('text-decoration', 'line-through')
        toggledTodo.toggle()
        this.setDebuggerStrings()
        this.onChange()
    }

    createNewListElement = (text, id) => {
        const checkbox = $('<input type="checkbox" class="checkBox">')
        checkbox.change(() => this.toggleTodo(id))

        const inputField = $(`<input class="inputField" value=${text} hidden>`)

        const editButton = $(`<button class="editButton">edit</button>`)
        editButton.click( () => this.editTodo(id))

        const saveEditButton = $(`<button class="saveEditButton" hidden>save</button>`)
        saveEditButton.click( () => this.editTodoText(id))

        const deleteButton = $(`<button class="deleteButton">delete</button>`)
        deleteButton.click( () => this.deleteTodo(id))

        const textField = $(`<span class="textField">${text}</span>`)

        const div = $('<div class="toDoItem" hidden/>').append(checkbox, inputField, editButton, saveEditButton, deleteButton, textField)

        const li = $(`<li id="${id}"></li>`)

        li.append(div, textField)
        li.hover(() => div.show(), () => {
            if(inputField.is(":hidden")){
                div.hide()
            }
        })

        $("#toDoList").append(li)
    }

    setDebuggerStrings = () => {
        const strings = []

        this.#toDoObjectsMap.forEach(todo => strings.push(todo.toString()))
        window.localStorage.setItem('todos', strings.join(' \r\n '))
    }
}

export default Todos
