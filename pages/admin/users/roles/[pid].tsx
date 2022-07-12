import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import {
    // Breadcrumb,
    Input,
    Space,
    Button,
    // Select,
    // Radio,
    Typography,
    Card,
    message,
    Spin,
} from 'antd'
// import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import get from 'lodash.get'
// import kebabcase from 'lodash.kebabcase'
import { Prisma } from '@prisma/client'
import type { Role } from '@prisma/client'
import { postRole, editRole, getRoleDetails } from '../../../../network/roles'
import { UseQueryResult, useQuery, useMutation, useQueryClient } from 'react-query'
import Head from 'next/head'

const { Text } = Typography

const initialValues: Prisma.RoleCreateInput = {
    name: '',
}

const validate = (values: Prisma.RoleCreateInput) => {
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
        useFormik<Prisma.RoleCreateInput>({
            initialValues,
            validate,
            onSubmit: async (values) => mutation.mutate({ pid: pid as string, values }),
        })

    const role: UseQueryResult<Role, Error> = useQuery<Role, Error>(
        ['roles', { id: pid }],
        () => getRoleDetails(pid as string),
        {
            refetchOnWindowFocus: false,
            enabled: !!pid && pid !== 'create',
            onSuccess: (data: Role) => setValues(data),
            onError: (err) => router.push('/admin/users'),
        }
    )

    const mutation = useMutation(
        (data: { pid: string; values: Prisma.RoleCreateInput }) =>
            data.pid === 'create' ? postRole(data.values) : editRole(data.pid, data.values),
        {
            onSuccess: (data: Role) => {
                message.success(`User types ${data.name} saved`)
                queryClient.invalidateQueries('roles')
                router.push('/admin/users/types')
            },
            onError: (err) => {
                message.error('An error occured, while creating or updating the user types')
                queryClient.invalidateQueries('roles')
                router.push('/admin/users/types')
            },
        }
    )

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (role.isLoading || !pid) {
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
                <title>Admin - User Types</title>
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
                    <Card title="Description">
                        <Space direction="vertical">
                            <Text>Name</Text>
                            <Input
                                style={{ width: 240 }}
                                value={get(values, 'name', '')!}
                                onChange={(e) => onHandleChange('name', e.target.value)}
                            />
                        </Space>
                    </Card>

                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Space>
            </form>
        </>
    )
}

UsersCreation.requireAuth = true

export default UsersCreation
