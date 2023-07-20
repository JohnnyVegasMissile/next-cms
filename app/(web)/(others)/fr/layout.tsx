import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import OthersLayout from '../../OthersLayout'

const LayoutFr = async ({ children }: { children: ReactNode }) => (
    <OthersLayout lang={CodeLanguage.FR} content={children} />
)

export const revalidate = Infinity

export default LayoutFr
