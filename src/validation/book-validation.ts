import * as v from 'valibot'

export class BookValidation {
    static readonly CREATE = v.object({
        title: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
        author: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
        rating: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(5))),
        cover: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(256))),
    })

    static readonly UPDATE = v.object({
        title: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
        author: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
        rating: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(5))),
        cover: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(256))),
    })
}
