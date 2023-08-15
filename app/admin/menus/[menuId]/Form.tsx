'use client'

import { Fragment, useState } from 'react'
import { Button, Card, Col, Divider, Input, Row, Select, Space, Spin, Typography, message } from 'antd'
import { DeleteOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons'
import MenuLine from '~/components/MenuLine'
import { useFormik } from 'formik'
import get from 'lodash.get'
import LinkSelect from '~/components/LinkSelect'
import WithLabel from '~/components/WithLabel'
import ListSelect from '~/components/ListSelect'
import ContentsFilter from '~/components/ContentsFilter'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getContainer } from '~/network/containers'
import MenuCreation, { MenuChild } from '~/types/menuCreation'
import set from 'lodash.set'
import { MenuChildType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { tempId } from '~/utilities'

const { Text } = Typography

const labelize = {
    [MenuChildType.TITLE]: 'Title',
    [MenuChildType.LINK]: 'Link',
    [MenuChildType.CONTENT]: 'Content',
}

const initialValues: MenuCreation = {
    name: '',
    childs: [],
}

const validate = (values: MenuCreation) => {
    let errors: any = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    for (let i = 0; i < values.childs.length; i++) {
        const menuFirstLevel = values.childs[i]
        const menuFirstName = `childs.${i}`
        if (!menuFirstLevel) continue

        if (!menuFirstLevel.name) {
            set(errors, `${menuFirstName}.name`, 'Required')
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

        for (let j = 0; j < (menuFirstLevel.childs?.length || 0); j++) {
            const menuSecondLevel = menuFirstLevel.childs?.[j]
            const menuSecondName = `${menuFirstName}.childs.${j}`
            if (!menuSecondLevel) continue

            if (!menuSecondLevel?.name) {
                set(errors, `${menuSecondName}.name`, 'Required')
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

            for (let k = 0; k < (menuSecondLevel.childs?.length || 0); k++) {
                const menuThirdLevel = menuSecondLevel.childs[k]
                const menuThirdName = `${menuSecondName}.childs.${k}`
                if (!menuThirdLevel) continue

                if (!menuThirdLevel.name) {
                    set(errors, `${menuThirdName}.name`, 'Required')
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

    return errors
}

interface FormMenuProps {
    menuId: string
    isUpdate: boolean
    menu: MenuCreation
}

const CreateMenu = ({ menuId, isUpdate, menu }: FormMenuProps) => {
    const [parent] = useAutoAnimate()
    const [selected, setSelected] = useState<number[] | undefined>()
    const router = useRouter()
    const queryClient = useQueryClient()
    const formik = useFormik({
        initialValues,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => {
            // const filters = values.childs[0]?.filters?.forEach((filter) => {})

            alert(JSON.stringify(values, null, 2))
        },
    })

    const submit = useMutation(
        (values: MenuCreation) => (isUpdate ? updateMenu(menuId, values) : postMenu(values)),
        {
            onSuccess: () => {
                message.success(`Menu ${isUpdate ? 'modified' : 'created'} with success.`)
                queryClient.invalidateQueries({ queryKey: ['menus'] })
                router.push('/admin/menus')
            },
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    const handleSelection = (key: number[]) => {
        if (key === selected) setSelected(undefined)
        else setSelected(key)
    }

    const areEqual = (a: number[] | undefined, b: number[] | undefined) =>
        JSON.stringify(a) === JSON.stringify(b)

    const nameSelected = `childs.${selected?.join('.childs.')}`
    const selectedMenu = get(formik, `values.${nameSelected}`) as unknown as MenuChild<any>
    const selectedError = get(formik, `errors.${nameSelected}`) as any

    const onDelete = () => {
        const indexToDelete = selected![selected!?.length - 1]
        const copySelected = [...selected!]
        copySelected.pop()

        const childsName = `${copySelected?.join('.childs.')}`
        const copyMenus = [...(get(formik, `values.${childsName}`) || [])]

        copyMenus.splice(indexToDelete!, indexToDelete)

        formik.setFieldValue(childsName, copyMenus)
        setSelected(undefined)
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
                        size="small"
                        type="primary"
                        icon={<CheckOutlined />}
                        loading={submit.isLoading}
                        onClick={() => formik.handleSubmit()}
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
                        <div ref={parent} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {formik.values.childs.map((level1Menu, idx1) => (
                                <div
                                    key={level1Menu.id || level1Menu.tempId}
                                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                                >
                                    <MenuLine
                                        isFirst={idx1 === 0}
                                        isLast={idx1 === formik.values.childs.length - 1}
                                        onUp={() => {}}
                                        onDown={() => {}}
                                        title={labelize[level1Menu.type]}
                                        name={`childs.${idx1}.label`}
                                        type={level1Menu.type}
                                        error={get(formik, `errors.childs.${idx1}`)}
                                        label={level1Menu.name}
                                        onLabelChange={formik.handleChange}
                                        level={0}
                                        onClick={() => handleSelection([idx1])}
                                        selected={areEqual(selected, [idx1])}
                                        addChild={
                                            level1Menu.type === 'CONTENT'
                                                ? undefined
                                                : (type) =>
                                                      formik.setFieldValue(`childs.${idx1}.childs`, [
                                                          ...(formik.values.childs[idx1]?.childs || []),
                                                          {
                                                              label: '',
                                                              childs: type === 'CONTENT' ? undefined : [],
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
                                    {level1Menu.childs?.map((level2Menu, idx2) => (
                                        <div
                                            key={level2Menu.id || level2Menu.tempId}
                                            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                                        >
                                            <MenuLine
                                                isFirst={idx2 === 0}
                                                isLast={idx2 === level1Menu.childs!.length - 1}
                                                onUp={() => {}}
                                                onDown={() => {}}
                                                title={labelize[level2Menu.type]}
                                                name={`childs.${idx1}.childs.${idx2}.label`}
                                                type={level2Menu.type}
                                                error={get(formik, `errors.childs.${idx1}.childs.${idx2}`)}
                                                label={level2Menu.name}
                                                onLabelChange={formik.handleChange}
                                                level={1}
                                                onClick={() => handleSelection([idx1, idx2])}
                                                selected={areEqual(selected, [idx1, idx2])}
                                                addChild={
                                                    level2Menu.type === 'CONTENT'
                                                        ? undefined
                                                        : (type) =>
                                                              formik.setFieldValue(
                                                                  `childs.${idx1}.childs.${idx2}.childs`,
                                                                  [
                                                                      ...(formik.values.childs?.[idx1]
                                                                          ?.childs?.[idx2]?.childs || []),
                                                                      {
                                                                          label: '',
                                                                          childs:
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
                                            {level2Menu.childs?.map((level3Menu, idx3) => (
                                                <MenuLine
                                                    key={level3Menu.id || level3Menu.tempId}
                                                    isFirst={idx3 === 0}
                                                    isLast={idx3 === level2Menu.childs!.length - 1}
                                                    onUp={() => {}}
                                                    onDown={() => {}}
                                                    title={labelize[level3Menu.type]}
                                                    name={`childs.${idx1}.childs.${idx2}.childs.${idx3}.label`}
                                                    type={level3Menu.type}
                                                    error={get(
                                                        formik,
                                                        `errors.childs.${idx1}.childs.${idx2}.childs.${idx3}`
                                                    )}
                                                    label={level3Menu.name}
                                                    onLabelChange={formik.handleChange}
                                                    level={2}
                                                    onClick={() => handleSelection([idx1, idx2, idx3])}
                                                    selected={areEqual(selected, [idx1, idx2, idx3])}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ))}

                            <MenuLine.Add
                                onClick={(type) => {
                                    formik.setFieldValue('childs', [
                                        ...formik.values.childs,
                                        {
                                            tempId: tempId(),
                                            label: '',
                                            childs: type === 'CONTENT' ? undefined : [],
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
                                    handleSelection([formik.values.childs.length])
                                }}
                            />
                        </div>
                    </Col>
                    <Col span={8}>
                        {!!selected && (
                            <Card
                                title={
                                    <Text>
                                        {`${labelize[selectedMenu.type]} : `}
                                        <Text type="secondary">{selectedMenu.name}</Text>
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
                                                            onChange={(e) =>
                                                                formik.setFieldValue(
                                                                    `${nameSelected}.filters`,
                                                                    e
                                                                )
                                                            }
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
                                                                        value={selectedMenu.orderByFieldId}
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
