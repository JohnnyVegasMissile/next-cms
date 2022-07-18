import '../styles/globals.css'
import 'antd/dist/antd.css'
import type { NextWebVitalsMetric } from 'next/app'
// import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
// import { useRouter } from 'next/router'
// import { IntlProvider } from 'react-intl'
// import { prisma } from '../utils/prisma'

const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

import AuthGuard from '../components/AuthGuard'
import MenuAdmin from '../components/MenuAdmin'
import { ProvideAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'

export function reportWebVitals({ id, name, label, value }: NextWebVitalsMetric) {
    console.log('event', name, {
        category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
        value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
        label: id, // id unique to current page load
        // non_interaction: true, // avoids affecting bounce rate.
    })
}

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
