import { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import {
    // Breadcrumb,
    Input,
    Space,
    Button,
    // Select,
    Divider,
    Radio,
    Typography,
    Select,
} from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import get from 'lodash.get'
import kebabcase from 'lodash.kebabcase'
// import { Prisma } from '@prisma/client'
import type { Page } from '@prisma/client'
import { postUser, editUser, getUser } from '../../../network/users'

const { Title } = Typography

interface UserCreation {
    type: string
    name: string
    email: string
    password: string
}

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

    const { values, errors, handleChange, handleSubmit, setValues } =
        useFormik<UserCreation>({
            initialValues,
            validate,
            onSubmit: async (values) => {
                setLoading(true)
                if (pid === 'create') {
                    await postUser(values)
                } else {
                    const id = pid as string
                    await editUser(id, values)
                }
                router.push('/admin/users')
                setLoading(false)
            },
        })

    useEffect(() => {
        const getPageInfos = async () => {
            if (pid === undefined) {
                return
            }
            if (pid !== 'create') {
                const id = pid as string
                const data = await getUser(id)
                setValues({
                    type: data?.login?.type || 'user',
                    name: data.name || '',
                    email: data?.login?.email || '',
                    password: '',
                })
            } else {
                setValues(initialValues)
            }
        }
        getPageInfos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid])

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (loading || pid === undefined) {
        return <div>Loading...</div>
    }

    return (
        <form onSubmit={handleSubmit}>
            <Space
                direction="vertical"
                size="large"
                style={{ width: '100%', padding: 15 }}
            >
                <Space direction="vertical" size={0}>
                    <Title level={5}>Title</Title>
                    <Input
                        value={get(values, 'name', '')}
                        onChange={(e) => onHandleChange('name', e.target.value)}
                    />

                    <Divider />

                    <Input
                        value={get(values, 'email', '')}
                        onChange={(e) =>
                            onHandleChange('email', e.target.value)
                        }
                    />

                    <Divider />

                    <Select
                        value={values.type}
                        style={{ width: 200 }}
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

                    <Divider />

                    <Input.Password
                        value={get(values, 'password', '')}
                        onChange={(e) =>
                            onHandleChange('password', e.target.value)
                        }
                    />

                    <Divider />

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
