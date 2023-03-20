import View from './View'
import Edit from './Edit'
import { BlockDetails } from '..'

const Details: BlockDetails = {
    View,
    Edit,
    title: 'Text',
    position: ['HEADER', 'FOOTER', 'SIDEBAR', 'CONTENT'],
    availableIn: ['LAYOUT', 'PAGE', 'CONTAINER', 'TEMPLATE', 'CONTENT', 'ELEMENT'],
    default: {
        title: 'Title',
        subtitle: 'Subtitle',
        text: 'Lorem ipsum, nota bene ma bela',
        buttons: [],
        switched: false,
    },
}

export default Details
