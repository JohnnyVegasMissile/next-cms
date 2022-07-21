import View from './View'
import Edit from './Edit'
import type { Block } from '../types'

const Title: Block = {
    name: 'List',
    pages: ['page', 'list', 'home', 'error', 'signin'],
    preview: '',
    View,
    Edit,
}

export default Title
