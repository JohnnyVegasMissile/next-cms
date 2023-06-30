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
    const { block, content, medias } = section
    const View = blocksViews[block as BlockKey]

    if (!View) return null

    console.log('DisplaySection', section)
    console.log('View', View)

    return (
        <View
            content={content}
            medias={new Map(medias?.filter((e) => !!e.media).map((e) => [e.media?.id!, e.media!]))}
            forms={new Map(medias?.filter((e) => !!e.form).map((e) => [e.form?.id!, e.form!]))}
        />
    )
}

export default DisplaySection
