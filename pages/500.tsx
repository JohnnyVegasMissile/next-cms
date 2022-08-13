import Link from 'next/link'
import { PageProps } from 'types'
import { Button, Result } from 'antd'
import type { GetStaticPathsContext } from 'next'

import PageDisplay from '../components/PageDisplay'
import getPagePropsFromUrl from '../utils/getPagePropsFromUrl'

const Errors = (props: PageProps) => <PageDisplay pageProps={props} onEmpty={<Default500 />} />

const Default500 = () => {
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
                status="500"
                title="500"
                subTitle="Sorry, something went wrong."
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

export default Errors
