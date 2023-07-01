import { BlockDetails } from '..'
import View from './View'
import Edit from './Edit'

export type ContentType = {
    imageId?: string
}

const Details: BlockDetails = {
    View,
    Edit,
    title: 'Image',
    position: ['HEADER', 'FOOTER', 'SIDEBAR', 'CONTENT'],
    availableIn: ['LAYOUT', 'PAGE', 'CONTAINER', 'TEMPLATE', 'CONTENT', 'ELEMENT'],
    default: {},
    validate: (content: ContentType) => {
        let errors: { [key: string]: string } = {}

        if (!content.imageId) errors['imageId'] = 'Required'

        return errors
    },
}

export default Details
