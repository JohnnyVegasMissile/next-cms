import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import OthersLayout from '../../OthersLayout'

const LayoutEs = async ({ children }: { children: ReactNode }) => (
    <OthersLayout lang={CodeLanguage.ES} content={children} />
)

export const revalidate = Infinity

export default LayoutEs
