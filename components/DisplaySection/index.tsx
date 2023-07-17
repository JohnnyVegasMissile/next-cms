import { Form, FormField, Link, Media, Menu, Section } from '@prisma/client'
import { BlockKey } from '~/blocks'
import blocksViews from '~/blocks/views'
import { ObjectId } from '~/types'

interface DisplaySectionProps {
    section: Section & {
        linkedData?:
            | {
                  form:
                      | (Form & {
                            fields: (FormField & {
                                container: {
                                    id: ObjectId
                                    name: string
                                    contents: { id: ObjectId; name: string }[]
                                } | null
                            })[]
                        })
                      | null
                  media: Media | null
                  link: Link | null
                  menu: Menu | null
              }[]
            | null
    }
}

const DisplaySection = async ({ section }: DisplaySectionProps) => {
    const { block, value, linkedData } = section
    const View = blocksViews[block as BlockKey]

    if (!View) return null

    return (
        <View
            value={value}
            medias={new Map(linkedData?.filter((e) => !!e.media).map((e) => [e.media?.id!, e.media!]))}
            forms={new Map(linkedData?.filter((e) => !!e.form).map((e) => [e.form?.id!, e.form!]))}
            links={new Map(linkedData?.filter((e) => !!e.link).map((e) => [e.link?.id!, e.link!]))}
            menus={new Map(linkedData?.filter((e) => !!e.menu).map((e) => [e.menu?.id!, e.menu!]))}
        />
    )
}

export default DisplaySection
