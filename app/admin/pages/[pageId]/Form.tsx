'use client'

import { Button, Card, Col, Divider, Input, Popconfirm, Radio, Row, Space, Typography, message } from 'antd'
import { PicCenterOutlined, CheckOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PageType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import set from 'lodash.set'

import { postPages, updatePage } from '~/network/pages'
import MetadatasList from '~/components/MetadatasList'
import PageCreation from '~/types/pageCreation'
import SlugEdit from '~/components/SlugEdit'
import WithLabel from '~/components/WithLabel'

const { Text } = Typography

const validate = (values: PageCreation) => {
    let errors: any = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    if (values.type === PageType.PAGE) {
        for (let i = 0; i < values.slug.length; i++) {
            if (!values.slug[i]) set(errors, `slug.${i}`, 'Required')
        }
    }

    for (let i = 0; i < values.metadatas?.length; i++) {
        for (let j = 0; j < (values.metadatas[i]?.values?.length || 0); j++) {
            if (values.metadatas[i]?.values[j] === undefined || values.metadatas[i]?.values[j] === '')
                set(errors, `metadatas.${i}.values.${j}`, 'Required')
        }
    }

    return errors
}

interface FormPageProps {
    pageId: string
    isUpdate: boolean
    page: PageCreation
    type: PageType | undefined
}

const Form = ({ pageId, isUpdate, page, type }: FormPageProps) => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const formik = useFormik({
        initialValues: page,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(values),
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
                                    icon={<PicCenterOutlined />}
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
                            icon={<CheckOutlined />}
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
                                        disabled={!!type && type !== PageType.PAGE}
                                    />
                                </WithLabel>
                            </Col>

                            {type === PageType.PAGE && (
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

                        {type !== PageType.HOMEPAGE && (
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

export default Form
