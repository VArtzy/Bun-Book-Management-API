import { users } from "../database/schema"

export type UserResponse = {
    username: string;
    name: string;
    token?: string;
}

export type CreateUserRequest = {
    username: string;
    name: string;
    password: string;
}

export function toUserResponse(user: typeof users.$inferSelect): UserResponse {
    return {
        username: user.username,
        name: user.name
    }
}
