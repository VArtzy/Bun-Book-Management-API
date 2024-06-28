import * as v from 'valibot'

export class ReviewValidation {
    static readonly CREATE = v.object({
        body: v.pipe(v.string(), v.minLength(1), v.maxLength(1000)),
        rating: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(5))),
    })

    static readonly UPDATE = v.object({
        body: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(1000))),
        rating: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(5))),
    })

    static readonly SEARCH = v.object({
        body: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(1000))),
        rating: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(5))),
        username: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
        cursor: v.optional(v.number()),
        size: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100)))
    })
}
