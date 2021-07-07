class App {

    #todos

    constructor() {
        this.todos = new Todos(() => this.printItems())
        document.getElementById('mainSubmitButton').setAttribute('onclick', 'myApp.createNewTodo()')
        document.getElementById('clearAllButton').setAttribute('onclick', 'myApp.clearAllTasks()')
    }

    clearAllTasks = () => {
        if (confirm("Are you sure you want to clear every task?")) {
            this.todos.clearAllTasks()
            this.printItems()
            document.getElementById("clearAllButton").setAttribute('hidden', true)
        }
    }

    createNewTodo = () => {
        const inputValue = document.getElementById('mainInput').value

        if(inputValue.length > 0) {
            this.todos.createNewTodo(inputValue.substring(0, 140))
            this.printItems()
            document.getElementById("mainInput").value = ""
            document.getElementById("clearAllButton").removeAttribute('hidden')
        }
    }

    printItems() {
        document.getElementById('debugger').innerText = window.localStorage.getItem('todos')
    }
}

class Todos {

    #toDoObjectsMap

    constructor( onChange) {
        this.toDoObjectsMap = new Map()
        this.onChange = onChange

        window.localStorage.setItem('todos', '')
    }

    createNewTodo = text => {
        const newTodo = new Todo(text)

        this.toDoObjectsMap.set(newTodo.id, newTodo)
        this.createNewListElement(text, newTodo.id)
        this.setDebuggerStrings()
        this.onChange()
    }

    clearAllTasks = () => {
        const allTasks = document.querySelectorAll("#toDoList li")

        this.toDoObjectsMap.clear()
        allTasks.forEach(this.deleteTodo)
    }

    deleteTodo = currentListElement => {
        const id = currentListElement.getAttribute('id')

        this.toDoObjectsMap.delete(id)
        currentListElement.remove()
        this.setDebuggerStrings()
        this.onChange()

        if(this.toDoObjectsMap.keys().length === 0) {
            document.getElementById("clearAllButton").setAttribute('hidden', true)
        }
    }

    showOptions = div => div.removeAttribute('hidden')

    hideOptions = div => div.setAttribute('hidden', true)

    hideButtons = currentListElement => currentListElement
        .querySelectorAll('button')
        .forEach(button => button.setAttribute('hidden', true))

    showElement = (name, div) => {
        const [elementToShow] = div.getElementsByClassName(name)

        elementToShow.removeAttribute('hidden')
    }

    hideElement = (name, div) => {
        const [elementToHide] = div.getElementsByClassName(name)

        elementToHide.setAttribute('hidden', true)
    }

    editTodo = currentListElement => {
        this.hideButtons(currentListElement)
        this.hideElement('checkBox', currentListElement)
        this.hideElement('textField', currentListElement)
        this.showElement('inputField', currentListElement)
        this.showElement('saveEditButton', currentListElement)
    }

    editTodoText = currentListElement => {
        this.hideButtons(currentListElement)
        this.hideElement('inputField', currentListElement)
        this.showElement('editButton', currentListElement)
        this.showElement('deleteButton', currentListElement)
        this.showElement('checkBox', currentListElement)
        this.showElement('textField', currentListElement)

        const id = currentListElement.getAttribute('id')
        const [inputFieldText] = currentListElement.getElementsByClassName('inputField')
        const editedTodo = this.toDoObjectsMap.get(id)

        if(inputFieldText.value.length > 0) {
            currentListElement.querySelector('span').innerText = inputFieldText.value
            editedTodo.changeText(inputFieldText.value)
            this.setDebuggerStrings()
            this.onChange()
        }
    }

    toggleTodo = currentListElement => {
        const [checkBox] = currentListElement.getElementsByClassName('checkBox')
        const [toDoText] = currentListElement.getElementsByClassName('textField')
        const id = currentListElement.getAttribute('id')
        const toggledTodo = this.toDoObjectsMap.get(id)

        if(!checkBox.checked) {

            this.showElement('editButton', currentListElement)
            this.showElement('deleteButton', currentListElement)
            toDoText .style.setProperty('text-decoration', '')
            toggledTodo.toggle()
            this.setDebuggerStrings()
            this.onChange()

            return
        }

        this.hideButtons(currentListElement)
        toDoText.style.setProperty('text-decoration', 'line-through')
        toggledTodo.toggle()
        this.setDebuggerStrings()
        this.onChange()
    }

    createNewListElement = (text, id) => {

        const checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.setAttribute('class', 'checkBox')
        checkbox.addEventListener('change', () => this.toggleTodo(li))

        const inputField = document.createElement('input')
        inputField.setAttribute('hidden', true)
        inputField.setAttribute('class', 'inputField')
        inputField.value = text

        const editButton = document.createElement('button')
        editButton.setAttribute('class', 'editButton')
        editButton.addEventListener('click', () => this.editTodo(li))
        editButton.textContent = 'edit'

        const saveEditButton = document.createElement('button')
        saveEditButton.setAttribute('hidden', true)
        saveEditButton.setAttribute('class', 'saveEditButton')
        saveEditButton.addEventListener('click', () => this.editTodoText(li))
        saveEditButton.textContent = 'save'

        const deleteButton = document.createElement('button')
        deleteButton.setAttribute('class', 'deleteButton')
        deleteButton.addEventListener('click', () => this.deleteTodo(li))
        deleteButton.textContent = 'delete'

        const textField = document.createElement('span')
        textField.setAttribute('class', 'textField')
        textField.innerText = text

        const div = document.createElement('div')
        div.setAttribute('class', 'toDoItem')
        div.appendChild(checkbox)
        div.appendChild(inputField)
        div.appendChild(saveEditButton)
        div.appendChild(editButton)
        div.appendChild(deleteButton)
        div.setAttribute('hidden', true)

        const li = document.createElement('li')
        li.setAttribute('id', id)
        li.appendChild(div)
        li.appendChild(textField)
        li.addEventListener('mouseover', () => this.showOptions(div))
        li.addEventListener('mouseout', () => {
            if(inputField.hidden) {
                this.hideOptions(div)
            }
        })

        document.getElementById('toDoList').appendChild(li)
    }

    setDebuggerStrings = () => {
        const strings = []

        this.toDoObjectsMap.forEach( todo => strings.push(todo.toString()))
        window.localStorage.setItem('todos', strings.join(' \r\n '))
    }
}

class Todo {

    #id
    #isDone
    #text

    constructor(input) {
        this.id = this.#createID()
        this.isDone = false
        this.text = input
    }

    #createID = () => {
        return String(Math.random().toFixed(6) * 1000000)
    }

    toggle = () => {
        this.isDone = !this.isDone
    }

    changeText = inputText => {
        this.text = inputText
    }

    toString = () => {
        return `[${this.isDone ? "х" : " "}] ${this.text}`
    }
}

const myApp = new App()
