import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { ViewBlockProps } from '..'
import { ContentType } from '.'

const View = ({ content, medias }: ViewBlockProps<ContentType>) => {
    const { formId } = content || {}

    return (
        <section className={classNames(styles['section'], { [styles['switch']!]: !!switched })}>
            <div className={classNames(styles['infos'])}>
                <Image
                    alt={medias?.get(content.mediaId)?.alt || ''}
                    width={100}
                    height={150}
                    src={`/storage/images/${medias?.get(content.mediaId)?.uri || ''}`}
                />
                {title && <h1>{title}Form</h1>}
                {subtitle && <h3>{subtitle}</h3>}
                {text && (
                    <div className={classNames(styles['text'])} dangerouslySetInnerHTML={{ __html: text }} />
                )}

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
    )
}

export default View
