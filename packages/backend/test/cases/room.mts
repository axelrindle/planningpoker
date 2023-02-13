import DatabaseService from '../../src/service/database.mjs'
import test from '../create-application.mjs'

test.serial('no rooms initially', async t => {
    const response = await fetch(`${t.context.apiUrl}/room`)
    const body = await response.json()

    t.true(Array.isArray(body))
    t.is(body.length, 0)
})

test.serial('read of not existing room returns a 404', async t => {
    const response = await fetch(`${t.context.apiUrl}/room/1337`)
    t.is(response.status, 404)
})

test.serial('create room', async t => {
    const response = await fetch(`${t.context.apiUrl}/room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Hello World',
            description: 'This Room is created in a test case.'
        })
    })
    t.is(response.status, 201)
    t.true(response.headers.has('Location'))
    t.true(response.headers.get('Location')?.startsWith('/api/room/'))
})

const updatesSuccessful = [
    {
        key: 'name',
        value: 'New Hello World'
    },
    {
        key: 'description',
        value: 'A new description'
    },
    {
        key: 'userLimit',
        value: 10
    }
]
for (const update of updatesSuccessful) {
    test.serial(`update room (single property: ${update.key})`, async t => {
        const response = await fetch(`${t.context.apiUrl}/room/1`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                [update.key]: update.value,
            })
        })
        t.is(response.status, 200)

        const database = t.context.container.resolve<DatabaseService>('database')
        const room = await database.querySingle(`select ${update.key} from room where id = 1`)
        t.is(room[update.key], update.value)
    })
}

test.serial('delete room', async t => {
    const response = await fetch(`${t.context.apiUrl}/room/1`, {
        method: 'DELETE'
    })
    t.is(response.status, 200)
})
