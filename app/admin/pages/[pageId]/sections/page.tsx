'use client'

import { Form, Media, MediaType, Section, SectionType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import {
    Button,
    Divider,
    Drawer,
    FloatButton,
    Input,
    Menu,
    Popconfirm,
    Popover,
    Space,
    Spin,
    Typography,
} from 'antd'
import {
    PlusOutlined,
    MenuOutlined,
    SettingOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    DeleteOutlined,
    CloseOutlined,
    CheckOutlined,
    BorderOutlined,
    PicCenterOutlined,
} from '@ant-design/icons'
import { useFormik } from 'formik'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { getPageSections } from '~/network/pages'
import SectionCreation from '~/types/sectionCreation'
import MediaModal from '~/components/MediaModal'
import { ObjectId } from '~/types'
import CustomImage from '~/components/CustomImage'
import blocks from '~/blocks'
import SectionWrap from '~/components/SectionWrap'
import useSection, { SectionsContext } from '~/hooks/useSection'

const { Text } = Typography

const validate = (values: SectionCreation[]) => {
    let errors: any = {}

    return errors
}

const cleanDetails = (sections: Section[]): SectionCreation[] => {
    return sections.map((section) => ({
        id: section.id,
        type: section.type,
        block: section.block,
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
    const [popOpen, setPopOpen] = useState(false)
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

    if (details.isLoading) {
        return <Spin />
    }

    return (
        <div style={{ margin: '-1rem' }}>
            <SectionsContext.Provider
                value={{ sections: formik.values, setFieldValue: formik.setFieldValue }}
            >
                {formik.values.map((section, idx) => (
                    <Section key={section.id || section.tempId || idx} position={idx} />
                ))}
            </SectionsContext.Provider>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <Popover
                    open={popOpen}
                    onOpenChange={setPopOpen}
                    trigger="click"
                    content={
                        <Menu
                            onClick={(e) => {
                                if (e.keyPath.length === 1) {
                                    formik.setValues([
                                        ...formik.values,
                                        {
                                            tempId: '',
                                            type: SectionType.PAGE,
                                            block: e.key,
                                            position: formik.values.length - 1,
                                            content: {},
                                            pageId,

                                            medias: new Map(),
                                            forms: new Map(),
                                        },
                                    ])
                                } else {
                                    console.log(e)
                                }
                                setPopOpen(false)
                            }}
                            style={{ width: 256, border: 'none' }}
                            mode="inline"
                            items={[
                                {
                                    key: 'elements',
                                    label: 'Elements',
                                    icon: <BorderOutlined />,
                                    children: Object.keys(blocks).map((key) => ({ key, label: key })),
                                },
                                {
                                    key: 'blocks',
                                    label: 'Blocks',
                                    type: 'group',
                                    children: Object.keys(blocks).map((key) => ({ key, label: key })),
                                },
                            ]}
                        />
                    }
                >
                    <Button size="small" type="primary" icon={<PlusOutlined />}>
                        Add section
                    </Button>
                </Popover>
            </div>
            <FloatButton.Group
                trigger="hover"
                type="primary"
                style={{ right: 94, opacity: 0.5 }}
                icon={<MenuOutlined />}
            >
                <FloatButton icon={<CloseOutlined />} onClick={() => formik.setValues([])} />
                <FloatButton type="primary" icon={<CheckOutlined />} onClick={() => formik.submitForm()} />
            </FloatButton.Group>
        </div>
    )
}

interface SectionProps {
    position: number
}

const Section = ({ position }: SectionProps) => {
    const { content, setFieldValue, medias, addMedia } = useSection(position)

    return (
        <SectionWrap
            position={position}
            panel={
                <MediaModal
                    value={medias?.get(content.mediaId)}
                    onChange={(media) => addMedia('mediaId', media)}
                    mediaType={MediaType.IMAGE}
                />
            }
        >
            {JSON.stringify(content)}
            <CustomImage.Background media={medias?.get(content.mediaId)}>
                {JSON.stringify(content)}

                <div style={{ height: 200, background: 'red' }}></div>
                <Input value={content?.text} onChange={(e) => setFieldValue('text', e.target.value)} />

                {/* <CustomImage media={medias?.get(content.mediaId)} /> */}
            </CustomImage.Background>
        </SectionWrap>
    )
}

export default PageSections
