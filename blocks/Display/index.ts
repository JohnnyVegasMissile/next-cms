import View from './View'
import Edit from './Edit'
import type { Block } from '../types'

const Title: Block = {
    name: 'Display',
    type: 'container',
    View,
    Edit,
}

export default Title
