import styles from './Form.module.css'

import type { Props } from '../types'
import { useFormik } from 'formik'
import { useMutation } from 'react-query'
import get from 'lodash.get'
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
        <section>
            <form onSubmit={handleSubmit}>
                <div className={styles.wrapper}>
                    <h3 className={styles.title}>{section?.form?.title}</h3>

                    {section?.form?.fields
                        ?.sort((a, b) => a.position - b.position)
                        .map((field) => {
                            switch (field.type) {
                                case 'input':
                                    return (
                                        <div className={styles.inputWrap}>
                                            <label className={styles.label}>
                                                {field.label}
                                            </label>
                                            <input
                                                name={field.name!}
                                                className={styles.input}
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
                                        <div className={styles.inputWrap}>
                                            <label className={styles.label}>
                                                {field.label}
                                            </label>
                                            <textarea
                                                className={styles.input}
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
                                            <button className={styles.button} type="submit">
                                                {field.label}
                                            </button>
                                        </div>
                                    )
                            }

                            return null
                        })}
                </div>
            </form>
        </section>
    )
}

export default View
