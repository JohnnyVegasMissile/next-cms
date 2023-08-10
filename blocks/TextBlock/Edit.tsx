'use client'

import classNames from 'classnames'
import StyledInput from '~/components/StyledInput'
import useSection from '~/hooks/useSection'
import styles from './TextBlock.module.scss'
import { EditBlockProps } from '..'
import { ContentType } from '.'

const Edit = ({ position }: EditBlockProps) => {
    const { value, errors, setFieldValue } = useSection<ContentType>(position)
    const { text } = value || {}

    return (
        <section className={classNames(styles['section'])}>
            <div className={classNames(styles['container'], { [styles['error']!]: !!errors?.text })}>
                <StyledInput
                    value={text}
                    onChange={(e) => setFieldValue('text', e)}
                    boldStyle={{ color: 'var(--primary-color)' }}
                    italicStyle={{ color: 'var(--primary-color)' }}
                />
            </div>
        </section>
    )
}

export default Edit
