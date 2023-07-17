'use client'

import Link from 'next/link'
import { Form, FormField, FormFieldType } from '@prisma/client'
import { Fragment } from 'react'
import { useFormik } from 'formik'
import { ObjectId } from '~/types'
import set from 'lodash.set'
import { useMutation } from '@tanstack/react-query'
import { isEmail } from '~/utilities'
import { postMessage } from '~/network/messages'

type FormExtended = Form & {
    fields:
        | (FormField & {
              container: {
                  id: ObjectId
                  name: string
                  contents: { id: ObjectId; name: string }[]
              } | null
          })[]
}
type ValuesType = { [key in string]: string | number | string[] }

const getInitialValues = (form: FormExtended | undefined) => {
    if (!form) return {}

    const values = {}

    form.fields.forEach((field) => {
        const defaultValue = field.defaultText || field.defaultNumber || field.defaultMultiple

        if (!!defaultValue) set(values, field.id, defaultValue)
    })

    return values
}

const validate = (values: ValuesType, form: FormExtended | undefined) => {
    let error: ValuesType = {}

    form?.fields?.forEach((field) => {
        if (field.type !== FormFieldType.BUTTON && field.type !== FormFieldType.TITLE) {
            const fieldValue = values[field.id]

            if (field.required && !fieldValue && isNaN(fieldValue as number)) {
                error[field.id] = 'Required'
            } else if (field.type === FormFieldType.EMAIL && !isEmail(fieldValue as string)) {
                error[field.id] = 'Email not valid'
            } else if (field.type === FormFieldType.NUMBER && !isNaN(fieldValue as number)) {
                if (
                    !isNaN(parseFloat(`${field.min}`)) &&
                    parseFloat(fieldValue as string) < parseFloat(`${field.min}`)
                ) {
                    error[field.id] = 'Too low'
                } else if (
                    !isNaN(parseFloat(`${field.max}`)) &&
                    parseFloat(fieldValue as string) > parseFloat(`${field.max}`)
                ) {
                    error[field.id] = 'Too high'
                }
            }
        }
    })

    return error
}

const useForm = (form: FormExtended | undefined, onSuccess?: () => void, onError?: () => void) => {
    const { mutate, isSuccess, isError, isLoading, reset } = useMutation(
        (v: ValuesType) => postMessage(form?.id!, v),
        { onSuccess, onError }
    )

    const { resetForm, values, setFieldValue, handleSubmit, setFieldTouched } = useFormik<ValuesType>({
        initialValues: getInitialValues(form),
        validate: (v) => validate(v, form),
        validateOnChange: false,
        validateOnBlur: true,
        validateOnMount: false,
        onSubmit: (v) => mutate(v),
    })

    return {
        resetForm,
        values,
        setFieldValue,
        setFieldTouched,
        handleSubmit,
        isSuccess,
        isError,
        isLoading,
        reset,
    }
}

interface DisplayFormInputsProps {
    form: FormExtended
}

const DisplayFormInputs = ({ form }: DisplayFormInputsProps) => {
    const { fields } = form

    const { resetForm, values, setFieldValue, handleSubmit, isSuccess, isError, isLoading, reset } =
        useForm(form)

    if (isSuccess) return <span>{form.successMessage}</span>
    if (isError)
        return (
            <>
                <span>{form.errorMessage}</span>
                <button onClick={reset}>Retry</button>
            </>
        )
    if (isLoading) return <span>Sending...</span>

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(e)
            }}
        >
            {fields.map((field) => {
                switch (field.type) {
                    case FormFieldType.TEXT:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <input
                                        value={values[field.id]}
                                        onChange={(e) => setFieldValue(field.id, e.target.value)}
                                    />
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.NUMBER:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <input
                                        type="number"
                                        value={values[field.id]}
                                        onChange={(e) => setFieldValue(field.id, parseFloat(e.target.value))}
                                    />
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.EMAIL:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <input
                                        type="email"
                                        value={values[field.id]}
                                        onChange={(e) => setFieldValue(field.id, e.target.value)}
                                    />
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.NUMBER:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <input
                                        type="password"
                                        value={values[field.id]}
                                        onChange={(e) => setFieldValue(field.id, e.target.value)}
                                    />
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.PARAGRAPH:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <textarea
                                        value={values[field.id]}
                                        onChange={(e) => setFieldValue(field.id, e.target.value)}
                                    />
                                </div>
                            </Fragment>
                        )
                    case FormFieldType.OPTION:
                        return (
                            <Fragment key={field.id}>
                                <div>
                                    <label>{field.label}</label>
                                    <select id={field.id} name={field.id}>
                                        {(field.options as { value: string; name: string }[])?.map(
                                            (option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.name}
                                                </option>
                                            )
                                        )}
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

                                    {(field.options as { value: string; name: string }[])?.map((option) => (
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

                                    {(field.options as { value: string; name: string }[])?.map((option) => (
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
                                return (
                                    <button onClick={() => resetForm()} key={field.id}>
                                        {field.label}
                                    </button>
                                )

                            default:
                                return <Fragment />
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
                                        {field.container?.contents.map((content) => (
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
        </form>
    )
}

export default DisplayFormInputs
