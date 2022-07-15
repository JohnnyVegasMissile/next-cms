import '../styles/globals.css'
import 'antd/dist/antd.css'
// import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
// import { useRouter } from 'next/router'
// import { IntlProvider } from 'react-intl'
// import { prisma } from '../utils/prisma'

const queryClient = new QueryClient()

import AuthGuard from '../components/AuthGuard'
import MenuAdmin from '../components/MenuAdmin'
import { ProvideAuth } from '../hooks/useAuth'

// function MyApp({ Component, pageProps }: AppProps) {
function MyApp({ Component, pageProps }: any) {
    // const { locale } = useRouter()

    // const messages = (locale: string | undefined) => {
    //     switch (locale) {
    //         case 'en':
    //             return { lang: 'English' }
    //         case 'fr':
    //             return { lang: 'Francais' }
    //         case 'es':
    //             return { lang: 'Espanol' }
    //         case 'zh':
    //             return { lang: 'Zhongwen' }
    //         default:
    //             return { lang: 'English' }
    //     }
    // }

    return (
        <QueryClientProvider client={queryClient}>
            {/* <IntlProvider locale={locale || 'en'} messages={messages(locale)}> */}
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
            {/* </IntlProvider> */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

// MyApp.getInitialProps = async (appContext: AppContext) => {
//     const settings = prisma.setting.findMany()

//     // calls page's `getInitialProps` and fills `appProps.pageProps`
//     const appProps = await App.getInitialProps(appContext)

//     return { ...appProps, settings }
// }

// // export async function getServerSideProps() {

// //     return {
// //         props: {
// //             // Anything passed here is available in the Page component as props.pageProps
// //             pageProps: { lang: 'lang' },
// //         },
// //     }
// // }

export default MyApp
