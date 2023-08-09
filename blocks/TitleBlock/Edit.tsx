'use client'

import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import useSection from '~/hooks/useSection'
import { EditBlockProps } from '..'
import SectionWrap from '~/components/SectionWrap'
import MediaModal from '~/components/MediaModal'
import { MediaType } from '@prisma/client'
import StyledInput from '~/components/StyledInput'

const Edit = ({ position }: EditBlockProps) => {
    const { value, setFieldValue } = useSection<ContentType>(position)
    const { title } = value || {}

    return (
        <section className={classNames(styles['section'])}>
            <div className={classNames(styles['infos'])}>
                <StyledInput
                    value={text}
                    onChange={(e) => setFieldValue('text', e)}
                    boldStyle={{ color: 'var(--primary-color)' }}
                    italicStyle={{ color: 'var(--primary-color)' }}
                />

                {!!buttons?.length && (
                    <div className={classNames(styles['wrap-button'])}>
                        {buttons.map((btn: any, idx: any) => (
                            <div
                                key={idx}
                                className={classNames(styles['button'], {
                                    [styles['secondary']!]: btn.type === 'secondary',
                                })}
                            >
                                <Link href={btn.label}>
                                    <span>{btn.label}</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Edit
