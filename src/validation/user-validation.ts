import * as v from 'valibot'

export class UserValidation {
    static readonly REGISTER = v.object({
        username: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
        password: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
        name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
    })
}
