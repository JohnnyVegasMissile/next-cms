import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const LayoutZh = async ({ children }: { children: ReactNode }) => (
    <PagesDisplays.Layout lang={CodeLanguage.ZH} content={children} />
)

export const revalidate = Infinity

export default LayoutZh
