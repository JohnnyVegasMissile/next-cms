import View from './View'
import Edit from './Edit'
import type { Block } from '../types'

const Example: Block = {
    name: 'Example List',
    pages: ['list'],
    preview: '',
    View,
    Edit,
}

export default Example
