'use client'

import { Tooltip, Typography, message } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'
import styles from './page.module.scss'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import SectionCreation, { SectionCreationCleaned } from '~/types/sectionCreation'
import SectionsManager from '~/components/SectionsManager'
import { updateLayout } from '~/network/layout'
import { Section } from '@prisma/client'
import { SectionsFloatButtons } from '~/components/Sections'
import {
    validateSections,
    sectionToSectionCreation,
    cleanSectionCreation,
} from '~/utilities/validateSections'

const { Text } = Typography

type Layout = {
    header: Section[]
    topSidebar: Section[]
    bottomSidebar: Section[]
    topContent: Section[]
    bottomContent: Section[]
    footer: Section[]
}

type LayoutCreation = {
    header: SectionCreation[]
    topSidebar: SectionCreation[]
    bottomSidebar: SectionCreation[]
    topContent: SectionCreation[]
    bottomContent: SectionCreation[]
    footer: SectionCreation[]
}

const validate = (values: LayoutCreation) => validateSections(values)

interface LayoutFormProps {
    layout: Layout
    sidebar: {
        isActive: boolean
        width: string
        backgroundColor: string
        breakpointClass: string
        position: string
    }
}

const Form = ({ layout, sidebar }: LayoutFormProps) => {
    const [showSidebar, setShowSidebar] = useState(sidebar.isActive)
    const formik = useFormik<LayoutCreation>({
        initialValues: sectionToSectionCreation(layout),
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(cleanSectionCreation(values)),
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
            onSuccess: () => message.success(`Layout modified with success.`),
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

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

            <SectionsFloatButtons
                loading={submit.isLoading}
                active={sidebar.isActive}
                open={showSidebar}
                onOpenClick={() => setShowSidebar(!showSidebar)}
                onResetClick={() => formik.resetForm()}
                onSubmit={() => formik.submitForm()}
            />
        </>
    )
}

export default Form
