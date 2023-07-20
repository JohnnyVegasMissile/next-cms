import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import OthersLayout from '../../OthersLayout'

const LayoutEn = async ({ children }: { children: ReactNode }) => (
    <OthersLayout lang={CodeLanguage.EN} content={children} />
)

export const revalidate = Infinity

export default LayoutEn
