export type User = {
    id: number,
    username: string,
    name: string,
    last_name: string,
    password: string,
    email: string,
    group_id: number,
    group: "user" | "admin",
    icon: string
};

export type Group = {
    id: number,
    name: string
};

export type Post = {
    id: number,
    description: string,
    user_id: number,
    media_id: number,
    likes: number,
    liked: boolean
}