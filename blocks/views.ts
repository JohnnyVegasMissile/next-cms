import ViewTextBlock from './TextBlock/View'
import ViewImageBlock from './ImageBlock/View'
import ViewFormBlock from './FormBlock/View'
import { BlockKey, ViewBlockProps } from '.'

type BlocksViews = {
    [key in BlockKey]?: ({ content }: ViewBlockProps) => JSX.Element
}

export const blocksViews: BlocksViews = {
    TextBlock: ViewTextBlock,
    ImageBlock: ViewImageBlock,
    FormBlock: ViewFormBlock,
}

export default blocksViews
