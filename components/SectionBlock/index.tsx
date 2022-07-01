import Blocks from '../../blocks'
import get from 'lodash.get'
import { Section } from '@prisma/client'
import { FullPage } from 'types'

interface Props {
    section: Section
    page?: FullPage
}

const SectionBlock = ({ section, page }: Props) => {
    const Component = get(Blocks, section.type, null)

    if (!Component) {
        return null
    }

    return <Component.View defaultValues={section.content} page={page} />
}

export default SectionBlock
