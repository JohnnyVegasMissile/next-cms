import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { ViewBlockProps } from '..'

const View = ({ content }: ViewBlockProps) => {
    const { title, subtitle, text, buttons, image, switched } = content || {}

    return (
        <section className={classNames(styles['section'], { [styles['switch']!]: !!switched })}>
            <div className={classNames(styles['infos'])}>
                {title && <h1>{title}</h1>}
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
