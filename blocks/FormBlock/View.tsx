import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import { ViewBlockProps } from '..'
import { ContentType } from '.'
import DisplayFormInputs from './DisplayFormInputs'

const View = ({ value, forms }: ViewBlockProps<ContentType>) => {
    const { formId } = value || {}

    const form = forms?.get(formId || '')

    return (
        <section className={classNames(styles['section'])}>
            <DisplayFormInputs form={form!} />
        </section>
    )
}

export default View
