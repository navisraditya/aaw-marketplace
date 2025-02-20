import { db } from "../../../authentication/src/db";
import { eq, and } from "drizzle-orm";
import * as schema from '@db/schema/wishlist/wishlistDetail';

export const getWishlistDetailByWishlistId = async (
    wishlist_id: string,
) => {
    const result = await db
                    .select()
                    .from(schema.wishlistDetail)
                    .where(and(
                        eq(schema.wishlistDetail.wishlist_id, wishlist_id)
                    ))
    return result?.[0];
}