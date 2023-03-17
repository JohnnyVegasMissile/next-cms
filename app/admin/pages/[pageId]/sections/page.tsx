'use client'

import { Section, SectionType, SettingType } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Dropdown, FloatButton, Spin, Typography } from 'antd'
import {
    PlusOutlined,
    MenuOutlined,
    CloseOutlined,
    CheckOutlined,
    PicCenterOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { getPageSections } from '~/network/pages'
import SectionCreation from '~/types/sectionCreation'
import { ObjectId } from '~/types'
import blocks, { BlockKey } from '~/blocks'
import { SectionsContext } from '~/hooks/useSection'
import styles from './page.module.scss'
import classNames from 'classnames'
import { getSidebar } from '~/network/api'

const { Text } = Typography

const validate = (values: SectionCreation[]) => {
    let errors: any[] = []

    for (const section of values) {
        const validate = blocks[section.block].validate

        errors.push(validate ? validate(section) : undefined)
    }

    return errors
}

const cleanDetails = (sections: Section[]): SectionCreation[] => {
    return sections.map((section) => ({
        id: section.id,
        type: section.type,
        block: section.block as BlockKey,
        position: section.position,
        content: section.content as any,
        pageId: section.pageId!,

        medias: new Map(),
        forms: new Map(),
    }))
}

const cleanBeforeSend = (sections: SectionCreation[]) =>
    sections.map((section) => {
        const medias: ObjectId[] = []
        const forms: ObjectId[] = []

        const stringifiedContent = JSON.stringify(section.content)

        section.medias.forEach((_, key) => {
            if (
                stringifiedContent.includes(`"mediaId":${key},`) ||
                stringifiedContent.includes(`"mediaId":${key}}`)
            )
                medias.push(key)
        })

        section.forms.forEach((_, key) => {
            if (
                stringifiedContent.includes(`"formId":${key},`) ||
                stringifiedContent.includes(`"formId":${key}}`)
            )
                forms.push(key)
        })

        return {
            ...section,
            medias,
            forms,
        }
    })

const PageSections = ({ params }: any) => {
    const { pageId } = params
    const [showSidebar, setShowSidebar] = useState(false)
    const formik = useFormik<SectionCreation[]>({
        initialValues: [],
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => alert(JSON.stringify(cleanBeforeSend(values), null, 2)),
    })

    const details = useMutation(() => getPageSections(pageId), {
        onSuccess: (data) => formik.setValues(cleanDetails(data)),
    })

    const sidebarSettings = useQuery(['sidebar'], () => getSidebar())

    const sidebarIsActive =
        sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_IS_ACTIVE)?.value === 'true'
    const sidebarWidth = `${
        sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_WIDTH)?.value || '0'
    }${sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_UNIT)?.value || 'rem'}`

    const sidebarColor =
        sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_COLOR)?.value || '#ef476f'
    const sidebarBP =
        sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_BREAKPOINT_SIZE)?.value || 'medium'
    const sidebarPosition =
        sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_POSITION)?.value || 'left'

    // const submit = useMutation(
    //     (values: PageCreation) => (isUpdate ? updatePages(pageId, values) : postPages(values)),
    //     {
    //         onSuccess: () => message.success(`Page ${isUpdate ? 'modified' : 'created'} with success.`),
    //         onError: () => message.error('Something went wrong, try again later.'),
    //     }
    // )

    useEffect(() => {
        details.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const items = [
        {
            key: 'elements',
            label: 'Elements',
            icon: <PicCenterOutlined />,
            children: Object.keys(blocks).map((key) => ({ key, label: key })),
        },
        {
            key: 'blocks',
            label: 'Blocks',
            type: 'group',
            children: Object.keys(blocks).map((key) => ({
                key,
                label: key,
                onClick: () =>
                    formik.setValues([
                        ...formik.values,
                        {
                            tempId: '',
                            type: SectionType.PAGE,
                            block: key as BlockKey,
                            position: formik.values.length,
                            content: blocks?.[key as BlockKey]?.default
                                ? blocks?.[key as BlockKey]?.default
                                : {},
                            pageId,

                            medias: new Map(),
                            forms: new Map(),
                        },
                    ]),
            })),
        },
    ]

    if (details.isLoading) {
        return <Spin />
    }

    return (
        <div className={classNames(styles['content-wrap'], sidebarPosition, sidebarBP)}>
            {sidebarIsActive && (
                <aside
                    className={classNames(styles['aside'], { [styles['open']!]: showSidebar })}
                    style={{ width: sidebarWidth, backgroundColor: sidebarColor }}
                >
                    <SectionsContext.Provider
                        value={{
                            sections: formik.values,
                            setFieldValue: formik.setFieldValue,
                            errors: formik.errors,
                        }}
                    >
                        {formik.values.map((section, idx) => {
                            const Block = blocks[section.block].Edit

                            return (
                                <Block
                                    key={section.id || section.tempId || idx}
                                    position={section.position}
                                />
                            )
                        })}
                    </SectionsContext.Provider>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                        <Dropdown menu={{ items }}>
                            <Button size="small" type="primary" icon={<PlusOutlined />}>
                                Add section
                            </Button>
                        </Dropdown>
                    </div>
                </aside>
            )}
            <div className={styles['content']}>
                <SectionsContext.Provider
                    value={{
                        sections: formik.values,
                        setFieldValue: formik.setFieldValue,
                        errors: formik.errors,
                    }}
                >
                    {formik.values.map((section, idx) => {
                        const Block = blocks[section.block].Edit

                        return <Block key={section.id || section.tempId || idx} position={section.position} />
                    })}
                </SectionsContext.Provider>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                    <Dropdown menu={{ items }}>
                        <Button size="small" type="primary" icon={<PlusOutlined />}>
                            Add section
                        </Button>
                    </Dropdown>
                </div>
            </div>
            <FloatButton.Group
                trigger="hover"
                type="primary"
                style={{ right: '2.5rem', opacity: 1 }}
                icon={<MenuOutlined />}
            >
                {sidebarIsActive && (
                    <FloatButton
                        icon={showSidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                        onClick={() => setShowSidebar(!showSidebar)}
                    />
                )}
                <FloatButton icon={<CloseOutlined />} onClick={() => formik.setValues([])} />
                <FloatButton type="primary" icon={<CheckOutlined />} onClick={() => formik.submitForm()} />
            </FloatButton.Group>
        </div>
    )
}

export default PageSections
