'use client'

import dayjs, { Dayjs } from 'dayjs'
import { Button, Card, Col, Divider, Input, Popconfirm, Radio, Row, Space, message } from 'antd'
import { useFormik } from 'formik'
import { Typography } from 'antd'
import { PicCenterOutlined, PicLeftOutlined, CheckOutlined } from '@ant-design/icons'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import MetadatasList from '~/components/MetadatasList'
import ContainerCreation from '~/types/containerCreation'
import SlugEdit from '~/components/SlugEdit'
import WithLabel from '~/components/WithLabel'
import ContainerFieldsManager from '~/components/ContainerFieldsManager'
import validate, { cleanBeforeSend, containerToContainerCreation } from './validate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postContainer, updateContainer } from '~/network/containers'
import { ContainerField, Metadata, Slug } from '@prisma/client'
import { useRouter } from 'next/navigation'

dayjs.extend(customParseFormat)

const { Text } = Typography

export type FullContainer = { name: string; published: boolean } & {
    slug: Slug | null
    fields: ContainerField[]
    metadatas: Metadata[]
    contentsMetadatas: Metadata[]
}

interface FormProps {
    containerId: string
    isUpdate: boolean
    container: FullContainer
}

const Form = ({ containerId, isUpdate, container }: FormProps) => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const formik = useFormik({
        initialValues: containerToContainerCreation(container),
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(values),
    })

    const submit = useMutation(
        (values: ContainerCreation<Dayjs>) =>
            isUpdate
                ? updateContainer(containerId, cleanBeforeSend(values))
                : postContainer(cleanBeforeSend(values)),
        {
            onSuccess: () => {
                message.success(`Container ${isUpdate ? 'modified' : 'created'} with success.`)
                queryClient.invalidateQueries({ queryKey: ['pages'] })
                router.push('/admin/containers')
            },
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Create new container</Text>

                    <Space>
                        {isUpdate && (
                            <>
                                <Button
                                    icon={<PicCenterOutlined rev={undefined} />}
                                    key="1"
                                    size="small"
                                    type="dashed"
                                >
                                    Custom sections
                                </Button>

                                <Popconfirm
                                    placement="bottom"
                                    title="Save before?"
                                    description="If you don't your changes won't be saved"
                                    // onConfirm={confirm}
                                    // onCancel={cancel}
                                    okText="Save before"
                                    cancelText="Without saving"
                                >
                                    <Button
                                        icon={<PicLeftOutlined rev={undefined} />}
                                        key="2"
                                        size="small"
                                        type="dashed"
                                    >
                                        Custom template sections
                                    </Button>
                                </Popconfirm>
                            </>
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

            <Card size="small" title="Information">
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

                        <WithLabel label="URL :" error={(formik.errors.slug as string[])?.find((e) => !!e)}>
                            <SlugEdit
                                value={formik.values.slug}
                                onChange={(e) => formik.setFieldValue('slug', e)}
                                errors={formik.errors.slug as string[]}
                                paramsId={isUpdate ? { containerId } : undefined}
                            />
                        </WithLabel>
                    </Col>
                    <Col span={8}>
                        <Card size="small" title="Container metadatas" style={{ minHeight: '100%' }}>
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
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Card bodyStyle={{ height: 'fit-content' }} size="small" title="Field">
                        <ContainerFieldsManager
                            value={formik.values.fields}
                            onChange={(name, value) =>
                                formik.setFieldValue(`fields${name ? `.${name}` : ''}`, value)
                            }
                            errors={formik.errors.fields as any[]}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ height: 'fit-content' }} size="small" title="Contents metadatas">
                        <MetadatasList
                            name="contentsMetadatas"
                            value={formik.values.contentsMetadatas}
                            onChange={formik.handleChange}
                            errors={formik.errors.contentsMetadatas as string[]}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Form
