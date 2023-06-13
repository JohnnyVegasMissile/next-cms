import { RightType } from '@prisma/client'

type RoleCreation = {
    name: string
    // rights: Set<RightType>
    rights: RightType[]
    limitUpload?: number | undefined
}

export default RoleCreation
