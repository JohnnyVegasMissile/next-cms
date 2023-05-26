'use client'

import { Button, Card, Col, Row, Input, Space, Typography, Switch, Divider } from 'antd'
import { CheckOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useFormik } from 'formik'
import FormFieldsManager from '~/components/FormFieldsManager'
import FormCreation from '~/types/formCreation'
import WithLabel from '~/components/WithLabel'
import { isEmail } from '~/utilities'
import { FormFieldType } from '@prisma/client'
import set from 'lodash.set'

const { Text } = Typography

const initialValues: FormCreation = {
    name: '',

    sendMail: false,
    mail: '',

    successMessage: '',
    errorMessage: '',

    extraData: [],
    fields: [],
}

const validate = (values: FormCreation) => {
    let errors: any = {}

    if (!values.name) {
        errors.name = 'Name is required'
    }

    if (!!values.sendMail) {
        if (!values.mail) {
            errors.mail = 'Mail is required'
        } else if (!isEmail(values.mail)) {
            errors.mail = 'Mail is not valid'
        }
    }

    for (let fieldIdx = 0; fieldIdx < values.fields.length; fieldIdx++) {
        if (!values.fields[fieldIdx]?.label) set(errors, `fields.${fieldIdx}.label`, 'Label is required')

        switch (values.fields?.[fieldIdx]?.type) {
            case FormFieldType.EMAIL:
                if (!!values.fields[fieldIdx]?.default && !isEmail(values.fields[fieldIdx]?.default!)) {
                    set(errors, `fields.${fieldIdx}.default`, "It's not a valid email")
                }
                break
            case FormFieldType.OPTION:
            case FormFieldType.MULTICHECKBOX:
            case FormFieldType.RADIO:
                if (!values.fields[fieldIdx]?.options?.length) {
                    set(errors, `fields.${fieldIdx}.options`, 'Options are required')
                } else {
                    for (
                        let optionIdx = 0;
                        optionIdx < values.fields[fieldIdx]?.options?.length!;
                        optionIdx++
                    ) {
                        if (!values.fields[fieldIdx]?.options?.[optionIdx]?.value) {
                            set(errors, `fields.${fieldIdx}.options`, 'Values are required')
                            break
                        }

                        const foundIndex = values.fields[fieldIdx]?.options?.findIndex(
                            (e) => e.value === values.fields[fieldIdx]?.options?.[optionIdx]?.value
                        )

                        if (foundIndex !== -1 && foundIndex !== optionIdx) {
                            set(errors, `fields.${fieldIdx}.options`, 'No duplicate values')
                            break
                        }
                    }
                }

                if (values.fields?.[fieldIdx]?.type === FormFieldType.MULTICHECKBOX) {
                    const defaults = values.fields[fieldIdx]?.default?.split(', ')

                    for (let defaultIdx = 0; defaultIdx < defaults?.length!; defaultIdx++) {
                        const foundIndex = values.fields[fieldIdx]?.options?.findIndex(
                            (e) => e.value === defaults?.[defaultIdx]
                        )

                        if (foundIndex === -1) {
                            set(errors, `fields.${fieldIdx}.default`, 'Default value must be in options')
                            break
                        }
                    }
                } else if (!!values.fields?.[fieldIdx]?.default) {
                    const foundIndex = values.fields?.[fieldIdx]?.options?.findIndex(
                        (e) => e.value === values.fields?.[fieldIdx]?.default
                    )

                    if (foundIndex === -1)
                        set(errors, `fields.${fieldIdx}.default`, 'Default value must be in options')
                }
                break
            case FormFieldType.CONTENT:
                if (!values.fields?.[fieldIdx]?.containerId)
                    set(errors, `fields.${fieldIdx}.containerId`, 'Container is required')

                break

            default:
                break
        }
    }

    return errors
}

const Settings = () => {
    const formik = useFormik<FormCreation>({
        initialValues,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2))
        },
    })

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
                                        checked={formik.values.sendMail}
                                        onChange={(e) => formik.setFieldValue('sendMail', e)}
                                    />
                                </Space>
                            }
                            error={formik.errors.mail}
                        >
                            <Input
                                disabled={!formik.values.sendMail}
                                size="small"
                                style={{ width: '100%' }}
                                name="mail"
                                value={formik.values.mail}
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
                        <WithLabel label="Success message" error={formik.errors.errorMessage}>
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
                    <Card title="Fields" size="small">
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

export default Settings
