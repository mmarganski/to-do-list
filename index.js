let ToDoObjectsArray = []

document.getElementById('mainSubmitButton').setAttribute('onclick', createNewTodo)
document.getElementById('clearAllButton').setAttribute('onclick', clearAllTasks)

class toDoObject{
    constructor(input) {
        this.id = this.#createID()
        this.isDone = false
        this.text = input
    }

    #createID() {
        return String(Math.random().toFixed(6) * 1000000)
    }

    toggle() {
        this.isDone = !this.isDone
    }

    changeText(inputText) {
        this.text = inputText
    }
}

const clearAllTasks = () => {
    if (confirm("Are you sure you want to clear every task?")) {
        const allTasks = document.querySelectorAll("#toDoList li")

        ToDoObjectsArray = []
        allTasks.forEach(deleteTodo)
    }
}

const createNewTodo = () => {
    const inputValue = document.getElementById('mainInput').value

    if(inputValue.length > 0) {
        const newToDoObject = new toDoObject(inputValue)

        document.getElementById("mainInput").value = ""
        ToDoObjectsArray.push([newToDoObject.id, newToDoObject])
        newListElement(inputValue, newToDoObject.id)
        document.getElementById("clearAllButton").removeAttribute('hidden')
        printItems()
    }
}

const editTodo = currentListElement => {
    hideButtons(currentListElement)
    hideElement('checkBox', currentListElement)
    hideElement('textField', currentListElement)
    showElement('inputField', currentListElement)
    showElement('saveEditButton',currentListElement)
}

const editTodoText = currentListElement => {
    hideButtons(currentListElement)
    hideElement('inputField', currentListElement)
    showElement('editButton', currentListElement)
    showElement('deleteButton', currentListElement)
    showElement('checkBox', currentListElement)
    showElement('textField', currentListElement)

    const currentObject = getObjectFromDOMElement(currentListElement)
    const [inputFieldText] = currentListElement.getElementsByClassName('inputField')

    currentListElement.querySelector('span').innerText = inputFieldText.value
    currentObject.changeText(inputFieldText.value)
    printItems()
}

const getObjectFromDOMElement = currentListElement => {
    const id = currentListElement.getAttribute('id')
    const toDoObjectElement = ToDoObjectsArray.find(([elementId]) => elementId === id)

    if(toDoObjectElement) {
        const [, toDoObject] = toDoObjectElement

        return toDoObject
    }

    return null
}

const deleteTodo = currentListElement => {
    const id = currentListElement.getAttribute('id')

    ToDoObjectsArray.filter(([elementId]) => elementId !== id)
    currentListElement.remove()

    if(ToDoObjectsArray.length > 0) {
        document.getElementById("clearAllButton").setAttribute('hidden', true)
    }

    printItems()
}

const toggleTodo = currentListElement => {
    const currentObject = getObjectFromDOMElement(currentListElement)
    const [checkBox] = currentListElement.getElementsByClassName('checkBox')
    const [toDoText] = currentListElement.getElementsByClassName('textField')

    if(!checkBox.checked) {

        showElement('editButton', currentListElement)
        showElement('deleteButton', currentListElement)
        toDoText .style.setProperty('text-decoration', '');
        currentObject.toggle()
        printItems()

        return
    }

    hideButtons(currentListElement)
    toDoText.style.setProperty('text-decoration', 'line-through')
    currentObject.toggle()
    printItems()
}

const hideElement = (name, div) => {
    const [elementToHide] = div.getElementsByClassName(name)

    elementToHide.setAttribute('hidden', true)
}

const showElement = (name, div) => {
    const [elementToShow] = div.getElementsByClassName(name)

    elementToShow.removeAttribute('hidden')
}

const printItems = () => document.getElementById('debugger').innerText = JSON.stringify([...ToDoObjectsArray.entries()])

const hideButtons = currentListElement => currentListElement
    .querySelectorAll('button')
    .forEach(button => button.setAttribute('hidden', true))

const hideOptions = div => div.setAttribute('hidden', true)

const showOptions = div => div.removeAttribute('hidden')

const newListElement = (text, id) => {

    const checkbox = document.createElement('input')
    checkbox.setAttribute('type', 'checkbox')
    checkbox.setAttribute('class', 'checkBox')
    checkbox.addEventListener('change', () => toggleTodo(li))

    const inputField = document.createElement('input')
    inputField.setAttribute('hidden', true)
    inputField.setAttribute('class', 'inputField')
    inputField.value = text

    const editButton = document.createElement('button')
    editButton.setAttribute('class', 'editButton')
    editButton.addEventListener('click', () => editTodo(li))
    editButton.textContent = 'edit'

    const saveEditButton = document.createElement('button')
    saveEditButton.setAttribute('hidden', true)
    saveEditButton.setAttribute('class', 'saveEditButton')
    saveEditButton.addEventListener('click', () => editTodoText(li))
    saveEditButton.textContent = 'save'

    const deleteButton = document.createElement('button')
    deleteButton.setAttribute('class', 'deleteButton')
    deleteButton.addEventListener('click', () => deleteTodo(li))
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
    li.addEventListener('mouseover', () => showOptions(div))
    li.addEventListener('mouseout', () => {
        if(inputField.hidden) {
            hideOptions(div)
        }
    })

    document.getElementById('toDoList').appendChild(li)

}
