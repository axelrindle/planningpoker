import { IConfig } from 'config'
import morgan from 'morgan'
import { Writable as WritableStream } from 'node:stream'
import { Logger } from 'winston'

class PipeStream extends WritableStream {

    private logger: Logger

    constructor(logger: Logger) {
        super()

        this.logger = logger
    }

    override _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null | undefined) => void): void {
        let data = Buffer.from(chunk, encoding).toString('ascii')
        if (data.endsWith('\n')) {
            data = data.replace(/\n$/, '')
        }

        this.logger.info(data)
        callback()
    }

}

export default function requestLogger(config: IConfig, logger: Logger) {
    return morgan(config.get('logging.http.format'), {
        stream: new PipeStream(logger)
    })
}
