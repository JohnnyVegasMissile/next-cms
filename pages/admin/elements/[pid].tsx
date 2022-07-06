import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { Input, Space, Button, Typography, Card, Select } from 'antd'
import get from 'lodash.get'
import { editElement, getElementDetails, postElement } from '../../../network/elements'
import { Prisma } from '@prisma/client'
import Blocks from '../../../blocks'
import GetEditComponent from '../../../components/GetEditComponent'

const { Title } = Typography

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
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { pid } = router.query

    const { values, /*errors,*/ handleSubmit, handleChange, setValues } =
        useFormik<Prisma.ElementCreateInput>({
            initialValues,
            validate,
            onSubmit: async (values) => {
                setLoading(true)
                if (pid === 'create') {
                    await postElement(values)
                } else {
                    const id = pid as string

                    await editElement(id, values)
                }
                router.push('/admin/elements')
                setLoading(false)
            },
        })

    useEffect(() => {
        const getPageInfos = async () => {
            if (pid === undefined) {
                return
            }
            if (pid !== 'create') {
                const data = await getElementDetails(pid as string)

                if (!data) router.push('/admin/elements')

                setValues(data)
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
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={5}>Title</Title>
                    <Input
                        value={get(values, 'title', '')}
                        onChange={(e) => onHandleChange('title', e.target.value)}
                    />

                    <Card
                        bodyStyle={{ padding: 0 }}
                        title={
                            <Space>
                                <Select
                                    value={values.type}
                                    onChange={(e) => onHandleChange('type', e)}
                                    style={{ width: 250 }}
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

                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Space>
            </Space>
        </form>
    )
}

Admin.requireAuth = true

export default Admin
