import Head from 'next/head'

import EditPageButton from '../../components/EditPageButton'
import { PageProps } from '../../types'
import SectionBlock from '../../components/SectionBlock'

interface PageDisplayProps {
    pageProps: PageProps
    onEmpty: JSX.Element
    noTitle?: boolean
}

const PageDisplay = ({ pageProps, onEmpty, noTitle = false }: PageDisplayProps) => {
    const { id, type, title, appName, theme, sections, metadatas, layout } = pageProps

    return (
        <>
            <Head>
                <link rel="icon" href="api/uploads/favicon.ico" />
                <title>{noTitle ? appName : `${appName} | ${title}`}</title>
                {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))}
            </Head>

            <EditPageButton redirectTo={`/admin/${type === 'container' ? 'containers' : 'contents'}/${id}`} />

            <header>
                {layout?.header?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={pageProps} theme={theme} />
                ))}
            </header>

            <main>
                {layout?.topBody?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={pageProps} theme={theme} />
                ))}
                {!sections?.length && onEmpty}
                {sections?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={pageProps} theme={theme} />
                ))}
                {layout?.bottomBody?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={pageProps} theme={theme} />
                ))}
            </main>

            <footer>
                {layout?.footer?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={pageProps} theme={theme} />
                ))}
            </footer>
        </>
    )
}

export default PageDisplay
