import '../styles/globals.css'
import 'antd/dist/antd.css'
// import type { AppProps } from 'next/app'

import AuthGuard from '../components/AuthGuard'
import MenuAdmin from '../components/MenuAdmin'
import { ProvideAuth } from '../hooks/useAuth'

// function MyApp({ Component, pageProps }: AppProps) {
function MyApp({ Component, pageProps }: any) {
    return (
        <ProvideAuth>
            <MenuAdmin />
            {/* if requireAuth property is present - protect the page */}
            {Component.requireAuth ? (
                <AuthGuard>
                    <Component {...pageProps} />
                </AuthGuard>
            ) : (
                // public page
                <Component {...pageProps} />
            )}
        </ProvideAuth>
    )
}

export default MyApp
