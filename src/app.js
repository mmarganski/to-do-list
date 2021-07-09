import {Todos} from './todos.js';

class App {
    #todos

    constructor() {
        this.#todos = new Todos(this.printItems)
        $('#clearAllButton').click(this.clearAllTasks)
        $('#mainSubmitButton').click(this.createNewTodo)
    }

    clearAllTasks = () => {
        if (confirm('Are you sure you want to clear every task?')) {
            this.#todos.clearAllTasks()
            this.printItems()
            $('#clearAllButton').attr('hidden', true)
        }
    }

    createNewTodo = () => {
        const inputValue = $('#mainInput').val()

        if(inputValue.length > 0) {
            this.#todos.createNewTodo(inputValue.substring(0, 140))
            this.printItems()
            $('#mainInput').val('')
            $('#clearAllButton').show()
        }
    }

    printItems() {
        $('#debugger').text(window.localStorage.getItem('todos'))
    }
}

export {App}
