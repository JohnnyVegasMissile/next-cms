import SectionCreation from '~/types/sectionCreation'
import ImageBlock from './ImageBlock'
import TextBlock from './TextBlock'
import ViewTextBlock from './TextBlock/View'
import { Form, Media } from '@prisma/client'

export type ViewBlockProps = {
    content: any
    images: Media[]
    files: Media[]
    videos: Media[]
    forms: Form[]
}

export type EditBlockProps = {
    position: number
}

export type BlockDetails = {
    View: ({ content }: ViewBlockProps) => JSX.Element
    Edit: ({ position }: EditBlockProps) => JSX.Element
    title: string
    position: ('HEADER' | 'FOOTER' | 'SIDEBAR' | 'CONTENT')[]
    availableIn: ('LAYOUT' | 'PAGE' | 'CONTAINER' | 'TEMPLATE' | 'CONTENT' | 'ELEMENT')[]
    default?: any
    validate?: (section: SectionCreation) => any
}

export type BlockKey = 'ImageBlock' | 'TextBlock'

type BlocksSection = {
    [key in BlockKey]: BlockDetails
}

const blocks: BlocksSection = {
    ImageBlock,
    TextBlock,
}

export default blocks
