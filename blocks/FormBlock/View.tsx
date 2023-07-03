import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { ViewBlockProps } from '..'
import { ContentType } from '.'
import { FormSimple } from '~/types/formCreation'
import { Form, FormField, FormFieldType } from '@prisma/client'
import { Fragment } from 'react'
import { useFormik } from 'formik'
import { ObjectId } from '~/types'
import DisplayFormInputs from './DisplayFormInputs'

const View = ({ content, forms }: ViewBlockProps<ContentType>) => {
    const { formId } = content || {}

    const form = forms?.get(formId || '')

    return (
        <section className={classNames(styles['section'])}>
            <DisplayFormInputs form={form!} />
        </section>
    )
}

export default View
