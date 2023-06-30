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
import WithLabel from '~/components/WithLabel'
import ListSelect from '~/components/ListSelect'
import { Divider } from 'antd'

const Edit = ({ position }: EditBlockProps) => {
    const { content, setFieldValue, medias, addMedia, forms, addForm } = useSection(position)
    const { title, subtitle, text, buttons, image, switched } = content || {}

    return (
        <SectionWrap
            position={position}
            panel={
                <>
                    <WithLabel label="Logo">
                        <MediaModal
                            value={content.mediaId}
                            onChange={(media) => addMedia('mediaId', media)}
                            mediaType={MediaType.IMAGE}
                        />
                    </WithLabel>

                    <Divider />

                    <WithLabel label="Form">
                        <ListSelect.Form
                            value={content.formId}
                            onChange={(_, form) => addForm('formId', form)}
                        />
                    </WithLabel>
                </>
            }
        >
            <section className={classNames(styles['section'], { [styles['switch']!]: !!switched })}>
                <div className={classNames(styles['infos'])}>
                    <Image
                        alt={medias?.get(content.mediaId)?.alt || ''}
                        width={100}
                        height={150}
                        src={`/storage/images/${medias?.get(content.mediaId)?.uri || ''}`}
                    />
                    {title && <h1>{title}</h1>}
                    {subtitle && <h3>{subtitle}</h3>}
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
                {image && <Image src={image} alt="Picture of the author" height={200} width={300} />}
            </section>
        </SectionWrap>
    )
}

export default Edit
