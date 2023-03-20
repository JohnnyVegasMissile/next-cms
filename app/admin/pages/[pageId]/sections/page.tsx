'use client'

import { Section, SectionType, SettingType } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Dropdown, FloatButton, Spin, message } from 'antd'
import {
    PlusOutlined,
    MenuOutlined,
    CloseOutlined,
    CheckOutlined,
    PicCenterOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LoadingOutlined,
} from '@ant-design/icons'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { getPageSections, updatePageSections } from '~/network/pages'
import SectionCreation, { SectionCreationCleaned } from '~/types/sectionCreation'
import { ObjectId } from '~/types'
import blocks, { BlockKey } from '~/blocks'
import { SectionsContext } from '~/hooks/useSection'
import styles from './page.module.scss'
import classNames from 'classnames'
import { getSidebar } from '~/network/api'

function tempId() {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const charactersLength = characters.length
    let counter = 0
    while (counter < 5) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
        counter += 1
    }
    return result
}

const validate = (values: { content: SectionCreation[]; sidebar: SectionCreation[] }) => {
    let errors: any = {}

    for (const section of values.content) {
        const validate = blocks[section.block].validate

        if (!!validate) {
            const sectionErrors = validate(section)

            if (!!Object.keys(sectionErrors).length) {
                if (!!errors.content) errors.content = new Array()

                errors.content[section.position] = sectionErrors
            }
        }
    }

    for (const section of values.sidebar) {
        const validate = blocks[section.block].validate

        if (!!validate) {
            const sectionErrors = validate(section)

            if (!!Object.keys(sectionErrors).length) {
                if (!!errors.sidebar) errors.sidebar = new Array()

                errors.sidebar[section.position] = sectionErrors
            }
        }
    }

    return errors
}

const cleanDetails = (values: {
    content: Section[]
    sidebar: Section[]
}): { content: SectionCreation[]; sidebar: SectionCreation[] } => {
    const content = values.content.map((section) => ({
        id: section.id,
        type: section.type,
        block: section.block as BlockKey,
        position: section.position,
        content: section.content as any,
        pageId: section.pageId!,

        medias: new Map(),
        forms: new Map(),
    }))

    const sidebar = values.sidebar.map((section) => ({
        id: section.id,
        type: section.type,
        block: section.block as BlockKey,
        position: section.position,
        content: section.content as any,
        pageId: section.pageId!,

        medias: new Map(),
        forms: new Map(),
    }))

    return { content, sidebar }
}

const cleanBeforeSend = (values: { content: SectionCreation[]; sidebar: SectionCreation[] }) => {
    const content = values.content.map((section) => {
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
            tempId: undefined,
        }
    })

    const sidebar = values.sidebar.map((section) => {
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
            tempId: undefined,
        }
    })

    return { content, sidebar }
}

const PageSections = ({ params }: any) => {
    const { pageId } = params
    const [showSidebar, setShowSidebar] = useState(false)
    const formik = useFormik<{ content: SectionCreation[]; sidebar: SectionCreation[] }>({
        initialValues: { content: [], sidebar: [] },
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(cleanBeforeSend(values)),
    })

    const details = useMutation(() => getPageSections(pageId), {
        onSuccess: (data) => formik.setValues(cleanDetails(data)),
    })

    const submit = useMutation(
        (values: { content: SectionCreationCleaned[]; sidebar: SectionCreationCleaned[] }) =>
            updatePageSections(pageId, values),
        {
            onSuccess: () => message.success(`Sections modified with success.`),
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    const sidebarSettings = useQuery(['sidebar'], () => getSidebar(), {
        onSuccess: () => {
            const sidebarIsActive =
                sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_IS_ACTIVE)?.value === 'true'

            setShowSidebar(sidebarIsActive)
        },
    })

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

    const items = (place: 'sidebar' | 'content') => [
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
                    formik.setFieldValue(place, [
                        ...formik.values[place],
                        {
                            tempId: tempId(),
                            type: place === 'content' ? SectionType.PAGE : SectionType.PAGE_SIDEBAR,
                            block: key as BlockKey,
                            position: formik.values[place].length,
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

    if (details.isLoading || sidebarSettings.isLoading) {
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
                            sections: formik.values.sidebar,
                            setFieldValue: (name: string, value: any) =>
                                formik.setFieldValue(`sidebar.${name}`, value),
                            errors: formik.errors.sidebar as any,
                        }}
                    >
                        {formik.values.sidebar.map((section, idx) => {
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
                        <Dropdown menu={{ items: items('sidebar') }}>
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
                        sections: formik.values.content,
                        setFieldValue: (name: string, value: any) =>
                            formik.setFieldValue(`content.${name}`, value),
                        errors: formik.errors.content as any,
                    }}
                >
                    {formik.values.content.map((section, idx) => {
                        const Block = blocks[section.block].Edit

                        return <Block key={section.id || section.tempId || idx} position={section.position} />
                    })}
                </SectionsContext.Provider>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                    <Dropdown menu={{ items: items('content') }}>
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
                icon={submit.isLoading ? <LoadingOutlined /> : <MenuOutlined />}
            >
                {!submit.isLoading && (
                    <>
                        {sidebarIsActive && (
                            <FloatButton
                                icon={showSidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                                onClick={() => setShowSidebar(!showSidebar)}
                            />
                        )}
                        <FloatButton
                            icon={<CloseOutlined />}
                            onClick={() => formik.setValues(cleanDetails(details.data!))}
                        />
                        <FloatButton
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={() => formik.submitForm()}
                        />
                    </>
                )}
            </FloatButton.Group>
        </div>
    )
}

export default PageSections
