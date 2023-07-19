import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import Layout from '../../Layout'

const LayoutEn = async ({ children }: { children: ReactNode }) => (
    <Layout lang={CodeLanguage.EN} content={children} />
)

export default LayoutEn
