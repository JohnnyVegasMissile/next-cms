import { useState, useEffect } from 'react'
// import { Divider, Steps } from 'antd'
import { Button, Result, Spin } from 'antd'
import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
// import Image from 'next/image'
import { initPages } from '../network/api'
import { useQuery, UseQueryResult } from 'react-query'

const Install: NextPage = () => {
    // const [initialazing, setInitialazing] = useState<boolean>(true)
    // useEffect(() => {
    //     initPages()
    //         .then(() => setInitialazing(false))
    //         .catch(() => setInitialazing(false))
    // }, [])

    const install: UseQueryResult<void, Error> = useQuery<void, Error>(
        ['install'],
        () => initPages(),
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
        }
    )

    return (
        <div>
            <Head>
                <title>Install</title>
                {/* <meta
            name="description"
            content="Generated by create next app"
        /> */}
            </Head>

            <header></header>

            <main>
                <div
                    style={{
                        backgroundColor: '#f0f2f5',
                        height: 'calc(100vh - 29px)',
                        width: '100vw',
                    }}
                >
                    {install.isLoading ? (
                        <Spin tip="Installing..." />
                    ) : (
                        <Result
                            status={install.status === 'error' ? 'error' : 'success'}
                            title={
                                install.status === 'error'
                                    ? 'Installation failed, please try again'
                                    : 'Installation completed successfully'
                            }
                            extra={[
                                install.status === 'error' ? (
                                    <Button onClick={() => install.refetch} type="primary">
                                        Retry
                                    </Button>
                                ) : (
                                    <Link href="/" key="home">
                                        <a>
                                            <Button type="primary">Back home</Button>
                                        </a>
                                    </Link>
                                ),
                            ]}
                        />
                    )}
                </div>
            </main>

            <footer></footer>
        </div>
    )
}

export default Install
