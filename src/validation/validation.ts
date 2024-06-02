import { AnySchema, GenericSchema, parse } from 'valibot'

export class Validation {
    static validate<T> (schema: GenericSchema<T>, data: T): T {
        return parse(schema, data)
    }
}
