import { dirname } from 'path'

export function cwd(meta: string): string {
    return dirname(new URL(meta).pathname)
}
