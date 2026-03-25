import { useQuery } from "@tanstack/react-query"
import { roles } from "../roles"

export const useGetRole = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: () => roles.getRoles()
    })
}

export const useGetUser = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => roles.getUsers()
    })
}
