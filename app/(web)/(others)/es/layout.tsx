import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import Layout from '../../Layout'

const LayoutEs = async ({ children }: { children: ReactNode }) => (
    <Layout lang={CodeLanguage.ES} content={children} />
)

export default LayoutEs
