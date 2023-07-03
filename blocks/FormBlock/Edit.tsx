'use client'

import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import useSection from '~/hooks/useSection'
import { EditBlockProps } from '..'
import SectionWrap from '~/components/SectionWrap'
import MediaModal from '~/components/MediaModal'
import { FormFieldType, MediaType } from '@prisma/client'
import StyledInput from '~/components/StyledInput'
import WithLabel from '~/components/WithLabel'
import ListSelect from '~/components/ListSelect'
import { Divider, Typography } from 'antd'
import { ContentType } from '.'
import { FormSimple } from '~/types/formCreation'
import { Fragment } from 'react'

const { Text } = Typography

const Edit = ({ position }: EditBlockProps) => {
    const { content, forms, addForm } = useSection<ContentType>(position)
    const { formId } = content || {}

    const form = forms?.get(formId || '')

    return (
        <SectionWrap
            position={position}
            panel={
                <WithLabel label="Form">
                    <ListSelect.Form value={formId} onChange={(_, form) => addForm('formId', form)} />
                </WithLabel>
            }
        >
            <section className={classNames(styles['section'])}>
                {!form ? <Text>Choose a form</Text> : <DisplayFormInputs form={form} />}
            </section>
        </SectionWrap>
    )
}

export default Edit

interface DisplayFormInputsProps {
    form: FormSimple
}

const DisplayFormInputs = ({ form }: DisplayFormInputsProps) => {
    const { fields } = form

    return (
        <>
            {fields.map((field, idx) => {
                switch (field.type) {
                    case FormFieldType.TEXT:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <input />
                                </div>
                            </Fragment>
                        )
                        break

                    default:
                        return (
                            <Fragment key={field.id}>
                                <div key={field.id}>{field.label}</div>
                            </Fragment>
                        )
                }
            })}
        </>
    )
}
