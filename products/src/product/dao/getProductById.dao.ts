import { db } from "../../../authentication/src/db";
import { eq, and } from "drizzle-orm";
import * as schema from '../../../products/db/products'

export const getProductById = async (tenantId: string, id: string) => {
    const result = await db
        .select()
        .from(schema.products)
        .where(
            and(
                eq(schema.products.tenant_id, tenantId),
                eq(schema.products.id, id)
            )
        )
    return result?.[0];
}