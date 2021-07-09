class Todo {
    id
    #isDone
    #text

    constructor(input) {
        this.id = this.#createID()
        this.#isDone = false
        this.#text = typeof input === 'string'
            ? input
            : ''
    }

    #createID = () => {
        return String(Math.random().toFixed(6) * 1000000)
    }

    toggle = () => {
        this.#isDone = !this.#isDone
    }

    changeText = inputText => {
        this.#text = inputText
    }

    toString = () => {
        return `[${this.#isDone ? 'x' : ' '}] ${this.#text}`
    }
}

export {Todo}
