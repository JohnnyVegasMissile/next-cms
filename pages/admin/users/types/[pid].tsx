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
    message,
    Spin,
} from 'antd'
// import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import get from 'lodash.get'
// import kebabcase from 'lodash.kebabcase'
import { Prisma } from '@prisma/client'
import type { UserType } from '@prisma/client'
import { postUserType, editUserType, getUserTypeDetails } from '../../../../network/userTypes'
import { UseQueryResult, useQuery, useMutation, useQueryClient } from 'react-query'

const { Text, Title } = Typography

const initialValues: Prisma.UserTypeCreateInput = {
    name: '',
}

const validate = (values: Prisma.UserTypeCreateInput) => {
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
        useFormik<Prisma.UserTypeCreateInput>({
            initialValues,
            validate,
            onSubmit: async (values) => mutation.mutate({ pid: pid as string, values }),
        })

    const userType: UseQueryResult<UserType, Error> = useQuery<UserType, Error>(
        ['userTypes', { id: pid }],
        () => getUserTypeDetails(pid as string),
        {
            refetchOnWindowFocus: false,
            enabled: !!pid && pid !== 'create',
            onSuccess: (data: UserType) => setValues(data),
            onError: (err) => router.push('/admin/users'),
        }
    )

    const mutation = useMutation(
        (data: { pid: string; values: Prisma.UserTypeCreateInput }) =>
            data.pid === 'create'
                ? postUserType(data.values)
                : editUserType(data.pid, data.values),
        {
            onSuccess: (data: UserType) => {
                message.success(`User types ${data.name} saved`)
                queryClient.invalidateQueries('userTypes')
                router.push('/admin/users/types')
            },
            onError: (err) => {
                message.error('An error occured, while creating or updating the user types')
                queryClient.invalidateQueries('userTypes')
                router.push('/admin/users/types')
            },
        }
    )

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (userType.isLoading || !pid) {
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
    )
}

UsersCreation.requireAuth = true

export default UsersCreation
