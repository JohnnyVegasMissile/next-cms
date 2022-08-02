import SectionManager from '../../components/SectionManager'
import { FullSection, FullSectionEdit, LayoutProps } from '../../types'
import { Card, Divider, message, Space, Spin, Typography } from 'antd'
import { useFormik } from 'formik'
import get from 'lodash.get'
import { useState } from 'react'
import { useMutation, useQuery, UseQueryResult } from 'react-query'
import { getLayout, postLayout } from '@network/api'
import Head from 'next/head'

const { Title } = Typography

const Layout = () => {
    const { values, errors, handleSubmit, handleChange, setValues } = useFormik<LayoutProps>({
        initialValues: {
            header: [],
            topBody: [],
            bottomBody: [],
            footer: [],
        },
        validate: () => ({}),
        onSubmit: async (values) => {
            let i = 0
            const header: FullSectionEdit[] = []

            if (!!values.header) {
                for (const section of values.header) {
                    if (!!section.block || !!section.elementId) {
                        header.push({
                            ...section,
                            position: i,
                        })

                        i = i + 1
                    }
                }
            }

            i = 0
            const topBody: FullSectionEdit[] = []

            if (!!values.topBody) {
                for (const section of values.topBody) {
                    if (!!section.block || !!section.elementId) {
                        topBody.push({
                            ...section,
                            position: i,
                        })

                        i = i + 1
                    }
                }
            }

            i = 0
            const bottomBody: FullSectionEdit[] = []

            if (!!values.bottomBody) {
                for (const section of values.bottomBody) {
                    if (!!section.block || !!section.elementId) {
                        bottomBody.push({
                            ...section,
                            position: i,
                        })

                        i = i + 1
                    }
                }
            }

            i = 0
            const footer: FullSectionEdit[] = []

            if (!!values.footer) {
                for (const section of values.footer) {
                    if (!!section.block || !!section.elementId) {
                        footer.push({
                            ...section,
                            position: i,
                        })

                        i = i + 1
                    }
                }
            }

            mutation.mutate({
                header,
                topBody,
                bottomBody,
                footer,
            })
        },
    })

    const layout: UseQueryResult<LayoutProps, Error> = useQuery<LayoutProps, Error>(['layout'], () => getLayout(), {
        onSuccess: (data: LayoutProps) => {
            const header = get(data, 'header', []).sort((a, b) => a.position - b.position)
            const topBody = get(data, 'topBody', []).sort((a, b) => a.position - b.position)
            const bottomBody = get(data, 'bottomBody', []).sort((a, b) => a.position - b.position)
            const footer = get(data, 'footer', []).sort((a, b) => a.position - b.position)

            setValues({
                header,
                topBody,
                bottomBody,
                footer,
            })
        },
    })

    const mutation = useMutation((values: LayoutProps) => postLayout(values), {
        onSuccess: (data: any) => {
            message.success(`Element ${data.title} saved`)
            // queryClient.invalidateQueries('containers')
            // router.push('/admin/containers')
        },
        onError: (err) => {
            message.error('An error occured, while creating or updating the container')
            // queryClient.invalidateQueries('containers')
            // router.push('/admin/containers')
        },
    })

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (layout.isLoading) {
        return (
            <div
                style={{
                    height: 'calc(100vh - 29px)',
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f2f5',
                }}
            >
                <Spin size="large" tip="Loading..." />
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Admin - Layout</title>
            </Head>

            <Space
                direction="vertical"
                style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f0f2f5', padding: 15 }}
            >
                <Divider orientation="left">Header</Divider>

                <SectionManager
                    values={get(values, 'header', []) as FullSectionEdit[]}
                    onChange={(e) => onHandleChange('header', e)}
                />

                <Divider orientation="left">Top Body</Divider>

                <SectionManager
                    values={get(values, 'topBody', []) as FullSectionEdit[]}
                    onChange={(e) => onHandleChange('topBody', e)}
                />

                <Card style={{ marginTop: 10 }}>
                    <Title style={{ textAlign: 'center', margin: 0 }} level={2}>
                        Pages content
                    </Title>
                </Card>

                <Divider orientation="left">Bottom Body</Divider>

                <SectionManager
                    values={get(values, 'bottomBody', []) as FullSectionEdit[]}
                    onChange={(e) => onHandleChange('bottomBody', e)}
                />

                <Divider orientation="left">Footer</Divider>

                <SectionManager
                    values={get(values, 'footer', []) as FullSectionEdit[]}
                    onChange={(e) => onHandleChange('footer', e)}
                />
            </Space>
        </>
    )
}

export default Layout
