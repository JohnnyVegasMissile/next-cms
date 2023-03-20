import { BlockDetails } from '..'
import View from './View'
import Edit from './Edit'

const Details: BlockDetails = {
    View,
    Edit,
    title: 'Text',
    position: ['HEADER', 'FOOTER', 'SIDEBAR', 'CONTENT'],
    availableIn: ['LAYOUT', 'PAGE', 'CONTAINER', 'TEMPLATE', 'CONTENT', 'ELEMENT'],
    default: { title: 'Title', image: 1 },
}

export default Details
