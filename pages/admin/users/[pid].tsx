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
    Card,
    message,
    Spin,
} from 'antd'
// import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import get from 'lodash.get'
// import kebabcase from 'lodash.kebabcase'
// import type { Page } from '@prisma/client'
import { postUser, editUser, getUser } from '../../../network/users'
import { UseQueryResult, useQuery, useMutation, useQueryClient } from 'react-query'
import { FullUser, UserCreation } from '@types'
import CustomSelect from '@components/CustomSelect'
import Head from 'next/head'

const { Text } = Typography

const initialValues: UserCreation = {
    type: '',
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
    const router = useRouter()
    const { pid } = router.query
    const queryClient = useQueryClient()

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
            enabled: !!pid && pid !== 'create',
            onSuccess: (data: FullUser) =>
                setValues({
                    type: data.login?.roleId,
                    name: data.name,
                    email: data.login?.email,
                }),
            onError: (err) => router.push('/admin/users'),
        }
    )

    const mutation = useMutation(
        (data: { pid: string; values: UserCreation }) =>
            data.pid === 'create' ? postUser(data.values) : editUser(data.pid, data.values),
        {
            onSuccess: (data: FullUser) => {
                message.success(`Element ${data.name} saved`)
                queryClient.invalidateQueries('users')
                router.push('/admin/users')
            },
            onError: (err) => {
                message.error('An error occured, while creating or updating the element')
                queryClient.invalidateQueries('users')
                router.push('/admin/users')
            },
        }
    )

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (user.isLoading || !pid) {
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
                <title>Admin - Users</title>
            </Head>

            <form onSubmit={handleSubmit}>
                <Space
                    direction="vertical"
                    size="large"
                    style={{
                        width: '100%',
                        minHeight: 'calc(100vh - 29px)',
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
                                        <CustomSelect.ListRoles
                                            value={values.type}
                                            onChange={(e) => onHandleChange('type', e)}
                                        />
                                        {/* <Select
                                        style={{ width: 240 }}
                                        disabled={values.type === 'super-admin'}
                                    >
                                        <Select.Option value="user">User</Select.Option>
                                        <Select.Option value="admin">Admin</Select.Option>
                                        {values.type === 'super-admin' && (
                                            <Select.Option disabled value="super-admin">
                                                Admin
                                            </Select.Option>
                                        )}
                                    </Select> */}
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

                        <Button loading={mutation.isLoading} type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Space>
                </Space>
            </form>
        </>
    )
}

UsersCreation.requireAuth = true

export default UsersCreation
