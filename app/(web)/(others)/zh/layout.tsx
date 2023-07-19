import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import Layout from '../../Layout'

const LayoutZh = async ({ children }: { children: ReactNode }) => (
    <Layout lang={CodeLanguage.ZH} content={children} />
)

export default LayoutZh
