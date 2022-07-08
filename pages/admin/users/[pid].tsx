import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import {
    // Breadcrumb,
    Input,
    Space,
    Button,
    // Select,
    Divider,
    // Radio,
    Typography,
    Select,
    Card,
} from 'antd'
// import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import get from 'lodash.get'
// import kebabcase from 'lodash.kebabcase'
import { Prisma } from '@prisma/client'
// import type { Page } from '@prisma/client'
import { postUser, editUser, getUser } from '../../../network/users'
import { UseQueryResult, useQuery, useMutation } from 'react-query'
import { FullUser, UserCreation } from '@types'

const { Text, Title } = Typography

const initialValues: UserCreation = {
    type: 'user',
    name: '',
    email: '',
    password: '',
}

const validate = (values: UserCreation) => {
    let errors: any = {}

    // if (!values.title) {
    //     errors.title = 'Required'
    // }

    // const splittedSlug = values.slug.split('/')
    // for (const slug of splittedSlug) {
    //     if (!slug) {
    //         errors.slug = 'Forbiden slug'
    //         break
    //     }
    // }

    // if (!values.slug) {
    //     errors.slug = 'Required'
    // }

    // if (forbidenSlugs.includes(values.slug.split('/')[0])) {
    //     errors.slug = 'Forbiden slug'
    // }

    return errors
}

const UsersCreation = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { pid } = router.query

    const { values, /*errors,*/ handleChange, handleSubmit, setValues } =
        useFormik<UserCreation>({
            initialValues,
            validate,
            onSubmit: async (values) => mutation.mutate({ pid: pid as string, values }),
        })

    const user: UseQueryResult<FullUser, Error> = useQuery<FullUser, Error>(
        ['users', { id: pid }],
        () => getUser(pid as string),
        {
            refetchOnWindowFocus: false,
            enabled: !!pid && pid !== 'create',
            onSuccess: (data: FullUser) =>
                setValues({
                    type: data.type,
                    name: '',
                    email: '',
                }),
            onError: (err) => router.push('/admin/users'),
        }
    )

    // const mutation = useMutation(
    //     (data: { pid: string; values: UserCreation }) =>
    //         data.pid === 'create'
    //             ? postUser(data.values)
    //             : editUser(data.pid, data.values),
    //     {
    //         onSuccess: (data: Element) => {
    //             message.success(`Element ${data.title} saved`)
    //             router.push('/admin/elements')
    //         },
    //         onError: (err) => {
    //             message.error('An error occured, while creating or updating the element')
    //             router.push('/admin/elements')
    //         },
    //     }
    // )

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    // if (user.isLoading || !pid) {
    //     return (
    //         <div
    //             style={{
    //                 height: '50vh',
    //                 width: '100vw',
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 backgroundColor: '#f0f2f5',
    //             }}
    //         >
    //             <Spin size="large" tip="Loading..." />
    //         </div>
    //     )
    // }

    return (
        <form onSubmit={handleSubmit}>
            <Space
                direction="vertical"
                size="large"
                style={{
                    width: '100%',
                    padding: 15,
                    backgroundColor: '#f0f2f5',
                }}
            >
                <Space
                    direction="vertical"
                    style={{
                        width: '100%',
                    }}
                >
                    <Card title="Description">
                        <Space
                            direction="vertical"
                            style={{
                                width: '100%',
                            }}
                        >
                            <Space size="large">
                                <Space direction="vertical">
                                    <Text>Name</Text>
                                    <Input
                                        style={{ width: 240 }}
                                        value={get(values, 'name', '')!}
                                        onChange={(e) =>
                                            onHandleChange('name', e.target.value)
                                        }
                                    />
                                </Space>

                                <Space direction="vertical">
                                    <Text>Type</Text>
                                    <Select
                                        value={values.type}
                                        style={{ width: 240 }}
                                        onChange={(e) => onHandleChange('type', e)}
                                        disabled={values.type === 'super-admin'}
                                    >
                                        <Select.Option value="user">User</Select.Option>
                                        <Select.Option value="admin">Admin</Select.Option>
                                        {values.type === 'super-admin' && (
                                            <Select.Option disabled value="super-admin">
                                                Admin
                                            </Select.Option>
                                        )}
                                    </Select>
                                </Space>
                            </Space>
                            <Divider />
                            <Space size="large">
                                <Space direction="vertical">
                                    <Text>Email</Text>
                                    <Input
                                        style={{ width: 240 }}
                                        value={get(values, 'email', '')}
                                        onChange={(e) =>
                                            onHandleChange('email', e.target.value)
                                        }
                                    />
                                </Space>

                                <Space direction="vertical">
                                    <Text>Password</Text>
                                    <Input.Password
                                        style={{ width: 240 }}
                                        value={get(values, 'password', '')}
                                        onChange={(e) =>
                                            onHandleChange('password', e.target.value)
                                        }
                                    />
                                </Space>
                            </Space>
                        </Space>
                    </Card>

                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Space>
            </Space>
        </form>
    )
}

UsersCreation.requireAuth = true

export default UsersCreation
