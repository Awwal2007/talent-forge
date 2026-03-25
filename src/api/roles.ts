import { client } from "./client"

export const roles = {
    getRoles: async () => {
        const res = await client.get("/User/roles");
        return res.data;
    },
    getUsers: async () => {
        const res = await client.get("/User");
        return res.data;
    }
}
