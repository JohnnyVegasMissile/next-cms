import { ReactNode } from 'react'
import WebVitals from '~/components/WebVitals'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <WebVitals />
            {children}
        </>
    )
}

export default Layout
