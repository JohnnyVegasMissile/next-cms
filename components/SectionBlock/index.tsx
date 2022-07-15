import Blocks from '../../blocks'
import get from 'lodash.get'
import { Section, Element } from '@prisma/client'
import { FullPage, FullArticle } from 'types'

interface Props {
    section: Section | Element
    page?: FullPage | FullArticle
}

const SectionBlock = ({ section, page }: Props) => {
    const Component = get(Blocks, section.type || 'unknow', null)

    if (!Component) {
        return null
    }

    return <Component.View defaultValues={section.content} section={section} page={page} />
}

export default SectionBlock
