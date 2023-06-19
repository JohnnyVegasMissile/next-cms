'use client'

import { Button, Card, Col, Divider, Input, Row, Typography, message } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'

import WithLabel from '~/components/WithLabel'
import UserCreation from '~/types/userCreation'
import { postUser, updateUser } from '~/network/users'
import ListSelect from '~/components/ListSelect'

const { Text } = Typography

const validate = (values: UserCreation) => {
    const errors: any = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    if (!values.role) {
        errors.role = 'Required'
    }

    if (!values.email) {
        errors.email = 'Required'
    }

    // if (!values.password) {
    //     errors.password = 'Required'
    // }

    return errors
}

interface FormUserProps {
    userId: string
    isUpdate: boolean
    user: UserCreation
}

const Form = ({ userId, isUpdate, user }: FormUserProps) => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const formik = useFormik({
        initialValues: user,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(values),
    })

    const submit = useMutation(
        (values: UserCreation) => (isUpdate ? updateUser(userId, values) : postUser(values)),
        {
            onSuccess: () => {
                message.success(`User ${isUpdate ? 'modified' : 'created'} with success.`)
                queryClient.invalidateQueries({ queryKey: ['users'] })
                router.push('/admin/users')
            },
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{isUpdate ? 'Update' : 'Create new'} user</Text>

                    <Button
                        type="primary"
                        icon={<CheckOutlined rev={undefined} />}
                        size="small"
                        onClick={() => formik.handleSubmit()}
                        loading={submit.isLoading}
                    >
                        {isUpdate ? 'Update user' : 'Create new'}
                    </Button>
                </div>
            </Card>

            <Card size="small" title="Information">
                <Row gutter={[16, 16]}>
                    <Col span={8}>
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

                    <Col span={8}>
                        <WithLabel label="Role :" error={formik.errors.role}>
                            <ListSelect.Role
                                error={!!formik.errors.role}
                                style={{ width: '100%' }}
                                value={formik.values.role}
                                onChange={(e) => formik.setFieldValue('role', e)}
                            />
                        </WithLabel>
                    </Col>

                    <Divider />

                    <Col span={8}>
                        <WithLabel label="Email :" error={formik.errors.email}>
                            <Input
                                size="small"
                                status={!!formik.errors.email ? 'error' : undefined}
                                style={{ width: '100%' }}
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                        </WithLabel>
                    </Col>

                    <Col span={8}>
                        <WithLabel label="Password :" error={formik.errors.password}>
                            <Input.Password
                                size="small"
                                status={!!formik.errors.password ? 'error' : undefined}
                                style={{ width: '100%' }}
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                        </WithLabel>
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default Form
