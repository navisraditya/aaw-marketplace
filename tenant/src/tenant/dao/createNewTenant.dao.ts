import * as schemaTenant from '@db/schema/tenant/tenants'
import * as schemaTenantDetails from '@db/schema/tenant/tenantDetails'
import { db } from "../../../authentication/src/db"

export const createNewTenant = async (
    owner_id: string,
    name: string
) => {
    const result = await db.transaction(async (tx) => {
        const resultTenant = await tx
                        .insert(schemaTenant.tenants)
                        .values({
                            owner_id
                        })
                        .returning()

        if (!resultTenant || !resultTenant[0].id) {
            await tx.rollback();
            return null
        }

        const resultTenantDetails = await tx
                                .insert(schemaTenantDetails.tenantDetails)
                                .values({
                                    tenant_id: resultTenant[0].id,
                                    name
                                })
                                .returning()
        
        if (!resultTenant || !resultTenantDetails) {
            await tx.rollback();
            return null
        }
        return {
            tenants: resultTenant[0],
            tenantDetails: resultTenantDetails[0]
        }
    })

    return result;
}