import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import Image from 'next/image'
import Link from 'next/link'

interface TextBlockProps {
    content: {
        title?: string
        subtitle?: string
        text?: string
        buttons?: { label: string; link: string; type?: 'secondary' | 'primary' }[]
        image?: string
        switched?: boolean
    }
}

const TextBlock = ({ content }: TextBlockProps) => {
    const { title, subtitle, text, buttons, image, switched } = content

    return (
        <section className={classNames(styles['section'], { [styles['switch']!]: !!switched })}>
            <div className={classNames(styles['infos'])}>
                {title && <h1>Title</h1>}
                {subtitle && <h3>Subtitle</h3>}
                {text && <p dangerouslySetInnerHTML={{ __html: text }} />}

                {!!buttons?.length && (
                    <div className={classNames(styles['wrap-button'])}>
                        {buttons.map((btn, idx) => (
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

export default TextBlock

export const PropsEx = {
    View: <></>,
    Edit: <></>,
    position: ['HEADER', 'FOOTER', 'SIDEBAR', 'CONTENT'],
    availableIn: ['LAYOUT', 'PAGE', 'CONTAINER', 'TEMPLATE', 'CONTENT', 'ELEMENT'],
}
