import { Form, FormField, Link, Media, Section } from '@prisma/client'
import { BlockKey } from '~/blocks'
import blocksViews from '~/blocks/views'

interface DisplaySectionProps {
    section: Section & {
        medias?:
            | {
                  form: (Form & { fields: FormField[] }) | null
                  media: Media | null
                  link: Link | null
              }[]
            | null
    }
}

const DisplaySection = async ({ section }: DisplaySectionProps) => {
    const View = blocksViews[section.block as BlockKey]

    if (!View) return null

    return (
        <View
            key={section.id}
            content={section.content}
            medias={new Map(section.medias?.filter((e) => !!e.media).map((e) => [e.media?.id!, e.media!]))}
            forms={new Map(section.medias?.filter((e) => !!e.form).map((e) => [e.form?.id!, e.form!]))}
        />
    )
}

export default DisplaySection
