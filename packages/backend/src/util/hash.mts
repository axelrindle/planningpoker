import { compare, genSalt, hash as genHash } from 'bcrypt'

const BCRYPT_ROUNDS = 10

export async function hash(plain: string): Promise<string> {
    const salt = await genSalt(BCRYPT_ROUNDS)
    return await genHash(plain, salt)
}

export async function checkHash(hash: string, plain?: string): Promise<boolean> {
    if (!plain) return false
    return await compare(plain, hash)
}
