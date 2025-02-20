import { db } from "../../../authentication/src/db";
import * as schema from '../../../products/db/products'
import { and, eq, inArray } from "drizzle-orm";

export const getManyProductDatasById = async (
    tenant_id: string,
    productIds: string[],
) => {
    const result = await db
        .select()
        .from(schema.products)
        .where(and(
            inArray(schema.products.id, productIds),
            eq(schema.products.tenant_id, tenant_id)
        ))
    return result;
}