import { notFound } from 'next/navigation'
import { prisma } from '~/utilities/prisma'
import Form from './Form'
import { Metadata as NextMetadata } from 'next'
import MenuCreation from '~/types/menuCreation'
import { Content, Menu, MenuChild, MenuChildType } from '@prisma/client'
import set from 'lodash.set'

export const generateMetadata = async ({ params }: any): Promise<NextMetadata> => ({
    title: `${params.pageId === 'create' ? 'Create' : 'Edit'} page`,
})

const initialValues: MenuCreation = {
    name: '',
    childs: [],
}

type FullMenu = Menu & {
    childs?: (MenuChild & {
        childs?: (MenuChild & { childs?: MenuChild[]; contents?: Content[] })[]
        contents?: Content[]
    })[]
    contents?: Content[]
}

const getMenu = async (
    menuId: string
): Promise<{
    isUpdate: boolean
    menu?: FullMenu
}> => {
    if (menuId === 'create') return { isUpdate: false }

    const menu = await prisma.menu.findUnique({
        where: { id: menuId },
        include: {
            childs: {
                orderBy: { position: 'asc' },
                include: {
                    childs: {
                        orderBy: { position: 'asc' },
                        include: {
                            childs: {
                                orderBy: { position: 'asc' },
                            },
                        },
                    },
                },
            },
        },
    })

    if (!menu) return { isUpdate: true }

    for (let i = 0; i < menu.childs?.length; i++) {
        const level1Name = `childs.${i}`
        const level1Child = menu.childs[i]

        if (level1Child?.type === MenuChildType.CONTENT && !!level1Child.containerId) {
            const contents = prisma.content.findMany({
                where: { containerId: level1Child.containerId },
            })

            set(menu, `${level1Name}.contents`, contents)
            continue
        }

        for (let j = 0; j < (level1Child?.childs?.length || 0); j++) {
            const level2Name = `${level1Name}.childs.${j}`
            const level2Child = level1Child?.childs[j]

            if (level2Child?.type === MenuChildType.CONTENT && !!level2Child.containerId) {
                const contents = prisma.content.findMany({
                    where: { containerId: level2Child.containerId },
                })

                set(menu, `${level2Name}.contents`, contents)
                continue
            }

            for (let k = 0; k < (level2Child?.childs?.length || 0); k++) {
                const level3Name = `${level2Name}.childs.${k}`
                const level3Child = level2Child?.childs[k]

                if (level3Child?.type === MenuChildType.CONTENT && !!level3Child.containerId) {
                    const contents = prisma.content.findMany({
                        where: { containerId: level3Child.containerId },
                    })

                    set(menu, `${level3Name}.contents`, contents)
                    continue
                }
            }
        }
    }

    return {
        isUpdate: true,
        menu: menu as FullMenu,
    }
}

const CreateMenu = async ({ params }: any) => {
    const { isUpdate, menu } = await getMenu(params.menuId)

    if (!menu && isUpdate) notFound()

    return <Form pageId={params.menuId} isUpdate={isUpdate} menu={menu || initialValues} />
}

export const dynamic = 'force-dynamic'

export default CreateMenu
