'use client'

import { Fragment, useState } from 'react'
import { Button, Card, Col, Divider, Input, Row, Space, Spin, Typography } from 'antd'
import { DeleteOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons'
import MenuLine from '~/components/MenuLine'
import { useFormik } from 'formik'
import get from 'lodash.get'
import LinkSelect, { LinkValue } from '~/components/LinkSelect'
import WithLabel from '~/components/WithLabel'
import ListSelect from '~/components/ListSelect'
import { ObjectId } from '~/types'
import ContentsFilter from '~/components/ContentsFilter'
import { useQuery } from '@tanstack/react-query'
import { getContainer } from '~/network/containers'

const { Text } = Typography

// const DEFAULT_CHILD = { label: '', type: 'title', childrens: [] }

const initialValues: Menu = {
    name: '',
    menuItems: [],
}

type Child<T> = {
    label: string
    type: 'TITLE' | 'LINK' | 'CONTENT'
    link?: LinkValue
    extras: { name: string; value: string }[]

    container?: ObjectId
    filters?: any
    childrens: T
}

type Menu = {
    name: string
    menuItems: Child<Child<Child<undefined>[]>[] | undefined>[]
}

const labelize = {
    TITLE: 'Title',
    LINK: 'Link',
    CONTENT: 'Content',
}

const CreateMenu = ({ params }: any) => {
    const { menuId } = params
    const isUpdate = menuId !== 'create'
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

    const onDelete = () => {
        const indexToDelete = selected![selected!?.length - 1]
        const copySelected = [...selected!]
        copySelected.pop()

        const childsName = `${copySelected?.join('.childrens.')}`

        console.log(indexToDelete, copySelected, childsName)
    }

    const container = useQuery(
        ['containers', { id: selectedMenu?.container }],
        () => getContainer(selectedMenu?.container!),
        {
            enabled: !!selectedMenu?.container,
        }
    )

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{isUpdate ? 'Update' : 'Create new'} menu</Text>

                    <Button
                        type="primary"
                        icon={<CheckOutlined rev={undefined} />}
                        size="small"
                        onClick={() => formik.handleSubmit()}
                        // loading={submit.isLoading}
                    >
                        {isUpdate ? 'Update menu' : 'Create new'}
                    </Button>
                </div>
            </Card>

            <Card title="Menu" size="small">
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
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {formik.values.menuItems.map((level1Menu, idx1) => (
                                <Fragment key={idx1}>
                                    <MenuLine
                                        title={
                                            <Space>
                                                <Text>{`${labelize[level1Menu.type]} :`}</Text>
                                                <Input
                                                    size="small"
                                                    placeholder="Menu label"
                                                    bordered={false}
                                                    name={`menuItems.${idx1}.label`}
                                                    value={level1Menu.label}
                                                    onChange={formik.handleChange}
                                                />
                                            </Space>
                                        }
                                        level={0}
                                        onClick={() => handleSelection([idx1])}
                                        selected={areEqual(selected, [idx1])}
                                        addChild={
                                            level1Menu.type === 'CONTENT'
                                                ? undefined
                                                : (type) =>
                                                      formik.setFieldValue(`menuItems.${idx1}.childrens`, [
                                                          ...(formik.values.menuItems[idx1]?.childrens || []),
                                                          {
                                                              label: '',
                                                              childrens: type === 'CONTENT' ? undefined : [],
                                                              filters:
                                                                  type === 'CONTENT' ? new Map() : undefined,
                                                              type,
                                                              link:
                                                                  type === 'LINK'
                                                                      ? {
                                                                            type: 'IN',
                                                                        }
                                                                      : undefined,
                                                              extras: [],
                                                          },
                                                      ])
                                        }
                                    />
                                    {level1Menu.childrens?.map((level2Menu, idx2) => (
                                        <Fragment key={`${idx1}/${idx2}`}>
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
                                                addChild={
                                                    level2Menu.type === 'CONTENT'
                                                        ? undefined
                                                        : (type) =>
                                                              formik.setFieldValue(
                                                                  `menuItems.${idx1}.childrens.${idx2}.childrens`,
                                                                  [
                                                                      ...(formik.values.menuItems?.[idx1]
                                                                          ?.childrens?.[idx2]?.childrens ||
                                                                          []),
                                                                      {
                                                                          label: '',
                                                                          childrens:
                                                                              type === 'CONTENT'
                                                                                  ? undefined
                                                                                  : [],
                                                                          filters:
                                                                              type === 'CONTENT'
                                                                                  ? new Map()
                                                                                  : undefined,
                                                                          type,
                                                                          link:
                                                                              type === 'LINK'
                                                                                  ? {
                                                                                        type: 'IN',
                                                                                    }
                                                                                  : undefined,
                                                                          extras: [],
                                                                      },
                                                                  ]
                                                              )
                                                }
                                            />
                                            {level2Menu.childrens?.map((level3Menu, idx3) => (
                                                <MenuLine
                                                    key={`${idx1}/${idx2}/${idx3}`}
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
                                            ))}
                                        </Fragment>
                                    ))}
                                </Fragment>
                            ))}

                            <MenuLine.Add
                                onClick={(type) => {
                                    formik.setFieldValue('menuItems', [
                                        ...formik.values.menuItems,
                                        {
                                            label: '',
                                            childrens: type === 'CONTENT' ? undefined : [],
                                            filters: type === 'CONTENT' ? new Map() : undefined,
                                            type,
                                            link:
                                                type === 'LINK'
                                                    ? {
                                                          type: 'IN',
                                                      }
                                                    : undefined,
                                            extras: [],
                                        },
                                    ])
                                    handleSelection([formik.values.menuItems.length])
                                }}
                            />
                        </Space>
                    </Col>
                    <Col span={8}>
                        {!!selected && (
                            <Card
                                title={
                                    <Text>
                                        {`${labelize[selectedMenu.type]} : `}
                                        <Text type="secondary">{selectedMenu.label}</Text>
                                    </Text>
                                }
                                size="small"
                                extra={
                                    <Button
                                        size="small"
                                        type="primary"
                                        danger
                                        icon={<DeleteOutlined rev={undefined} />}
                                        onClick={onDelete}
                                    />
                                }
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {selectedMenu.type === 'LINK' && (
                                        <WithLabel label="Link">
                                            <LinkSelect
                                                value={selectedMenu.link!}
                                                onChange={(e) =>
                                                    formik.setFieldValue(`${nameSelected}.link`, e)
                                                }
                                            />
                                        </WithLabel>
                                    )}

                                    {selectedMenu.type === 'CONTENT' && (
                                        <>
                                            <WithLabel label="Container">
                                                <ListSelect.Container
                                                    value={selectedMenu.container}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(`${nameSelected}.container`, e)
                                                    }
                                                />
                                            </WithLabel>

                                            {!!selectedMenu.container && container.isFetching && <Spin />}

                                            {!!selectedMenu.container && !!container.data?.fields?.length && (
                                                <>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 8,
                                                        }}
                                                    >
                                                        <Divider
                                                            style={{ marginTop: '0.5rem', marginBottom: 0 }}
                                                        />
                                                        <ContentsFilter
                                                            fields={container.data?.fields}
                                                            values={selectedMenu.filters}
                                                            onChange={(e) =>
                                                                formik.setFieldValue(
                                                                    `${nameSelected}.filters`,
                                                                    e
                                                                )
                                                            }
                                                        />
                                                        <Divider
                                                            style={{ marginTop: 0, marginBottom: '0.5rem' }}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}

                                    <Divider>Extras</Divider>

                                    {/* <Card size="small"> */}
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        {selectedMenu.extras.map((extra, idx) => (
                                            <Space.Compact key={idx} size="small" style={{ width: '100%' }}>
                                                <Input
                                                    placeholder="Name"
                                                    size="small"
                                                    value={extra.name}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(
                                                            `${nameSelected}.extras.${idx}.name`,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Input
                                                    placeholder="Value"
                                                    size="small"
                                                    value={extra.value}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(
                                                            `${nameSelected}.extras.${idx}.value`,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    type="primary"
                                                    danger
                                                    icon={<DeleteOutlined rev={undefined} />}
                                                    onClick={() => {
                                                        const extras = [...selectedMenu.extras]

                                                        extras.splice(idx, 1)
                                                        formik.setFieldValue(`${nameSelected}.extras`, extras)
                                                    }}
                                                />
                                            </Space.Compact>
                                        ))}

                                        <Button
                                            icon={<PlusOutlined rev={undefined} />}
                                            type="primary"
                                            size="small"
                                            onClick={() =>
                                                formik.setFieldValue(
                                                    `${nameSelected}.extras.${selectedMenu.extras.length}`,
                                                    { name: '', value: '' }
                                                )
                                            }
                                        >
                                            Add
                                        </Button>
                                    </Space>
                                    {/* </Card> */}
                                </Space>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Card>

            {/* <Card title="Menu" size="small">
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
                                                        ...(formik.values.menuItems?.[idx1]?.childrens?.[idx2]
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
            </Card> */}
        </>
    )
}

export default CreateMenu
