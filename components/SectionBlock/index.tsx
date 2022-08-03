import Blocks from '../../blocks'
import get from 'lodash.get'
import { Section, Element } from '@prisma/client'

interface Props {
    section: Section | Element
}

const SectionBlock = ({ section }: Props) => {
    const Component = get(Blocks, section.block || '___', null)

    if (!Component) {
        return null
    }

    return <Component.View defaultValues={section.content} section={section} />
}

export default SectionBlock
