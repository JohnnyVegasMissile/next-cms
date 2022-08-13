import Link from 'next/link'
import { PageProps } from 'types'
import { Button, Result } from 'antd'
import type { GetStaticPathsContext } from 'next'

import PageDisplay from '../components/PageDisplay'
import getPagePropsFromUrl from '../utils/getPagePropsFromUrl'

const NotFound = (props: PageProps) => <PageDisplay pageProps={props} onEmpty={<Default404 />} />

const Default404 = () => {
    return (
        <div
            style={{
                height: '80vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link href="/">
                        <a>
                            <Button type="primary">Back Home</Button>
                        </a>
                    </Link>
                }
            />
        </div>
    )
}

export async function getStaticProps(context: GetStaticPathsContext) {
    return await getPagePropsFromUrl('not-found')
}

export default NotFound
