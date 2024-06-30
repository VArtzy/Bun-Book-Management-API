import pino from 'pino'

export const log = pino(pino.destination({
    dest: './logs/log',
    minLength: 4096,
    sync: false
}))
