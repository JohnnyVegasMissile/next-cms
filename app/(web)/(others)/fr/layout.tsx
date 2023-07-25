import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const LayoutFr = async ({ children }: { children: ReactNode }) => (
    <PagesDisplays.Layout lang={CodeLanguage.FR} content={children} />
)

export const revalidate = Infinity

export default LayoutFr
