import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const LayoutEs = async ({ children }: { children: ReactNode }) => (
    <PagesDisplays.Layout lang={CodeLanguage.ES} content={children} />
)

export const revalidate = Infinity

export default LayoutEs
