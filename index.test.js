const {Todo} = require('./src/todo')

describe('Todo class', () => {
    test('should return string in correct format', () => {
        const testTodo1 = new Todo('testinput1')
        expect(testTodo1.toString()).toBe('[ ] testinput1')

        const testTodo2 = new Todo('testinput2')
        expect(testTodo2.toString()).toBe('[ ] testinput2')
    } )

    test(`should properly toggle` , () => {
        const testTodo1 = new Todo('lorem ipsum')
        testTodo1.toggle()
        expect(testTodo1.toString()).toBe('[x] lorem ipsum')

        const testTodo2 = new Todo(null)
        expect(testTodo2.toString()).toBe('[ ] ')
    } )

    test(`shouldn't crash with incorrect input` , () => {
        const testTodo1 = new Todo('🕶🕶')
        expect(testTodo1.toString()).toBe('[ ] 🕶🕶')

        const testTodo2 = new Todo(null)
        testTodo2.toggle()
        expect(testTodo2.toString()).toBe('[x] ')
    } )

    test(`should properly change text` , () => {
        const testTodo1 = new Todo('lorem ipsum')
        testTodo1.changeText(`dolor set amet`)
        expect(testTodo1.toString()).toBe('[ ] dolor set amet')

        const testTodo2 = new Todo(null)
        testTodo2.toggle()
        testTodo2.changeText(`not null`)
        expect(testTodo2.toString()).toBe('[x] not null')
    } )

    test(`shouldn't access private methods` , () => {
        const testTodo1 = new Todo('lorem ipsum')
        const t = () => {
            try {
                return testTodo1.createID()
            }
            catch (e) {
                throw e
            }
        }
        expect(t).toThrowError()
    } )

    test(`shouldn't access private properties` , () => {
        const testTodo1 = new Todo('lorem ipsum')
        expect(testTodo1.text).toBe(undefined)
    } )
})