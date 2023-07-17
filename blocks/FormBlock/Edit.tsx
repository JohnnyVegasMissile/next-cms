'use client'

import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import Link from 'next/link'
import useSection from '~/hooks/useSection'
import { EditBlockProps } from '..'
import { FormFieldType } from '@prisma/client'
import WithLabel from '~/components/WithLabel'
import ListSelect from '~/components/ListSelect'
import { Typography } from 'antd'
import { ContentType } from '.'
import { FormSimple } from '~/types/formCreation'
import { Fragment } from 'react'

const { Text } = Typography

const Edit = ({ position }: EditBlockProps) => {
    const { value, forms } = useSection<ContentType>(position)
    const { formId } = value || {}

    const form = forms?.get(formId || '')

    return (
        <section className={classNames(styles['section'])}>
            {!form ? <Text>Choose a form</Text> : <DisplayFormInputs form={form} />}
        </section>
    )
}

const Panel = ({ position }: EditBlockProps) => {
    const { value, addForm, errors } = useSection<ContentType>(position)
    const { formId } = value || {}

    return (
        <WithLabel label="Form">
            <ListSelect.Form
                value={formId}
                onChange={(_, form) => addForm('formId', form)}
                error={errors?.formId}
            />
        </WithLabel>
    )
}

Edit.Panel = Panel

export default Edit

interface DisplayFormInputsProps {
    form: FormSimple
}

const DisplayFormInputs = ({ form }: DisplayFormInputsProps) => {
    const { fields } = form

    return (
        <>
            {fields.map((field) => {
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
                    case FormFieldType.NUMBER:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <input type="number" />
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.EMAIL:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <input type="email" />
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.NUMBER:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <input type="password" />
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.PARAGRAPH:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <textarea />
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.OPTION:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <select id={field.id} name={field.id}>
                                        {field.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.CHECKBOX:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <input
                                        type="checkbox"
                                        id={field.id}
                                        name={field.id}
                                        value={field.label}
                                    />
                                    <label htmlFor={field.id}>{field.label}</label>
                                    <br />
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.MULTICHECKBOX:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <span>{field.label} </span>

                                    {field.options.map((option) => (
                                        <Fragment key={option.value}>
                                            <input
                                                type="checkbox"
                                                id={option.value}
                                                name={field.id}
                                                value={option.name}
                                            />
                                            <label htmlFor={option.value}>{` ${option.name}`}</label>
                                            <br />
                                        </Fragment>
                                    ))}
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.RADIO:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <span>{field.label} </span>

                                    {field.options.map((option) => (
                                        <Fragment key={option.value}>
                                            <input
                                                type="radio"
                                                id={option.value}
                                                name={field.id}
                                                value={option.name}
                                            />
                                            <label htmlFor={option.value}>{` ${option.name}`}</label>
                                            <br />
                                        </Fragment>
                                    ))}
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.BUTTON: {
                        switch (field.buttonType) {
                            case 'SUBMIT':
                                return <input key={field.id} type="submit" value={field.label} />

                            case 'LINK':
                                return (
                                    <Link key={field.id} href="/admin">
                                        {field.label}
                                    </Link>
                                )

                            case 'RESET':
                                return <button key={field.id}>{field.label}</button>
                        }
                    }

                    case FormFieldType.TITLE:
                        return <h2 key={field.id}>{field.label}</h2>

                    case FormFieldType.CONTENT:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <select id={field.id} name={field.id}>
                                        {field.container.contents.map((content) => (
                                            <option key={content.id} value={content.id}>
                                                {content.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Fragment>
                        )

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
