import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import Layout from '../../Layout'

const LayoutFr = async ({ children }: { children: ReactNode }) => (
    <Layout lang={CodeLanguage.FR} content={children} />
)

export default LayoutFr
