'use client'

import { Fragment, useState } from 'react'
import { Button, Card, Col, Divider, Input, Row, Select, Space, Spin, Typography } from 'antd'
import { DeleteOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons'
import MenuLine from '~/components/MenuLine'
import { useFormik } from 'formik'
import get from 'lodash.get'
import LinkSelect from '~/components/LinkSelect'
import WithLabel from '~/components/WithLabel'
import ListSelect from '~/components/ListSelect'
import ContentsFilter from '~/components/ContentsFilter'
import { useQuery } from '@tanstack/react-query'
import { getContainer } from '~/network/containers'
import MenuCreation, { MenuChild } from '~/types/menuCreation'
import set from 'lodash.set'

const { Text } = Typography

const labelize = {
    TITLE: 'Title',
    LINK: 'Link',
    CONTENT: 'Content',
}

const initialValues: MenuCreation = {
    name: '',
    menuItems: [],
}

const validate = (values: MenuCreation) => {
    let errors: any = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    for (let i = 0; i < values.menuItems.length; i++) {
        const menuFirstLevel = values.menuItems[i]
        const menuFirstName = `menuItems.${i}`
        if (!menuFirstLevel) continue

        if (!menuFirstLevel.label) {
            set(errors, `${menuFirstName}.label`, 'Required')
        }

        if (menuFirstLevel.type === 'CONTENT' && !menuFirstLevel.container) {
            set(errors, `${menuFirstName}.container`, 'Required')
        } else if (
            menuFirstLevel.type === 'LINK' &&
            !menuFirstLevel.link?.link &&
            !menuFirstLevel.link?.slugId
        ) {
            set(errors, `${menuFirstName}.link`, 'Required')
        }

        for (let j = 0; j < (menuFirstLevel.childrens?.length || 0); j++) {
            const menuSecondLevel = menuFirstLevel.childrens?.[j]
            const menuSecondName = `${menuFirstName}.childrens.${j}`
            if (!menuSecondLevel) continue

            if (!menuSecondLevel?.label) {
                set(errors, `${menuSecondName}.label`, 'Required')
            }

            if (menuSecondLevel.type === 'CONTENT' && !menuSecondLevel.container) {
                set(errors, `.${menuSecondName}.container`, 'Required')
            } else if (
                menuSecondLevel.type === 'LINK' &&
                !menuSecondLevel.link?.link &&
                !menuSecondLevel.link?.slugId
            ) {
                set(errors, `${menuSecondName}.link`, 'Required')
            }

            for (let k = 0; k < (menuSecondLevel.childrens?.length || 0); k++) {
                const menuThirdLevel = menuSecondLevel.childrens[k]
                const menuThirdName = `${menuSecondName}.childrens.${k}`
                if (!menuThirdLevel) continue

                if (!menuThirdLevel.label) {
                    set(errors, `${menuThirdName}.label`, 'Required')
                }

                if (menuThirdLevel.type === 'CONTENT' && !menuThirdLevel.container) {
                    set(errors, `${menuThirdName}.container`, 'Required')
                } else if (
                    menuThirdLevel.type === 'LINK' &&
                    !menuThirdLevel.link?.link &&
                    !menuThirdLevel.link?.slugId
                ) {
                    set(errors, `${menuThirdName}.link`, 'Required')
                }
            }
        }
    }

    console.log('errors', errors)

    return errors
}

const CreateMenu = ({ params }: any) => {
    const { menuId } = params
    const isUpdate = menuId !== 'create'
    const [selected, setSelected] = useState<number[] | undefined>()
    const formik = useFormik({
        initialValues,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => {
            // const filters = values.menuItems[0]?.filters?.forEach((filter) => {})

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
    const selectedMenu = get(formik, `values.${nameSelected}`) as unknown as MenuChild<any>
    const selectedError = get(formik, `errors.${nameSelected}`) as any

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
                        icon={<CheckOutlined />}
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
                                        title={labelize[level1Menu.type]}
                                        name={`menuItems.${idx1}.label`}
                                        type={level1Menu.type}
                                        error={get(formik, `errors.menuItems.${idx1}`)}
                                        label={level1Menu.label}
                                        onLabelChange={formik.handleChange}
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
                                                title={labelize[level2Menu.type]}
                                                name={`menuItems.${idx1}.childrens.${idx2}.label`}
                                                type={level2Menu.type}
                                                error={get(
                                                    formik,
                                                    `errors.menuItems.${idx1}.childrens.${idx2}`
                                                )}
                                                label={level2Menu.label}
                                                onLabelChange={formik.handleChange}
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
                                                    title={labelize[level3Menu.type]}
                                                    name={`menuItems.${idx1}.childrens.${idx2}.childrens.${idx3}.label`}
                                                    type={level3Menu.type}
                                                    error={get(
                                                        formik,
                                                        `errors.menuItems.${idx1}.childrens.${idx2}.childrens.${idx3}`
                                                    )}
                                                    label={level3Menu.label}
                                                    onLabelChange={formik.handleChange}
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
                                        icon={<DeleteOutlined />}
                                        onClick={onDelete}
                                    />
                                }
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {selectedMenu.type === 'LINK' && (
                                        <WithLabel label="Link" error={selectedError?.link}>
                                            <LinkSelect
                                                error={selectedError?.link}
                                                value={selectedMenu.link!}
                                                onChange={(e) =>
                                                    formik.setFieldValue(`${nameSelected}.link`, e)
                                                }
                                            />
                                        </WithLabel>
                                    )}

                                    {selectedMenu.type === 'CONTENT' && (
                                        <>
                                            <WithLabel label="Container" error={selectedError?.container}>
                                                <ListSelect.Container
                                                    error={selectedError?.container}
                                                    value={selectedMenu.container}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(`${nameSelected}.container`, e)
                                                    }
                                                />
                                            </WithLabel>

                                            {!!selectedMenu.container && container.isFetching && (
                                                <div
                                                    style={{
                                                        padding: 8,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Spin />
                                                </div>
                                            )}

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
                                                            values={selectedMenu.filters!}
                                                            onChange={(e) => {
                                                                console.log(`${nameSelected}.filters`, e)
                                                                formik.setFieldValue(
                                                                    `${nameSelected}.filters`,
                                                                    e
                                                                )
                                                            }}
                                                        />
                                                        {/* <Divider
                                                            style={{ marginTop: 0, marginBottom: '0.5rem' }}
                                                        /> */}

                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <div style={{ minWidth: 85 }}>
                                                                <Text type="secondary">Order by :</Text>
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <Space.Compact block size="small">
                                                                    <Select
                                                                        allowClear
                                                                        value={selectedMenu.orderByField}
                                                                        onChange={(e) =>
                                                                            formik.setFieldValue(
                                                                                `${nameSelected}.orderByField`,
                                                                                e
                                                                            )
                                                                        }
                                                                        style={{ flex: 1 }}
                                                                        options={container.data?.fields
                                                                            .filter((e) => !e.multiple)
                                                                            .map((field) => ({
                                                                                value: field.id,
                                                                                label: field.name,
                                                                            }))}
                                                                    />
                                                                    <Select
                                                                        value={selectedMenu.orderBy}
                                                                        onChange={(e) =>
                                                                            formik.setFieldValue(
                                                                                `${nameSelected}.orderBy`,
                                                                                e
                                                                            )
                                                                        }
                                                                        style={{ width: '33%' }}
                                                                        options={[
                                                                            { value: 'asc', label: 'Asc' },
                                                                            { value: 'desc', label: 'Desc' },
                                                                        ]}
                                                                    />
                                                                </Space.Compact>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}

                                    <Divider>Extras</Divider>

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
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => {
                                                        const extras = [...selectedMenu.extras]

                                                        extras.splice(idx, 1)
                                                        formik.setFieldValue(`${nameSelected}.extras`, extras)
                                                    }}
                                                />
                                            </Space.Compact>
                                        ))}

                                        <Button
                                            icon={<PlusOutlined />}
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
                                </Space>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default CreateMenu
