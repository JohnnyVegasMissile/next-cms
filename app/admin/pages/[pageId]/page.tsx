'use client'

import { useEffect } from 'react'
import {
    Button,
    Card,
    Col,
    Divider,
    Input,
    Popconfirm,
    Radio,
    Row,
    Space,
    Spin,
    Typography,
    message,
} from 'antd'
import { PicCenterOutlined, CheckOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Metadata, Page, PageType, Slug } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import set from 'lodash.set'

import { getPage, postPages, updatePage } from '~/network/pages'
import MetadatasList from '~/components/MetadatasList'
import PageCreation from '~/types/pageCreation'
import SlugEdit from '~/components/SlugEdit'
import WithLabel from '~/components/WithLabel'

const { Text } = Typography

const initialValues: PageCreation = {
    name: '',
    published: true,
    slug: [''],
    metadatas: [],
}

const validate = (values: PageCreation) => {
    let errors: any = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    for (let i = 0; i < values.slug.length; i++) {
        if (!values.slug[i]) set(errors, `slug.${i}`, 'Required')
    }

    for (let i = 0; i < values.metadatas.length; i++) {
        if (!values.metadatas[i]?.content) set(errors, `metadatas.${i}`, 'Required')
    }

    return errors
}

const cleanDetails = (
    page:
        | (Page & {
              slug: Slug | null
              metadatas: Metadata[]
          })
        | null
): PageCreation => {
    return {
        name: page?.name || '',
        published: !!page?.published,
        slug: page?.slug?.basic.split('/') || [''],
        metadatas:
            page?.metadatas?.map((metadata) => ({
                id: metadata.id,
                name: metadata.name,
                content: metadata.name === 'keywords' ? metadata.content.split(', ') : metadata.content,
            })) || [],
    }
}

const CreatePage = ({ params }: any) => {
    const { pageId } = params
    const isUpdate = pageId !== 'create'
    const router = useRouter()
    const queryClient = useQueryClient()
    const formik = useFormik({
        initialValues,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(values),
    })

    const details = useMutation(() => getPage(pageId), {
        onSuccess: (data) => formik.setValues(cleanDetails(data)),
    })
    const submit = useMutation(
        (values: PageCreation) => (isUpdate ? updatePage(pageId, values) : postPages(values)),
        {
            onSuccess: () => {
                message.success(`Page ${isUpdate ? 'modified' : 'created'} with success.`)
                queryClient.invalidateQueries({ queryKey: ['pages'] })
                router.push('/admin/pages')
            },
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    useEffect(() => {
        if (isUpdate) details.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (details.isLoading) return <Spin />

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{isUpdate ? 'Update' : 'Create new'} page</Text>

                    <Space>
                        {isUpdate && (
                            <Popconfirm
                                title="Continue without saving?"
                                description="Make sure to save your changes."
                                onConfirm={() => router.push(`/admin/pages/${pageId}/sections`)}
                                okText="Continue"
                            >
                                <Button
                                    icon={<PicCenterOutlined rev={undefined} />}
                                    size="small"
                                    type="dashed"
                                    disabled={submit.isLoading}
                                >
                                    Custom sections
                                </Button>
                            </Popconfirm>
                        )}

                        <Button
                            type="primary"
                            icon={<CheckOutlined rev={undefined} />}
                            size="small"
                            onClick={() => formik.handleSubmit()}
                            loading={submit.isLoading}
                        >
                            {isUpdate ? 'Update page' : 'Create new'}
                        </Button>
                    </Space>
                </div>
            </Card>

            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Card size="small" title="Information">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <WithLabel label="Name :" error={formik.errors.name}>
                                    <Input
                                        size="small"
                                        status={!!formik.errors.name ? 'error' : undefined}
                                        style={{ width: '100%' }}
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        disabled={details.data?.type !== PageType.PAGE}
                                    />
                                </WithLabel>
                            </Col>

                            {details.data?.type === PageType.PAGE && (
                                <Col span={12}>
                                    <WithLabel label="Published :">
                                        <Radio.Group
                                            name="published"
                                            value={formik.values.published}
                                            onChange={formik.handleChange}
                                            options={[
                                                { label: 'Published', value: true },
                                                { label: 'Unpublished', value: false },
                                            ]}
                                        />
                                    </WithLabel>
                                </Col>
                            )}
                        </Row>

                        {details.data?.type !== PageType.HOMEPAGE && (
                            <>
                                <Divider style={{ margin: '1rem', width: '97%', minWidth: '97%' }} />

                                <WithLabel
                                    label="URL :"
                                    error={(formik.errors.slug as string[])?.find((e) => !!e)}
                                >
                                    <SlugEdit
                                        value={formik.values.slug}
                                        onChange={(e) => formik.setFieldValue('slug', e)}
                                        errors={formik.errors.slug as string[]}
                                        paramsId={isUpdate ? { pageId } : undefined}
                                    />
                                </WithLabel>
                            </>
                        )}
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small" title="Metadatas" style={{ minHeight: '100%' }}>
                        <MetadatasList
                            name="metadatas"
                            value={formik.values.metadatas}
                            onChange={formik.handleChange}
                            errors={formik.errors.metadatas as string[]}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CreatePage
