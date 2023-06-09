'use client'

import { FloatButton, Tooltip, Typography, message } from 'antd'
import {
    MenuOutlined,
    CloseOutlined,
    CheckOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LoadingOutlined,
} from '@ant-design/icons'
import classNames from 'classnames'
import useSidebarSettings from '~/hooks/useSidebarSettings'
import { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import SectionCreation, { SectionCreationCleaned } from '~/types/sectionCreation'
import SectionsManager from '~/components/SectionsManager'
import { Section } from '@prisma/client'
import blocks, { BlockKey } from '~/blocks'
import { ObjectId } from '~/types'
import { getLayout, updateLayout } from '~/network/layout'
import FullScreenLoading from '~/components/FullScreenLoading'

const { Text } = Typography

const validate = (values: {
    header: SectionCreation[]
    topSidebar: SectionCreation[]
    bottomSidebar: SectionCreation[]
    topContent: SectionCreation[]
    bottomContent: SectionCreation[]
    footer: SectionCreation[]
}) => {
    let errors: any = {}
    const sectionNames: (
        | 'header'
        | 'topSidebar'
        | 'bottomSidebar'
        | 'topContent'
        | 'bottomContent'
        | 'footer'
    )[] = ['header', 'topSidebar', 'bottomSidebar', 'topContent', 'bottomContent', 'footer']

    for (const sectionName of sectionNames) {
        for (const section of values[sectionName]) {
            const validate = blocks[section.block].validate

            if (!!validate) {
                const sectionErrors = validate(section)

                if (!!Object.keys(sectionErrors).length) {
                    if (!!errors[sectionName]) errors[sectionName] = new Array()

                    errors[sectionName][section.position] = sectionErrors
                }
            }
        }
    }

    return errors
}

const cleanBeforeSend = (values: {
    header: SectionCreation[]
    topSidebar: SectionCreation[]
    bottomSidebar: SectionCreation[]
    topContent: SectionCreation[]
    bottomContent: SectionCreation[]
    footer: SectionCreation[]
}) => {
    let cleanValues: any = {}
    const sectionNames: (
        | 'header'
        | 'topSidebar'
        | 'bottomSidebar'
        | 'topContent'
        | 'bottomContent'
        | 'footer'
    )[] = ['header', 'topSidebar', 'bottomSidebar', 'topContent', 'bottomContent', 'footer']

    for (const sectionName of sectionNames) {
        cleanValues[sectionName] = values[sectionName].map((section) => {
            const medias: ObjectId[] = []
            const forms: ObjectId[] = []

            const stringifiedContent = JSON.stringify(section.content)

            section.medias.forEach((_, key) => {
                if (stringifiedContent.includes(`"${key}"`)) medias.push(key)
            })

            section.forms.forEach((_, key) => {
                if (stringifiedContent.includes(`"${key}"`)) forms.push(key)
            })

            return {
                ...section,
                medias,
                forms,
                tempId: undefined,
            }
        })
    }

    return cleanValues
}

const cleanDetails = (values: {
    header: Section[]
    topSidebar: Section[]
    bottomSidebar: Section[]
    topContent: Section[]
    bottomContent: Section[]
    footer: Section[]
}): {
    header: SectionCreation[]
    topSidebar: SectionCreation[]
    bottomSidebar: SectionCreation[]
    topContent: SectionCreation[]
    bottomContent: SectionCreation[]
    footer: SectionCreation[]
} => {
    let cleanSections: any = {}
    const sectionNames: (
        | 'header'
        | 'topSidebar'
        | 'bottomSidebar'
        | 'topContent'
        | 'bottomContent'
        | 'footer'
    )[] = ['header', 'topSidebar', 'bottomSidebar', 'topContent', 'bottomContent', 'footer']

    for (const sectionName of sectionNames) {
        cleanSections[sectionName] = values[sectionName].map((section) => ({
            id: section.id,
            type: section.type,
            block: section.block as BlockKey,
            position: section.position,
            content: section.content as any,

            medias: new Map(),
            forms: new Map(),
        }))
    }

    return cleanSections
}

const Settings = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const formik = useFormik<{
        header: SectionCreation[]
        topSidebar: SectionCreation[]
        bottomSidebar: SectionCreation[]
        topContent: SectionCreation[]
        bottomContent: SectionCreation[]
        footer: SectionCreation[]
    }>({
        initialValues: {
            header: [],
            topSidebar: [],
            bottomSidebar: [],
            topContent: [],
            bottomContent: [],
            footer: [],
        },
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(cleanBeforeSend(values)),
    })

    const details = useMutation(() => getLayout(), {
        onSuccess: (data) => formik.setValues(cleanDetails(data)),
    })

    const submit = useMutation(
        (values: {
            header: SectionCreationCleaned[]
            topSidebar: SectionCreationCleaned[]
            bottomSidebar: SectionCreationCleaned[]
            topContent: SectionCreationCleaned[]
            bottomContent: SectionCreationCleaned[]
            footer: SectionCreationCleaned[]
        }) => updateLayout(values),
        {
            onSuccess: () => message.success(`Sections modified with success.`),
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    const sidebar = useSidebarSettings(() => setShowSidebar(true))

    useEffect(() => {
        details.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (details.isLoading || sidebar.isLoading) return <FullScreenLoading label="Loading layout..." />

    return (
        <>
            <div className={classNames(styles['page-wrap'])}>
                <SectionsManager
                    name="header"
                    sections={formik.values.header}
                    onChange={formik.setFieldValue}
                    error={formik.errors.header}
                    label="header"
                />
                <div
                    className={classNames(styles['content-wrap'], sidebar.position, sidebar.breakpointClass)}
                >
                    {sidebar.isActive && (
                        <aside
                            className={classNames(styles['aside'], { [styles['open']!]: showSidebar })}
                            style={{ width: sidebar.width, backgroundColor: sidebar.backgroundColor }}
                        >
                            <SectionsManager
                                name="topSidebar"
                                sections={formik.values.topSidebar}
                                onChange={formik.setFieldValue}
                                error={formik.errors.topSidebar}
                                label="top sidebar"
                            />

                            <div className={styles['placeholder']}>
                                <Tooltip title="Content coming from child pages will be placed here">
                                    <Text strong type="secondary">
                                        Sidebar content
                                    </Text>
                                </Tooltip>
                            </div>

                            <SectionsManager
                                name="bottomSidebar"
                                sections={formik.values.bottomSidebar}
                                onChange={formik.setFieldValue}
                                error={formik.errors.bottomSidebar}
                                label="bottom sidebar"
                            />
                        </aside>
                    )}
                    <div className={styles['content']}>
                        <SectionsManager
                            name="topContent"
                            sections={formik.values.topContent}
                            onChange={formik.setFieldValue}
                            error={formik.errors.topContent}
                            label="top content"
                        />

                        <div className={styles['placeholder']}>
                            <Tooltip title="Content coming from child sidebar will be placed here">
                                <Text strong type="secondary">
                                    Page content
                                </Text>
                            </Tooltip>
                        </div>

                        <SectionsManager
                            name="bottomContent"
                            sections={formik.values.bottomContent}
                            onChange={formik.setFieldValue}
                            error={formik.errors.bottomContent}
                            label="bottom content"
                        />
                    </div>
                </div>
                <SectionsManager
                    name="footer"
                    sections={formik.values.footer}
                    onChange={formik.setFieldValue}
                    error={formik.errors.footer}
                    label="footer"
                />
            </div>

            <FloatButton.Group
                trigger="hover"
                type="primary"
                style={{ right: '2.5rem', opacity: 1 }}
                icon={
                    submit.isLoading ? <LoadingOutlined rev={undefined} /> : <MenuOutlined rev={undefined} />
                }
            >
                {!submit.isLoading && (
                    <>
                        {sidebar.isActive && (
                            <FloatButton
                                icon={
                                    showSidebar ? (
                                        <MenuFoldOutlined rev={undefined} />
                                    ) : (
                                        <MenuUnfoldOutlined rev={undefined} />
                                    )
                                }
                                onClick={() => setShowSidebar(!showSidebar)}
                            />
                        )}
                        <FloatButton
                            icon={<CloseOutlined rev={undefined} />}
                            onClick={() => formik.setValues(cleanDetails(details.data!))}
                        />
                        <FloatButton
                            type="primary"
                            icon={<CheckOutlined rev={undefined} />}
                            onClick={() => formik.submitForm()}
                        />
                    </>
                )}
            </FloatButton.Group>
        </>
    )
}

export default Settings
