import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { Input, Space, Button, Typography, Card, Select, message, Spin } from 'antd'
import get from 'lodash.get'
import { editElement, getElementDetails, postElement } from '../../../network/elements'
import { Prisma, Element } from '@prisma/client'
import Blocks from '../../../blocks'
import GetEditComponent from '../../../components/GetEditComponent'
import { useMutation, useQuery, UseQueryResult, useQueryClient } from 'react-query'
import Head from 'next/head'

const { Text } = Typography

const initialValues: Prisma.ElementCreateInput = {
    title: '',
    type: '',
    content: '{}',
}

const validate = (values: Prisma.ElementCreateInput) => {
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

    return errors
}

const Admin = () => {
    const router = useRouter()
    const { pid } = router.query
    const queryClient = useQueryClient()

    const { values, /*errors,*/ handleSubmit, handleChange, setValues } =
        useFormik<Prisma.ElementCreateInput>({
            initialValues,
            validate,
            onSubmit: async (values) => mutation.mutate({ pid: pid as string, values }),
        })

    const element: UseQueryResult<Prisma.ElementCreateInput, Error> = useQuery<
        Prisma.ElementCreateInput,
        Error
    >(['elements', { id: pid }], () => getElementDetails(pid as string), {
        enabled: !!pid && pid !== 'create',
        onSuccess: (data: Prisma.ElementCreateInput) => setValues(data),
        onError: (err) => router.push('/admin/articles'),
    })

    const mutation = useMutation(
        (data: { pid: string; values: Prisma.ElementCreateInput }) =>
            data.pid === 'create'
                ? postElement(data.values)
                : editElement(data.pid, data.values),
        {
            onSuccess: (data: Element) => {
                message.success(`Element ${data.title} saved`)
                queryClient.invalidateQueries('elements')
                router.push('/admin/elements')
            },
            onError: (err) => {
                message.error('An error occured, while creating or updating the element')
                queryClient.invalidateQueries('elements')
                router.push('/admin/elements')
            },
        }
    )

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (element.isLoading || !pid) {
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
                <title>Admin - Elements</title>
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
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Card title="Description">
                            <Space size="large">
                                <Space direction="vertical">
                                    <Text>Title</Text>
                                    <Input
                                        style={{ width: 240 }}
                                        value={get(values, 'title', '')}
                                        onChange={(e) =>
                                            onHandleChange('title', e.target.value)
                                        }
                                    />
                                </Space>
                            </Space>
                        </Card>

                        <Card
                            bodyStyle={{ padding: 0 }}
                            title={
                                <Space>
                                    <Select
                                        value={values.type}
                                        onChange={(e) => onHandleChange('type', e)}
                                        style={{ width: 240 }}
                                    >
                                        {Object.keys(Blocks).map((key) => (
                                            <Select.Option key={key} value={key}>
                                                {get(Blocks, `${key}.name`, '')}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Space>
                            }
                            style={{ flex: 1 }}
                        >
                            <GetEditComponent
                                type={values.type}
                                defaultValues={values.content}
                                onChange={(e) => onHandleChange('content', e)}
                            />
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

Admin.requireAuth = true

export default Admin
