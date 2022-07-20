import View from './View'
import Edit from './Edit'
import type { Block } from '../types'

const Example: Block = {
    name: 'Navigation',
    pages: ['page', 'list', 'home', 'error', 'signin'],
    preview: '',
    View,
    Edit,
}

export default Example
