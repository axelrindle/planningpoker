import chalk from 'chalk'
import config from 'config'
import { join } from 'path'
import { createLogger, format, Logger, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import TransportStream from 'winston-transport'
import { getStorageDirectory } from './service/storage.mjs'

const { combine, printf } = format

const plainFormat = printf(info => {
    const label = info['label'] ?? '???'
    const prefix = chalk.dim(`[${info['timestamp']}] [${label}]`)
    let base = `${prefix} ${info.level}: ${info.message}`
    if (info['stack']) {
        base += '\n' + info['stack']
    }
    return base
})
const timestampFormat = format.timestamp({
    format: config.get('logging.timestamp')
})

const thePlainFormat = combine(
    timestampFormat,
    format.colorize(),
    plainFormat,
)
const theJsonFormat = combine(
    timestampFormat,
    format.metadata({
        fillExcept: ['label', 'level', 'timestamp', 'message']
    }),
    format.uncolorize(),
    format.json(),
)
const theFileFormat = combine(
    timestampFormat,
    plainFormat,
    format.uncolorize(),
)

function getFormat() {
    const it = config.get('logging.format')
    switch (it) {
        case 'plain':
            return thePlainFormat
        case 'json':
            return theJsonFormat
        default:
            throw new Error(`Invalid logging format "${it}" !`)
    }
}

function getTransports(): TransportStream[] {
    const def: TransportStream[] = [
        new transports.Console({
            silent: !config.get('logging.transports.console')
        }),
        new DailyRotateFile({
            silent: !config.get('logging.transports.file'),
            format: theFileFormat,
            zippedArchive: true,
            maxFiles: 10,
            dirname: join(getStorageDirectory(config), 'logs'),
            watchLog: true,
        })
    ]

    return def
}

const logger = createLogger({
    format: getFormat(),
    levels: {
        'error': 0,
        'warn': 1,
        'info': 2,
        'debug': 3
    },
    silent: !config.get('logging.enabled'),
    level: config.has('logging.level') ? config.get('logging.level') : 'info',
    transports: getTransports()
})

export default logger

export function makeLogger(label: string): Logger {
    return logger.child({ label })
}
