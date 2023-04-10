import { RightType } from '@prisma/client'

type RoleCreation = {
    name: string
    rights: RightType[]
    uploadMaxSize?: number
}

export default RoleCreation
