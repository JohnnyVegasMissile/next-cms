'use client'

import { Section } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useFormik } from 'formik'
import { useState } from 'react'
import { updatePageSections } from '~/network/pages'
import SectionCreation, { SectionCreationCleaned } from '~/types/sectionCreation'
import styles from './page.module.scss'
import classNames from 'classnames'
import SectionsManager from '~/components/SectionsManager'
import { useRouter } from 'next/navigation'
import { SectionsFloatButtons } from '~/components/Sections'
import {
    cleanSectionCreation,
    sectionToSectionCreation,
    validateSections,
} from '~/utilities/validateSections'

type Layout = {
    content: Section[]
    sidebar: Section[]
}
type LayoutCreation = {
    content: SectionCreation[]
    sidebar: SectionCreation[]
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
}

const Form = ({ pageId, layout, sidebar }: FormProps) => {
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
