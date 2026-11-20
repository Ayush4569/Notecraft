import { UserProfile } from "./api";

export type UserState = UserProfile;

export interface User extends UserProfile {
    createdAt?: Date;
    isVerified?: boolean;
}
