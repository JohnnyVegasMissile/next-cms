import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import OthersLayout from '../../OthersLayout'

const LayoutZh = async ({ children }: { children: ReactNode }) => (
    <OthersLayout lang={CodeLanguage.ZH} content={children} />
)

export const revalidate = Infinity

export default LayoutZh
