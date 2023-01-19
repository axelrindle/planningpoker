import { dirname } from 'path'
import {default as _glob, IOptions} from 'glob'

export function cwd(meta: string): string {
    return dirname(new URL(meta).pathname)
}

export function glob(pattern: string, opts: IOptions = {}): Promise<string[]> {
    return new Promise((resolve, reject) => {
        _glob(pattern, opts, (err, matches) => {
            if (err) reject(err)
            else resolve(matches)
        })
    })
}
