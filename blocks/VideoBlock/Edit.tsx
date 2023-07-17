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
    const { value, setFieldValue, medias, addMedia } = useSection(position)
    const { title, subtitle, text, buttons, image, switched, mediaId } = value || {}

    return (
        <SectionWrap
            position={position}
            panel={
                <MediaModal
                    value={medias?.get(mediaId)}
                    onChange={(media) => addMedia('mediaId', media)}
                    mediaType={MediaType.IMAGE}
                />
            }
        >
            <section className={classNames(styles['section'], { [styles['switch']!]: !!switched })}>
                <div className={classNames(styles['infos'])}>
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
