import { db } from "../../../authentication/src/db";
import { eq, and } from "drizzle-orm";
import * as schema from '../../../products/db/categories';

export const deleteCategoryById = async (tenant_id: string, id: string) => {
    const result = await db
        .delete(schema.categories)
        .where(and(
            eq(schema.categories.tenant_id, tenant_id),
            eq(schema.categories.id, id)
        ))
        .returning();
    return result?.[0];
}