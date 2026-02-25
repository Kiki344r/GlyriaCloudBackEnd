import type { Groups } from '@prisma/client';

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    groups: Groups[];
    UUID: string;
}