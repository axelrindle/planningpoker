import chalk from 'chalk'
import config from 'config'
import { createLogger, format, Logger, transports } from 'winston'

const { combine, printf } = format

const extractAdditional = format(info => {
    const additional = Object.assign({}, info, {
        level: undefined,
        label: undefined,
        message: undefined,
        timestamp: undefined,
        stack: undefined,
        additional: undefined
    })

    if (JSON.stringify(additional) !== '{}') {
        info['additional'] = additional
    }

    return info
})

/**
 * Just the raw logging format without coloring.
 *
 * Looks like this: `[timestamp] [label] level: message`
 */
const baseFormat = () => {
    const myFormat = printf(info => {
        const label = info['label'] ? info['label'] : 'main' // default label is 'main'
        const prefix = chalk.dim('[' + info['timestamp'] + '] [' + label + ']')
        let base = `${prefix} ${info.level}: ${info.message}`
        if (info['stack']) {
            base += '\n' + info['stack']
        }
        if (info['additional']) {
            base += '\nAdditional context: ' + JSON.stringify(info['additional'], null, 4)
        }
        return base
    })

    return combine(
        format.timestamp({
            format: config.get('logging.timestamp')
        }),
        format.errors({ stack: true }),
        format.splat(),
        extractAdditional(),
        myFormat
    )
}

const logger = createLogger({
    format: combine(
        format.colorize(),
        baseFormat()
    ),
    levels: {
        'error': 0,
        'warn': 1,
        'info': 2,
        'debug': 3
    },
    level: config.has('logging.level') ? config.get('logging.level') : 'info',
    transports: [
        new transports.Console({
            silent: process.env['NODE_ENV'] === 'test'
        }),
        /*new transports.File({
            filename: config.get('logging.wog.file'),
            format: combine(baseFormat(), format.uncolorize())
        })*/
    ]
})

export default logger

export function makeLogger(label: string): Logger {
    return logger.child({ label })
}
