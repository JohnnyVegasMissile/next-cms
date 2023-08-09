import { BlockDetails } from '..'
import View from './View'
import Edit from './Edit'
import { SectionType } from '@prisma/client'

export type ContentType = {
    imageId?: string
}

const Details: BlockDetails = {
    View,
    Edit,
    title: 'Image',
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

        if (!value.imageId) errors['imageId'] = 'Required'

        return errors
    },
}

export default Details
