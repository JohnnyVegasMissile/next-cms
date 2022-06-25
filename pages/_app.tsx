import '../styles/globals.css'
import 'antd/dist/antd.css'
// import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

import AuthGuard from '../components/AuthGuard'
import MenuAdmin from '../components/MenuAdmin'
import { ProvideAuth } from '../hooks/useAuth'

// function MyApp({ Component, pageProps }: AppProps) {
function MyApp({ Component, pageProps }: any) {
    return (
        <QueryClientProvider client={queryClient}>
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
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default MyApp
