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

test.serial('delete room', async t => {
    const responseRooms = await fetch(`${t.context.apiUrl}/room`)
    const rooms = await responseRooms.json()
    const roomId = rooms[0].id

    const response = await fetch(`${t.context.apiUrl}/room/${roomId}`, {
        method: 'DELETE'
    })
    t.is(response.status, 200)
})
