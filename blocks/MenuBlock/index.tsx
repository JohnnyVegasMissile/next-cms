import View from './View'
import Edit from './Edit'
import { BlockDetails } from '..'
import { SectionType } from '@prisma/client'

export type ContentType = {
    menuId?: string
}

const Details: BlockDetails = {
    View,
    Edit,
    title: 'Menu',
    availableIn: [
        SectionType.PAGE,
        SectionType.PAGE_SIDEBAR,
        SectionType.CONTAINER,
        SectionType.CONTAINER_SIDEBAR,
        SectionType.TEMPLATE_TOP,
        SectionType.TEMPLATE_BOTTOM,
        SectionType.TEMPLATE_SIDEBAR_TOP,
        SectionType.TEMPLATE_SIDEBAR_BOTTOM,
        SectionType.CONTENT,
        SectionType.CONTENT_SIDEBAR,
        SectionType.LAYOUT_HEADER,
        SectionType.LAYOUT_FOOTER,
        SectionType.LAYOUT_CONTENT_TOP,
        SectionType.LAYOUT_CONTENT_BOTTOM,
        SectionType.LAYOUT_SIDEBAR_TOP,
        SectionType.LAYOUT_SIDEBAR_BOTTOM,
    ],
    default: {},
    validate: (value: ContentType) => {
        let errors: { [key: string]: string } = {}

        if (!value.menuId) errors['menuId'] = 'Required'

        return errors
    },
}

export default Details
