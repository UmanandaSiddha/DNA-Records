import API from "../config/apiConfig";
import { IUser } from "../types/type";

interface UserResponse {
    success: boolean;
    user: IUser;
};

export const signInUser = async (hiveUser: string, hivePublicKey: string) => {
    const { data }: { data: UserResponse } = await API.post("/user/sign-in", { hiveUser, hivePublicKey });
    return data;
}

export const userProfile = async () => {
    const { data }: { data: UserResponse } = await API.get("/user/me");
    return data;
}