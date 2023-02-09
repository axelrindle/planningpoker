/* eslint-env node,commonjs */
module.exports = {
    data_directory: process.env['NODE_TEST_DATA_DIRECTORY'],
    server: {
        port: parseInt(process.env['NODE_TEST_SERVER_PORT']),
        socketPort: parseInt(process.env['NODE_TEST_SOCKET_PORT'])
    },
    logging: {
        level: 'debug'
    }
}
