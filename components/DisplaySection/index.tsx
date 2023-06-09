import { Section } from '@prisma/client'
import { BlockKey } from '~/blocks'
import blocksViews from '~/blocks/views'

interface DisplaySectionProps {
    section: Section
}

const DisplaySection = ({ section }: DisplaySectionProps) => {
    const View = blocksViews[section.block as BlockKey]

    if (!View) return null

    return <View key={section.id} content={section.content} images={[]} files={[]} videos={[]} forms={[]} />
}

export default DisplaySection
