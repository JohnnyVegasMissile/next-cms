'use client'

import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useFormik } from 'formik'
import { useState } from 'react'
import { updatePageSections } from '~/network/pages'
import SectionCreation, { SectionCreationCleaned } from '~/types/sectionCreation'
import styles from './Form.module.scss'
import classNames from 'classnames'
import SectionsManager from '~/components/SectionsManager'
import { useRouter } from 'next/navigation'
import { SectionsFloatButtons } from '~/components/Sections'
import {
    cleanSectionCreation,
    sectionToSectionCreation,
    validateSections,
} from '~/utilities/validateSections'
import { SectionResponse } from '~/utilities/getSection'
import { CodeLanguage } from '@prisma/client'

type Layout = {
    content: { [key in CodeLanguage]?: SectionResponse[] }
    sidebar: { [key in CodeLanguage]?: SectionResponse[] }
}
type LayoutCreation = {
    content: { [key in CodeLanguage]?: SectionCreation[] }
    sidebar: { [key in CodeLanguage]?: SectionCreation[] }
}

const validate = (values: LayoutCreation) => validateSections(values)

interface FormProps {
    pageId: string
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

const Form = ({ pageId, layout, sidebar, locales, preferred }: FormProps) => {
    const [activeLocale, setActiveLocale] = useState(preferred)
    const router = useRouter()
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
        (values: { content: SectionCreationCleaned[]; sidebar: SectionCreationCleaned[] }) =>
            updatePageSections(pageId, values),
        {
            onSuccess: () => {
                message.success(`Sections modified with success.`)
                router.push('/admin/pages')
            },
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    console.log('kkkk values', layout)

    return (
        <>
            <div className={classNames(styles['content-wrap'], sidebar.position, sidebar.breakpointClass)}>
                {sidebar.isActive && (
                    <div
                        className={classNames(styles['aside'], { [styles['open']!]: showSidebar })}
                        style={{ width: sidebar.width, backgroundColor: sidebar.backgroundColor }}
                    >
                        <SectionsManager
                            name={`sidebar.${activeLocale}`}
                            sections={formik.values.sidebar?.[activeLocale] || []}
                            onChange={formik.setFieldValue}
                            error={formik.errors.sidebar}
                        />
                    </div>
                )}
                <div className={styles['content']}>
                    <SectionsManager
                        name={`content.${activeLocale}`}
                        sections={formik.values.content?.[activeLocale] || []}
                        onChange={(a, b) => {
                            console.log('kkkk onChange', a, b)
                            formik.setFieldValue(a, b)
                        }}
                        error={formik.errors.content}
                    />
                </div>
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
            />
        </>
    )
}

export default Form
