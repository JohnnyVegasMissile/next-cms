'use client'

import { useMutation } from '@tanstack/react-query'
import { FloatButton, Tooltip, message } from 'antd'
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
    QuestionCircleOutlined,
    SyncOutlined,
    LoadingOutlined,
    MenuOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CloseOutlined,
    CheckOutlined,
} from '@ant-design/icons'
import {
    cleanSectionCreation,
    sectionToSectionCreation,
    validateSections,
} from '~/utilities/validateSections'
import { SectionResponse } from '~/utilities/getSection'
import { CodeLanguage } from '@prisma/client'
import languages from '~/utilities/languages'

type Layout = { content: SectionResponse[]; sidebar: SectionResponse[] }
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

    return (
        <>
            <div className={classNames(styles['content-wrap'], sidebar.position, sidebar.breakpointClass)}>
                {sidebar.isActive && (
                    <div
                        className={classNames(styles['aside'], { [styles['open']!]: showSidebar })}
                        style={{ width: sidebar.width, backgroundColor: sidebar.backgroundColor }}
                    >
                        <SectionsManager
                            name="sidebar"
                            sections={formik.values.sidebar}
                            onChange={formik.setFieldValue}
                            error={formik.errors.sidebar}
                        />
                    </div>
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

            {/* <FloatButton.Group
                shape="square"
                trigger="click"
                type="primary"
                icon={null}
                style={{ right: 36 }}
                description={activeLocale}
            >
                {locales.map((e) => (
                    <FloatButton
                        key={e}
                        type={e === activeLocale ? 'primary' : 'default'}
                        description={
                            <Tooltip title={`${languages[e]?.en} (${languages[e]?.name})`}>{e}</Tooltip>
                        }
                        onClick={() => setActiveLocale(e)}
                    />
                ))}
            </FloatButton.Group>

            <FloatButton.Group
                shape="square"
                trigger="click"
                type="primary"
                style={{ right: 36 + 40 + 24 }}
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
                        <FloatButton icon={<CloseOutlined />} onClick={() => formik.resetForm()} />
                        <FloatButton
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={() => formik.submitForm()}
                        />
                    </>
                )}
            </FloatButton.Group> */}

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
