import { CodeLanguage, SectionType } from '@prisma/client'
import { notFound } from 'next/navigation'
import { prisma } from '~/utilities/prisma'
import Form from './Form'
import { Metadata } from 'next'
import getSection, { SectionResponse } from '~/utilities/getSection'
import getSidebar from '~/utilities/getSidebar'
import getLanguage from '~/utilities/getLanguage'

export const metadata: Metadata = {
    title: 'Edit page sections',
}

const getSections = async (pageId: string) => {
    const exist = await prisma.page.findUnique({ where: { id: pageId } })
    if (!exist) return null

    const content = await getSection({ pageId, type: SectionType.PAGE })
    const sidebar = await getSection({ pageId, type: SectionType.PAGE_SIDEBAR })

    const filteredContent: { [key in CodeLanguage]?: SectionResponse[] } = {}
    content?.forEach((section) => {
        const previous = filteredContent[section.language] || []
        previous.push(section)

        filteredContent[section.language] = previous
    })

    const filteredSidebar: { [key in CodeLanguage]?: SectionResponse[] } = {}
    sidebar?.forEach((section) => {
        const previous = filteredSidebar[section.language] || []
        previous.push(section)

        filteredSidebar[section.language] = previous
    })

    return {
        content: filteredContent,
        sidebar: filteredSidebar,
    }
}

const EditPageSections = async ({ params }: any) => {
    const layout = await getSections(params.pageId)
    const sidebar = await getSidebar()
    const languages = await getLanguage()

    if (!layout) notFound()

    return <Form pageId={params.pageId} layout={layout} sidebar={sidebar} {...languages} />
}

export const dynamic = 'force-dynamic'

export default EditPageSections
