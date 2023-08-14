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
import { CodeLanguage, Section } from '@prisma/client'
import { SectionsFloatButtons } from '~/components/SectionsFloatButtons'
import {
    validateSections,
    sectionToSectionCreation,
    cleanSectionCreation,
} from '~/utilities/validateSections'
import { SectionResponse } from '~/utilities/getSection'

const { Text } = Typography

type Layout = {
    header: { [key in CodeLanguage]?: SectionResponse[] }
    topSidebar: { [key in CodeLanguage]?: SectionResponse[] }
    bottomSidebar: { [key in CodeLanguage]?: SectionResponse[] }
    topContent: { [key in CodeLanguage]?: SectionResponse[] }
    bottomContent: { [key in CodeLanguage]?: SectionResponse[] }
    footer: { [key in CodeLanguage]?: SectionResponse[] }
}

type LayoutCreation = {
    header: { [key in CodeLanguage]?: SectionCreation[] }
    topSidebar: { [key in CodeLanguage]?: SectionCreation[] }
    bottomSidebar: { [key in CodeLanguage]?: SectionCreation[] }
    topContent: { [key in CodeLanguage]?: SectionCreation[] }
    bottomContent: { [key in CodeLanguage]?: SectionCreation[] }
    footer: { [key in CodeLanguage]?: SectionCreation[] }
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
    locales: CodeLanguage[]
    preferred: CodeLanguage
}

const Form = ({ layout, sidebar, locales, preferred }: LayoutFormProps) => {
    const [activeLocale, setActiveLocale] = useState(preferred)
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
                    name={`header.${activeLocale}`}
                    sections={formik.values.header?.[activeLocale] || []}
                    onChange={formik.setFieldValue}
                    error={formik.errors.header?.[activeLocale]}
                    label="header"
                />
                <div
                    className={classNames(styles['content-wrap'], sidebar.position, sidebar.breakpointClass)}
                >
                    {sidebar.isActive && (
                        <div
                            className={classNames(styles['aside'], { [styles['open']!]: showSidebar })}
                            style={{ width: sidebar.width, backgroundColor: sidebar.backgroundColor }}
                        >
                            <SectionsManager
                                name={`topSidebar.${activeLocale}`}
                                sections={formik.values.topSidebar?.[activeLocale] || []}
                                onChange={formik.setFieldValue}
                                error={formik.errors.topSidebar?.[activeLocale]}
                                label="top sidebar"
                            />

                            <div className={styles['placeholder']}>
                                <Tooltip title="Content coming from child sidebar will be placed here">
                                    <Text strong type="secondary">
                                        Sidebar content
                                    </Text>
                                </Tooltip>
                            </div>

                            <SectionsManager
                                name={`bottomSidebar.${activeLocale}`}
                                sections={formik.values.bottomSidebar?.[activeLocale] || []}
                                onChange={formik.setFieldValue}
                                error={formik.errors.bottomSidebar?.[activeLocale]}
                                label="bottom sidebar"
                            />
                        </div>
                    )}
                    <div className={styles['content']}>
                        <SectionsManager
                            name={`topContent.${activeLocale}`}
                            sections={formik.values.topContent?.[activeLocale] || []}
                            onChange={formik.setFieldValue}
                            error={formik.errors.topContent?.[activeLocale]}
                            label="top content"
                        />

                        <div className={styles['placeholder']}>
                            <Tooltip title="Content coming from child pages will be placed here">
                                <Text strong type="secondary">
                                    Page content
                                </Text>
                            </Tooltip>
                        </div>

                        <SectionsManager
                            name={`bottomContent.${activeLocale}`}
                            sections={formik.values.bottomContent?.[activeLocale] || []}
                            onChange={formik.setFieldValue}
                            error={formik.errors.bottomContent?.[activeLocale]}
                            label="bottom content"
                        />
                    </div>
                </div>
                <SectionsManager
                    name={`footer.${activeLocale}`}
                    sections={formik.values.footer?.[activeLocale] || []}
                    onChange={formik.setFieldValue}
                    error={formik.errors.footer?.[activeLocale]}
                    label="footer"
                />
            </div>

            <SectionsFloatButtons
                activeLocale={activeLocale}
                locales={locales}
                preferred={preferred}
                onLocaleChange={setActiveLocale}
                loading={submit.isLoading}
                active={sidebar.isActive}
                open={showSidebar}
                onOpenClick={() => setShowSidebar(!showSidebar)}
                onResetClick={() => formik.resetForm()}
                onSubmit={() => formik.submitForm()}
                onCopy={(code) => {
                    formik.setFieldValue(`header.${activeLocale}`, formik.values.header?.[code])
                    formik.setFieldValue(`topSidebar.${activeLocale}`, formik.values.topSidebar?.[code])
                    formik.setFieldValue(`bottomSidebar.${activeLocale}`, formik.values.bottomSidebar?.[code])
                    formik.setFieldValue(`topContent.${activeLocale}`, formik.values.topContent?.[code])
                    formik.setFieldValue(`bottomContent.${activeLocale}`, formik.values.bottomContent?.[code])
                    formik.setFieldValue(`footer.${activeLocale}`, formik.values.footer?.[code])
                }}
                errors={formik.errors}
            />
        </>
    )
}

export default Form
