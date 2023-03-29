'use client'

import dayjs, { Dayjs } from 'dayjs'
import { Button, Card, Col, Divider, Input, Radio, Row, Space, Spin, message } from 'antd'
import { useFormik } from 'formik'
import { Typography } from 'antd'
import { PicCenterOutlined, CheckOutlined } from '@ant-design/icons'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import MetadatasList from '~/components/MetadatasList'
import WithLabel from '~/components/WithLabel'
import validate from './validate'
import { useMutation } from '@tanstack/react-query'
import { getContainer, postContainer, updateContainer } from '~/network/containers'
import { useEffect } from 'react'
import ContentCreation from '~/types/contentCreation'
import { ContentResponse } from '~/network/contents'

dayjs.extend(customParseFormat)

const { Text } = Typography

const initialValues: ContentCreation<Dayjs> = {
    name: '',
    published: true,
    slug: '',
    metadatas: [],
    fields: [],
}

const cleanDetails = (content: ContentResponse): ContentCreation<Dayjs> => ({
    ...content,
})

const cleanBeforeSend = (values: ContentCreation<Dayjs>) => {
    return values
}

const CreateContainer = ({ params }: any) => {
    const { contentId } = params
    const isUpdate = contentId !== 'create'
    const formik = useFormik({
        initialValues,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(values),
    })

    const details = useMutation(() => getContainer(contentId), {
        onSuccess: (data) => formik.setValues(cleanDetails(data)),
    })
    const submit = useMutation(
        (values: ContentCreation<Dayjs>) =>
            isUpdate
                ? updateContainer(contentId, cleanBeforeSend(values))
                : postContainer(cleanBeforeSend(values)),
        {
            onSuccess: () => message.success(`Content ${isUpdate ? 'modified' : 'created'} with success.`),
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    useEffect(() => {
        if (isUpdate) details.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (details.isLoading) {
        return <Spin />
    }

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Create new content</Text>

                    <Space>
                        {isUpdate && (
                            <Button icon={<PicCenterOutlined />} key="1" size="small" type="dashed">
                                Custom sections
                            </Button>
                        )}

                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                            onClick={() => formik.handleSubmit()}
                            loading={submit.isLoading}
                        >
                            {isUpdate ? 'Update content' : 'Create new'}
                        </Button>
                    </Space>
                </div>
            </Card>

            <Card bordered={false} size="small" title="Information">
                <Row gutter={[16, 16]}>
                    <Col span={16}>
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
                                    />
                                </WithLabel>
                            </Col>
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
                        </Row>

                        <Divider style={{ margin: '1rem', width: '97%', minWidth: '97%' }} />

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <WithLabel label="Container :" error={formik.errors.slug}>
                                    <Input
                                        size="small"
                                        status={!!formik.errors.slug ? 'error' : undefined}
                                        style={{ width: '100%' }}
                                        name="name"
                                        value={formik.values.slug}
                                        onChange={formik.handleChange}
                                    />
                                </WithLabel>
                            </Col>
                            <Col span={12}>
                                <WithLabel label="URL :" error={formik.errors.slug}>
                                    <Input
                                        size="small"
                                        status={!!formik.errors.slug ? 'error' : undefined}
                                        style={{ width: '100%' }}
                                        name="name"
                                        value={formik.values.slug}
                                        onChange={formik.handleChange}
                                    />
                                </WithLabel>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Card size="small" title="Content metadatas" style={{ minHeight: '100%' }}>
                            <MetadatasList
                                name="metadatas"
                                value={formik.values.metadatas}
                                onChange={formik.handleChange}
                                errors={formik.errors.metadatas as string[]}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
            <Card bordered={false} bodyStyle={{ height: 'fit-content' }} size="small" title="Fields">
                <Row gutter={[16, 16]}>
                    {[0, 1, 2, 3, 4].map((e) => (
                        <Col key={e} span={6}>
                            <Card
                                size="small"
                                title={
                                    <Text>
                                        Fields<Text type="danger"> *</Text>
                                    </Text>
                                }
                            ></Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </>
    )
}

export default CreateContainer
