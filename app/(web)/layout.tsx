import { ReactNode } from 'react'
import WebVitals from '~/components/WebVitals'

const Layout = ({ children }: { children: ReactNode }) => (
    <>
        <WebVitals />
        {children}
    </>
)

export default Layout
