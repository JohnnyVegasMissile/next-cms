import ViewTextBlock from './TextBlock/View'
import { BlockKey, ViewBlockProps } from '.'

type BlocksViews = {
    [key in BlockKey]?: ({ content }: ViewBlockProps) => JSX.Element
}

export const blocksViews: BlocksViews = {
    TextBlock: ViewTextBlock,
    ImageBlock: ViewTextBlock,
}

export default blocksViews
