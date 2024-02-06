export type User = {
    id: number,
    username: string,
    name: string,
    last_name: string,
    password: string,
    email: string,
    group_id: number,
    group: "user" | "admin"
};

export type Group = {
    id: number,
    name: string
};

export interface Post {
    description: string,
    user_id: number,
    media_id: number
}