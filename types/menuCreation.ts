import { LinkProtocol, MenuChildType } from '@prisma/client'
import { LinkValue } from '~/components/LinkSelect'
import { ObjectId } from '.'

export type MenuChild<T> = {
    id?: ObjectId
    tempId?: ObjectId
    name: string
    type: MenuChildType
    link?: LinkValue
    extras: { name: string; value: string }[]

    container?: ObjectId
    filters?:
        | Map<
              string,
              {
                  [key: ObjectId]: { operator: 'contains' | 'equals' | 'gt' | 'lt'; value: any }
              }
          >
        | undefined
    orderByFieldId?: ObjectId | undefined
    orderBy?: LinkProtocol | undefined

    childs: T
}

type MenuCreation = {
    name: string
    childs: MenuChild<MenuChild<MenuChild<undefined>[]>[] | undefined>[]
}

export default MenuCreation
