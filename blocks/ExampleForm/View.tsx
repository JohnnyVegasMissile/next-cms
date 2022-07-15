import styles from './ExampleList.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'
import Link from 'next/link'
import { useFormik } from 'formik'
import { useMutation } from 'react-query'
import get from 'lodash.get'
import { sortBy } from 'lodash'
import { sendMessage } from '../../network/messages'

const View = ({ section }: Props) => {
    const { values, errors, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: {},
        validate: () => {
            let errors: any = {}

            {
                section?.form?.fields?.forEach((field) => {
                    if (
                        field.type !== 'submit' &&
                        field.required &&
                        !get(values, field.name!, undefined)
                    ) {
                        errors[field.name!] = 'Required'
                    }
                })
            }

            return errors
        },
        onSubmit: async (values) => {
            mutation.mutate({
                pid: section?.form!.id as string,
                values,
            })
        },
    })

    const mutation = useMutation(
        (data: { pid: string; values: any }) => sendMessage(data.pid, data.values),
        {
            onSuccess: (data: any) => {
                // queryClient.invalidateQueries('messages')
                setValues({})
            },
        }
    )

    return (
        <section className={styles.section}>
            <form onSubmit={handleSubmit}>
                <h1>{section?.form?.title}</h1>
                {section?.form?.fields
                    ?.sort((a, b) => a.position - b.position)
                    .map((field) => {
                        switch (field.type) {
                            case 'input':
                                return (
                                    <div key={field.name} className={styles.input}>
                                        <label htmlFor={field.name!}>{field.label}</label>
                                        <input
                                            type="text"
                                            name={field.name!}
                                            onChange={handleChange}
                                            value={get(values, field.name!, '')}
                                        />
                                        {get(errors, field.name!, '') && (
                                            <span>{get(errors, field.name!, '')}</span>
                                        )}
                                    </div>
                                )
                            case 'text-area':
                                return (
                                    <div key={field.name} className={styles.textarea}>
                                        <label htmlFor={field.name!}>{field.label}</label>
                                        <textarea
                                            name={field.name!}
                                            onChange={handleChange}
                                            value={get(values, field.name!, '')}
                                        />
                                        {get(errors, field.name!, '') && (
                                            <span>{get(errors, field.name!, '')}</span>
                                        )}
                                    </div>
                                )
                            // case 'select':
                            //     return (
                            //         <div key={field.name} className={styles.select}>
                            //             <label htmlFor={field.name}>{field.label}</label>
                            //             <select
                            //                 name={field.name}
                            //                 onChange={handleChange}
                            //                 value={get(values, field.name, '')}
                            //             ></select>
                            //             {get(errors, field.name, '') && (
                            //                 <span>{get(errors, field.name, '')}</span>
                            //             )}
                            //         </div>
                            //     )
                            case 'checkbox':
                                return (
                                    <div key={field.name} className={styles.checkbox}>
                                        <label htmlFor={field.name!}>{field.label}</label>
                                        <input
                                            type="checkbox"
                                            name={field.name!}
                                            onChange={handleChange}
                                            value={get(values, field.name!, '')}
                                        />
                                        {get(errors, field.name!, '') && (
                                            <span>{get(errors, field.name!, '')}</span>
                                        )}
                                    </div>
                                )
                            case 'submit':
                                return (
                                    <div key={field.name} className={styles.submit}>
                                        <button type="submit">{field.label}</button>
                                    </div>
                                )
                        }

                        return null
                    })}
            </form>
        </section>
    )
}

export default View
