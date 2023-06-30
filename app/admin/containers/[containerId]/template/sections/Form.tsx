'use client'

import { useMutation } from '@tanstack/react-query'
import { message, Tooltip, Typography } from 'antd'
import { useFormik } from 'formik'
import { useState } from 'react'
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
import { updateContainerTemplateSections } from '~/network/containers'
import { SectionResponse } from '~/utilities/getSection'

const { Text } = Typography

export type Layout = {
    contentTop: SectionResponse[]
    contentBottom: SectionResponse[]
    sidebarTop: SectionResponse[]
    sidebarBottom: SectionResponse[]
}

type LayoutCreation = {
    contentTop: SectionCreation[]
    contentBottom: SectionCreation[]
    sidebarTop: SectionCreation[]
    sidebarBottom: SectionCreation[]
}

const validate = (values: LayoutCreation) => validateSections(values)

interface FormProps {
    containerId: string
    layout: Layout
    sidebar: {
        isActive: boolean
        width: string
        backgroundColor: string
        breakpointClass: string
        position: string
    }
}

const Form = ({ containerId, layout, sidebar }: FormProps) => {
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
        (values: {
            contentTop: SectionCreationCleaned[]
            contentBottom: SectionCreationCleaned[]
            sidebarTop: SectionCreationCleaned[]
            sidebarBottom: SectionCreationCleaned[]
        }) => updateContainerTemplateSections(containerId, values),
        {
            onSuccess: () => {
                message.success(`Sections modified with success.`)
                router.push('/admin/containers')
            },
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    return (
        <>
            <div className={classNames(styles['content-wrap'], sidebar.position, sidebar.breakpointClass)}>
                {sidebar.isActive && (
                    <div
                        className={classNames(styles['aside'], { [styles['open']!]: showSidebar })}
                        style={{ width: sidebar.width, backgroundColor: sidebar.backgroundColor }}
                    >
                        <SectionsManager
                            name="sidebarTop"
                            sections={formik.values.sidebarTop}
                            onChange={formik.setFieldValue}
                            error={formik.errors.sidebarTop}
                        />

                        <div className={styles['placeholder']}>
                            <Tooltip title="Content coming from child sidebar will be placed here">
                                <Text strong type="secondary">
                                    Sidebar content
                                </Text>
                            </Tooltip>
                        </div>

                        <SectionsManager
                            name="sidebarBottom"
                            sections={formik.values.sidebarBottom}
                            onChange={formik.setFieldValue}
                            error={formik.errors.sidebarBottom}
                        />
                    </div>
                )}
                <div className={styles['content']}>
                    <SectionsManager
                        name="contentTop"
                        sections={formik.values.contentTop}
                        onChange={formik.setFieldValue}
                        error={formik.errors.contentTop}
                    />

                    <div className={styles['placeholder']}>
                        <Tooltip title="Content coming from child sidebar will be placed here">
                            <Text strong type="secondary">
                                Sidebar content
                            </Text>
                        </Tooltip>
                    </div>

                    <SectionsManager
                        name="contentBottom"
                        sections={formik.values.contentBottom}
                        onChange={formik.setFieldValue}
                        error={formik.errors.contentBottom}
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
