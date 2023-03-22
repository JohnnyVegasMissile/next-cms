'use client'

import { useState } from 'react'
import { Button, Card, Col, Divider, Input, Row, Select, Space, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import MenuLine from '~/components/MenuLine'
import { useFormik } from 'formik'
import get from 'lodash.get'
import LinkSelect, { LinkValue } from '~/components/LinkSelect'

const { Text } = Typography

const DEFAULT_CHILD = { label: '', type: 'title', childrens: [] }

const initialValues: Menu = {
    name: '',
    menuItems: [],
}

type Child<T> = {
    label: string
    type: 'title' | 'content' | 'link'
    link?: LinkValue
    container?: string
    childrens: T
}

type Menu = {
    name: string
    menuItems: Child<Child<Child<undefined>[]>[]>[]
}

const CreateMenu = () => {
    const [selected, setSelected] = useState<number[] | undefined>()
    const formik = useFormik({
        initialValues,
        // validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2))
        },
    })

    const handleSelection = (key: number[]) => {
        if (key === selected) setSelected(undefined)
        else setSelected(key)
    }

    const areEqual = (a: number[] | undefined, b: number[] | undefined) =>
        JSON.stringify(a) === JSON.stringify(b)

    const nameSelected = `menuItems.${selected?.join('.childrens.')}`
    const selectedMenu = get(formik, `values.${nameSelected}`) as unknown as Child<any>

    return (
        <Card bordered={false} title="Menu" size="small">
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Space direction="vertical" size={3} style={{ flex: 1, width: '100%' }}>
                        <Text type="secondary">name :</Text>
                        <Input
                            size="small"
                            // status={!!formik.errors.title ? "error" : undefined}
                            style={{ width: '100%' }}
                            name="title"
                            // value={formik.values.title}
                            // onChange={formik.handleChange}
                        />
                        {/* <Text type="danger">{formik.errors.title}</Text> */}
                    </Space>
                </Col>
                <Col span={8}>
                    <Card></Card>
                </Col>
            </Row>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Space direction="vertical" style={{ flex: 1 }}>
                    <Space direction="vertical" size={3} style={{ flex: 1 }}>
                        <Text type="secondary">name :</Text>
                        <Input
                            size="small"
                            // status={!!formik.errors.title ? "error" : undefined}
                            // style={{ width: "100%" }}
                            name="title"
                            // value={formik.values.title}
                            // onChange={formik.handleChange}
                        />
                        {/* <Text type="danger">{formik.errors.title}</Text> */}
                    </Space>

                    <Divider />
                    {formik.values.menuItems.map((level1Menu, idx1) => (
                        <>
                            <MenuLine
                                title={
                                    <Input
                                        size="small"
                                        placeholder="Menu label"
                                        bordered={false}
                                        name={`menuItems.${idx1}.label`}
                                        value={level1Menu.label}
                                        onChange={formik.handleChange}
                                    />
                                }
                                level={0}
                                onClick={() => handleSelection([idx1])}
                                selected={areEqual(selected, [idx1])}
                                addChild={() =>
                                    formik.setFieldValue(`menuItems.${idx1}.childrens`, [
                                        ...(formik.values.menuItems[idx1]?.childrens || []),
                                        DEFAULT_CHILD,
                                    ])
                                }
                            />
                            {level1Menu.childrens?.map((level2Menu, idx2) => (
                                <>
                                    <MenuLine
                                        title={
                                            <Input
                                                size="small"
                                                placeholder="Menu label"
                                                bordered={false}
                                                name={`menuItems.${idx1}.childrens.${idx2}.label`}
                                                value={level2Menu.label}
                                                onChange={formik.handleChange}
                                            />
                                        }
                                        level={1}
                                        onClick={() => handleSelection([idx1, idx2])}
                                        selected={areEqual(selected, [idx1, idx2])}
                                        addChild={() =>
                                            formik.setFieldValue(
                                                `menuItems.${idx1}.childrens.${idx2}.childrens`,
                                                [
                                                    ...(formik.values.menuItems[idx1]?.childrens[idx2]
                                                        ?.childrens || []),
                                                    DEFAULT_CHILD,
                                                ]
                                            )
                                        }
                                    />
                                    {level2Menu.childrens?.map((level3Menu, idx3) => (
                                        <>
                                            <MenuLine
                                                title={
                                                    <Input
                                                        size="small"
                                                        placeholder="Menu label"
                                                        bordered={false}
                                                        name={`menuItems.${idx1}.childrens.${idx2}.childrens.${idx3}.label`}
                                                        value={level3Menu.label}
                                                        onChange={formik.handleChange}
                                                    />
                                                }
                                                // title={level3Menu.label}
                                                level={2}
                                                onClick={() => handleSelection([idx1, idx2, idx3])}
                                                selected={areEqual(selected, [idx1, idx2, idx3])}
                                            />
                                        </>
                                    ))}
                                </>
                            ))}
                        </>
                    ))}

                    <MenuLine.Add
                        onClick={() =>
                            formik.setFieldValue('menuItems', [...formik.values.menuItems, DEFAULT_CHILD])
                        }
                    />
                </Space>

                {selected && (
                    <Card
                        title={
                            <Space>
                                <Text>Type :</Text>
                                <Select
                                    size="small"
                                    value={selectedMenu.type}
                                    onChange={(e) => formik.setFieldValue(`${nameSelected}.type`, e)}
                                    options={[
                                        { value: 'title', label: 'Title' },
                                        { value: 'contents', label: 'Contents' },
                                        { value: 'link', label: 'Link' },
                                    ]}
                                    style={{ width: 190 }}
                                />
                            </Space>
                        }
                        size="small"
                        extra={
                            !!selected ? (
                                <Button
                                    type="primary"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        // selected[0]
                                    }}
                                />
                            ) : undefined
                        }
                        style={{ width: 500 }}
                    >
                        {selectedMenu.link && (
                            <LinkSelect
                                value={selectedMenu.link}
                                onChange={(e) => formik.setFieldValue(`${nameSelected}.link`, e)}
                            />
                        )}
                    </Card>
                )}
            </div>
            {/* {JSON.stringify(formik.values, null, 2)} */}
        </Card>
    )
}

export default CreateMenu
