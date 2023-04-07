'use client'

import { Section } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { FloatButton, Spin, message } from 'antd'
import {
    MenuOutlined,
    CloseOutlined,
    CheckOutlined,
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
import styles from './page.module.scss'
import classNames from 'classnames'
import SectionsManager from '~/components/SectionsManager'
import useSidebarSettings from '~/hooks/useSidebarSettings'
import FullScreenLoading from '~/components/FullScreenLoading'

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

    const sidebar = values.sidebar.map((section) => {
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

    const sidebar = useSidebarSettings(() => setShowSidebar(true))

    useEffect(() => {
        details.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (details.isLoading || sidebar.isLoading) return <FullScreenLoading label="Loading sections..." />

    return (
        <>
            <div className={classNames(styles['content-wrap'], sidebar.position, sidebar.breakpointClass)}>
                {sidebar.isActive && (
                    <aside
                        className={classNames(styles['aside'], { [styles['open']!]: showSidebar })}
                        style={{ width: sidebar.width, backgroundColor: sidebar.backgroundColor }}
                    >
                        <SectionsManager
                            name="sidebar"
                            sections={formik.values.sidebar}
                            onChange={formik.setFieldValue}
                            error={formik.errors.sidebar}
                        />
                    </aside>
                )}
                <div className={styles['content']}>
                    <SectionsManager
                        name="content"
                        sections={formik.values.content}
                        onChange={formik.setFieldValue}
                        error={formik.errors.content}
                    />
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
                        {sidebar.isActive && (
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
        </>
    )
}

export default PageSections
