'use client'

import { Button, Card, Col, Row, Input, Space, Typography, Switch, Divider, message } from 'antd'
import { CheckOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { FormikErrors, useFormik } from 'formik'
import FormFieldsManager from '~/components/FormFieldsManager'
import FormCreation from '~/types/formCreation'
import WithLabel from '~/components/WithLabel'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postForm, updateForm } from '~/network/forms'
import { useRouter } from 'next/navigation'
import validate from './validate'

const { Text } = Typography

interface FormProps {
    formId: string
    form: FormCreation
    isUpdate: boolean
}

const cleanBeforeSend = (form: FormCreation) => {
    return {
        ...form,
        fields: form.fields.map((field) => ({
            ...field,
            tempId: undefined,
        })),
    }
}

const Form = ({ formId, isUpdate, form }: FormProps) => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const formik = useFormik<FormCreation>({
        initialValues: form,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        // onSubmit: (values) => {
        //     alert(JSON.stringify(values, null, 2))
        // },
        onSubmit: (values) => submit.mutate(cleanBeforeSend(values)),
    })

    const submit = useMutation(
        (values: FormCreation) => (isUpdate ? updateForm(formId, values) : postForm(values)),
        {
            onSuccess: () => {
                message.success(`Form ${isUpdate ? 'modified' : 'created'} with success.`)
                queryClient.invalidateQueries({ queryKey: ['forms'] })
                router.push('/admin/forms')
            },
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    return (
        <>
            <Card
                title="Details"
                size="small"
                extra={
                    <Button
                        size="small"
                        type="primary"
                        icon={<CheckOutlined rev={undefined} />}
                        onClick={() => formik.handleSubmit()}
                    >
                        Save form
                    </Button>
                }
            >
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <WithLabel label="Name" error={formik.errors.name}>
                            <Input
                                size="small"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                        </WithLabel>
                    </Col>
                    <Col span={6}>
                        <WithLabel
                            label={
                                <Space>
                                    <Text type="secondary">Send to :</Text>
                                    <Switch
                                        size="small"
                                        checked={formik.values.redirectMail}
                                        onChange={(e) => formik.setFieldValue('sendMail', e)}
                                    />
                                </Space>
                            }
                            error={formik.errors.mailToRedirect}
                        >
                            <Input
                                disabled={!formik.values.redirectMail}
                                size="small"
                                style={{ width: '100%' }}
                                name="mail"
                                value={formik.values.mailToRedirect}
                                onChange={formik.handleChange}
                            />
                        </WithLabel>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <WithLabel label="Success message" error={formik.errors.successMessage}>
                            <Input.TextArea
                                rows={4}
                                size="small"
                                name="successMessage"
                                value={formik.values.successMessage}
                                onChange={formik.handleChange}
                            />
                        </WithLabel>
                    </Col>
                    <Col span={12}>
                        <WithLabel label="Error message" error={formik.errors.errorMessage}>
                            <Input.TextArea
                                rows={4}
                                size="small"
                                name="errorMessage"
                                value={formik.values.errorMessage}
                                onChange={formik.handleChange}
                            />
                        </WithLabel>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[16, 16]}>
                <Col span={18}>
                    <Card
                        title={
                            <Space>
                                <Text>Fields</Text>
                                <Text
                                    type="danger"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 'normal',
                                    }}
                                >
                                    {
                                        (
                                            formik.errors as FormikErrors<
                                                FormCreation & { fieldsGlobal: string }
                                            >
                                        ).fieldsGlobal
                                    }
                                </Text>
                            </Space>
                        }
                        size="small"
                    >
                        <FormFieldsManager
                            value={formik.values.fields}
                            onChange={(name, value) =>
                                formik.setFieldValue(`fields${name ? `.${name}` : ''}`, value)
                            }
                            errors={formik.errors.fields as any[]}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Extra data">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {formik.values.extraData?.map((extra, idx) => (
                                <Space.Compact key={idx} size="small" style={{ width: '100%' }}>
                                    <Input
                                        placeholder="Name"
                                        size="small"
                                        value={extra.name}
                                        onChange={(e) =>
                                            formik.setFieldValue(`extraData.${idx}.name`, e.target.value)
                                        }
                                    />
                                    <Input
                                        placeholder="Value"
                                        size="small"
                                        value={extra.value}
                                        onChange={(e) =>
                                            formik.setFieldValue(`extraData.${idx}.value`, e.target.value)
                                        }
                                    />
                                    <Button
                                        type="primary"
                                        danger
                                        icon={<DeleteOutlined rev={undefined} />}
                                        onClick={() => {
                                            const extras = [...(formik.values.extraData || [])]

                                            extras.splice(idx, 1)
                                            formik.setFieldValue(`extraData`, extras)
                                        }}
                                    />
                                </Space.Compact>
                            ))}

                            <Button
                                icon={<PlusOutlined rev={undefined} />}
                                type="primary"
                                size="small"
                                onClick={() =>
                                    formik.setFieldValue(
                                        `extraData.${formik.values.extraData?.length || 0}`,
                                        {
                                            name: '',
                                            value: '',
                                        }
                                    )
                                }
                            >
                                Add
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Form
