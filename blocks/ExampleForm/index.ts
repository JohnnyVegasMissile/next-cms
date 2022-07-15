import View from './View'
import Edit from './Edit'
import type { Block } from '../types'

const Example: Block = {
    name: 'Example Form',
    pages: ['page', 'list'],
    preview: '',
    View,
    Edit,
}

export default Example
