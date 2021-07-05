const toDoObjectsArray =[]
document.getElementById('mainSubmitButton').setAttribute('onclick','newToDoItem()')
document.getElementById('clearAllButton').setAttribute('onclick','clearAll()')

class toDoObject{
    constructor(input) {
        this.id = String(Math.random().toFixed(6) * 1000000)
        this.isDone = false
        this.text = input
    }
    check() {
        this.isDone === true
            ? this.isDone = false
            : this.isDone = true
    }
    changeText(input) {
        this.text = input
    }
}

const clearAll = () => {
    if (confirm("Are you sure you want to clear every task?")) {
        const allTasks = document.querySelectorAll("#toDoList li")
        toDoObjectsArray.splice(0,toDoObjectsArray.length)
        allTasks.forEach((task) => deleteItem(task))
    }
}

const newToDoItem = () => {
    const input = document.getElementById('mainInput').value
    if(input.length>0) {
        const newToDoObject = new toDoObject(input)

        document.getElementById("mainInput").value = ""
        toDoObjectsArray.push([newToDoObject.id,newToDoObject])
        newListElement(input, newToDoObject.id)
        document.getElementById("clearAllButton").removeAttribute('hidden')
        printItems()
    }
}

const editItem = currentListElement =>{
    hideButtons(currentListElement)
    hideElement('checkBox',currentListElement)
    hideElement('textField',currentListElement)
    showElement('inputField',currentListElement)
    showElement('saveEditButton',currentListElement)
}

const saveEdit = currentListElement => {
    hideButtons(currentListElement)
    hideElement('inputField',currentListElement)
    showElement('editButton',currentListElement)
    showElement('deleteButton',currentListElement)
    showElement('checkBox',currentListElement)
    showElement('textField',currentListElement)

    const newText = currentListElement.getElementsByClassName('inputField')[0].value
    const currentObject = getObjectFromDOMElement(currentListElement)

    currentListElement.querySelector('span').innerText=newText
    currentObject.changeText(newText)
    printItems()
}

const getObjectFromDOMElement = (currentListElement)=>{
    const id = currentListElement.getAttribute('id')
    return toDoObjectsArray.find(([elementId,element]) => elementId === id)[1]
}

const deleteItem= currentListElement => {
    const id = currentListElement.getAttribute('id')
    const currentIndex = toDoObjectsArray.findIndex(([elementId,element]) => elementId === id)
    const newArray = toDoObjectsArray.filter((element,index) => index !== currentIndex)

    toDoObjectsArray.splice(0,toDoObjectsArray.length)
    newArray.forEach(element => toDoObjectsArray.push(element))
    currentListElement.remove()
    if(toDoObjectsArray.length===0){
        document.getElementById("clearAllButton").setAttribute('hidden','true')
    }
    printItems()
}


const check = currentListElement => {
    const currentObject = getObjectFromDOMElement(currentListElement)

    if(currentListElement.getElementsByClassName('checkBox')[0].checked) {
        hideButtons(currentListElement)
        currentListElement.getElementsByClassName('textField')[0].style.setProperty('text-decoration', 'line-through');
        currentObject.check()
        printItems()
    }
    else {
        showElement('editButton',currentListElement)
        showElement('deleteButton',currentListElement)
        currentListElement.getElementsByClassName('textField')[0].style.setProperty('text-decoration', '');
        currentObject.check()
        printItems()
    }
}

const printItems = () => document.getElementById('debugger').innerText=JSON.stringify([...toDoObjectsArray.entries()])

const hideElement = (name, div) => div.getElementsByClassName(name)[0].setAttribute('hidden','true')

const showElement = (name, div) => div.getElementsByClassName(name)[0].removeAttribute('hidden')

const hideButtons = currentListElement => currentListElement.querySelectorAll('button').forEach((button) => button.setAttribute('hidden','true'))

const hideOptions = div => div.setAttribute('hidden','true')

const showOptions = div => div.removeAttribute('hidden')

const newListElement = (text,id) => {

    const checkbox = document.createElement('input')
    checkbox.setAttribute('type','checkbox')
    checkbox.setAttribute('class','checkBox')
    checkbox.addEventListener('change', () => check(li))

    const inputField = document.createElement('input')
    inputField.setAttribute('hidden','true')
    inputField.setAttribute('class','inputField')
    inputField.value=text

    const editButton = document.createElement('button')
    editButton.setAttribute('class','editButton')
    editButton.addEventListener('click', () => editItem(li))
    editButton.textContent ='edit'

    const saveEditButton = document.createElement('button')
    saveEditButton.setAttribute('hidden','true')
    saveEditButton.setAttribute('class','saveEditButton')
    saveEditButton.addEventListener('click', () => saveEdit(li))
    saveEditButton.textContent ='save'

    const deleteButton = document.createElement('button')
    deleteButton.setAttribute('class','deleteButton')
    deleteButton.addEventListener('click', () => deleteItem(li))
    deleteButton.textContent='delete'

    const textField = document.createElement('span')
    textField.setAttribute('class','textField')
    textField.innerText=text

    const div = document.createElement('div')
    div.setAttribute('class','toDoItem')
    div.appendChild(checkbox)
    div.appendChild(inputField)
    div.appendChild(saveEditButton)
    div.appendChild(editButton)
    div.appendChild(deleteButton)
    div.setAttribute('hidden','true')

    const li = document.createElement('li')
    li.setAttribute('id',id)
    li.appendChild(div)
    li.appendChild(textField)
    li.addEventListener('mouseover',() => showOptions(div))
    li.addEventListener('mouseout',() => {
        if(inputField.hidden === true) {
            hideOptions(div)
        }
    })
    document.getElementById('toDoList').appendChild(li)

}




