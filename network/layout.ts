import INSTANCE from './api'
import { Section } from '@prisma/client'
import { SectionCreationCleaned } from '~/types/sectionCreation'

export const getLayout = (): Promise<{
    header: Section[]
    topSidebar: Section[]
    bottomSidebar: Section[]
    topContent: Section[]
    bottomContent: Section[]
    footer: Section[]
}> =>
    INSTANCE({
        method: 'GET',
        url: `/api/layouts`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const updateLayout = (data: {
    header: SectionCreationCleaned[]
    topSidebar: SectionCreationCleaned[]
    bottomSidebar: SectionCreationCleaned[]
    topContent: SectionCreationCleaned[]
    bottomContent: SectionCreationCleaned[]
    footer: SectionCreationCleaned[]
}): Promise<Section[]> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/layouts`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })
