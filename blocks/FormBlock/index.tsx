import View from './View'
import Edit from './Edit'
import { BlockDetails } from '..'
import { SectionType } from '@prisma/client'

export type ContentType = {
    formId?: string
}

const Details: BlockDetails = {
    View,
    Edit,
    title: 'Form',
    // position: ['HEADER', 'FOOTER', 'SIDEBAR', 'CONTENT'],
    availableIn: [SectionType.CONTENT, SectionType.PAGE],
    default: {},
    validate: (content: ContentType) => {
        let errors: { [key: string]: string } = {}

        if (!content.formId) errors['formId'] = 'Required'

        return errors
    },
}

export default Details
