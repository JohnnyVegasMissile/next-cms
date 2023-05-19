import { RightType } from '@prisma/client'

type RoleCreation = {
    name: string
    rights: Set<RightType>
    limitUpload?: number | undefined
}

export default RoleCreation
