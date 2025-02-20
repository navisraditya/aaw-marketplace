import { db } from "../../../authentication/src/db";
import { eq, and } from "drizzle-orm";
import * as schema from '@db/schema/wishlist/wishlistDetail';

export const removeProductFromWishlist = async (
    id: string,
) => {
    const result = await db
                    .delete(schema.wishlistDetail)
                    .where(eq(schema.wishlistDetail.id, id))
                    .returning();
    return result?.[0];
}