import Blocks from '../../blocks'
import get from 'lodash.get'
import { Article, Section } from '@prisma/client'

interface Props {
    section: Section
    articles?: Article[] | null
}

const SectionBlock = ({ section, articles }: Props) => {
    const Component = get(Blocks, section.type, null)

    if (!Component) {
        return null
    }

    return <Component.View defaultValues={section.content} articles={articles} />
}

export default SectionBlock
