import Blocks from '../../blocks'
import get from 'lodash.get'
import { Section, Element } from '@prisma/client'
import { FullPage } from 'types'

interface Props {
    section: Section | Element
    page?: FullPage
}

const SectionBlock = ({ section, page }: Props) => {
    const Component = get(Blocks, section.type || 'unknow', null)

    if (!Component) {
        return null
    }

    return <Component.View defaultValues={section.content} page={page} />
}

export default SectionBlock
