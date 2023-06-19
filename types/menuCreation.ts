import { LinkProtocol, MenuChildType } from '@prisma/client'
import { LinkValue } from '~/components/LinkSelect'
import { ObjectId } from '.'

export type MenuChild<T> = {
    label: string
    type: MenuChildType
    link?: LinkValue
    extras: { name: string; value: string }[]

    container?: ObjectId
    filters?:
        | Map<
              string,
              {
                  operator?: string | undefined
                  value?: any
              }
          >
        | undefined
    orderByField?: ObjectId | undefined
    orderBy?: LinkProtocol | undefined

    childrens: T
}

type MenuCreation = {
    name: string
    menuItems: MenuChild<MenuChild<MenuChild<undefined>[]>[] | undefined>[]
}

export default MenuCreation
