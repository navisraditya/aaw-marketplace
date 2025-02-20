import * as schema from '@db/schema/auth/users'
import { db } from "../../db";
import { eq, and } from "drizzle-orm";

export const getUserById = async (user_id: string, tenant_id: string) => {
    const result = await db
        .select({
            id: schema.users.id,
            username: schema.users.username,
            email: schema.users.email,
            full_name: schema.users.full_name,
            address: schema.users.address,
            phone_number: schema.users.phone_number
        })
        .from(schema.users)
        .where(
            and(
                eq(schema.users.id, user_id),
                eq(schema.users.tenant_id, tenant_id)
            )
        )
    return result[0];
}