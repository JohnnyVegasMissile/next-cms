// 'use client'

// import { Button, Card, Col, Divider, Input, Row, Space, Typography } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
// import { useFormik } from 'formik'

// const { Text } = Typography

// type UserForm = {
//     name: string
//     role: string
//     email: string
//     password: string
// }

// const initialValues = { name: '', role: '', email: '', password: '' }

// const validate = (values: UserForm) => {
//     const errors: any = {}

//     if (!values.name) {
//         errors.name = 'Required'
//     }

//     if (!values.role) {
//         errors.role = 'Required'
//     }

//     if (!values.email) {
//         errors.email = 'Required'
//     }

//     if (!values.password) {
//         errors.password = 'Required'
//     }

//     return errors
// }

// const Settings = () => {
//     const formik = useFormik({
//         initialValues,
//         validate,
//         validateOnChange: false,
//         validateOnBlur: false,
//         validateOnMount: false,
//         onSubmit: (values) => {
//             alert(JSON.stringify(values, null, 2))
//         },
//     })

//     return (
//         <Card
//             title="User"
//             size="small"
//             extra={
//                 <Button
//                     size="small"
//                     type="primary"
//                     icon={<PlusOutlined rev={undefined} />}
//                     onClick={() => formik.handleSubmit()}
//                 >
//                     Save
//                 </Button>
//             }
//         >
//             <Row gutter={[16, 16]}>
//                 <Col span={6}>
//                     <Space direction="vertical" size={3} style={{ width: '100%' }}>
//                         <Text type="secondary">Name :</Text>
//                         <Input
//                             size="small"
//                             status={!!formik.errors.name ? 'error' : undefined}
//                             style={{ width: '100%' }}
//                             name="name"
//                             value={formik.values.name}
//                             onChange={formik.handleChange}
//                         />
//                         <Text type="danger">{formik.errors.name}</Text>
//                     </Space>
//                 </Col>
//                 <Col span={6}>
//                     <Space direction="vertical" size={3} style={{ width: '100%' }}>
//                         <Text type="secondary">Role :</Text>
//                         <Input
//                             size="small"
//                             status={!!formik.errors.role ? 'error' : undefined}
//                             style={{ width: '100%' }}
//                             name="title"
//                             value={formik.values.role}
//                             onChange={formik.handleChange}
//                         />
//                         <Text type="danger">{formik.errors.role}</Text>
//                     </Space>
//                 </Col>
//             </Row>
//             <Divider />
//             <Row gutter={[16, 16]}>
//                 <Col span={6}>
//                     <Space direction="vertical" size={3} style={{ width: '100%' }}>
//                         <Text type="secondary">Email :</Text>
//                         <Input
//                             size="small"
//                             status={!!formik.errors.email ? 'error' : undefined}
//                             style={{ width: '100%' }}
//                             name="title"
//                             value={formik.values.email}
//                             onChange={formik.handleChange}
//                         />
//                         <Text type="danger">{formik.errors.email}</Text>
//                     </Space>
//                 </Col>
//                 <Col span={6}>
//                     <Space direction="vertical" size={3} style={{ width: '100%' }}>
//                         <Text type="secondary">Password :</Text>
//                         <Input.Password
//                             size="small"
//                             status={!!formik.errors.name ? 'error' : undefined}
//                             style={{ width: '100%' }}
//                             name="title"
//                             value={formik.values.name}
//                             onChange={formik.handleChange}
//                         />
//                         <Text type="danger">{formik.errors.name}</Text>
//                     </Space>
//                 </Col>
//             </Row>
//         </Card>
//     )
// }

// export default Settings

//

'use client'

import { useEffect } from 'react'
import { Button, Card, Col, Divider, Input, Row, Spin, Typography, message } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'

import WithLabel from '~/components/WithLabel'
import UserCreation from '~/types/userCreation'
import { getUser, postUser, updateUser } from '~/network/users'
import { User } from '@prisma/client'
import ListSelect from '~/components/ListSelect'

const { Text } = Typography

const initialValues = { name: '', role: '', email: '', password: '' }

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

    if (!values.password) {
        errors.password = 'Required'
    }

    return errors
}

const userToUserCreation = (
    user: User & {
        login: {
            roleId: string | null
            email: string
        } | null
    }
): UserCreation => {
    return {
        name: user.name || '',
        role: user.login?.roleId || '',
        email: user.login?.email || '',
        password: '',
    }
}

const CreateUser = ({ params }: any) => {
    const { userId } = params
    const isUpdate = userId !== 'create'
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

    const details = useMutation(() => getUser(userId), {
        onSuccess: (data) => formik.setValues(userToUserCreation(data)),
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

    useEffect(() => {
        if (isUpdate) details.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (details.isLoading) return <Spin />

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

export default CreateUser
