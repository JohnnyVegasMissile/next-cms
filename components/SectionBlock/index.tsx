import Blocks from '../../blocks'
import get from 'lodash.get'
import { Section, Element } from '@prisma/client'
import { PageProps } from '../../types'

interface Props {
    section: Section | Element
    theme?: {}
    page?: PageProps
}

const SectionBlock = ({ section, theme, page }: Props) => {
    const Component = get(Blocks, section.block || '___', null)

    if (!Component) {
        return null
    }

    return <Component.View defaultValues={section.content} page={page} section={section} theme={theme} />
}

export default SectionBlock
