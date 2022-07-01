import View from './View'
import Edit from './Edit'
import type { Block } from '../types'

const Example: Block = {
    name: 'Example',
    pages: ['page', 'list', 'home'],
    preview: '',
    View,
    Edit,
}

export default Example
