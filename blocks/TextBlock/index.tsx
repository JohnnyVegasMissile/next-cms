import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import useSection from '~/hooks/useSection'

interface TextBlockProps {
    position: number
}

const TextBlock = ({ position }: TextBlockProps) => {
    const { content, setFieldValue, medias, addMedia } = useSection(position)
    const { title, subtitle, text, buttons, image, switched } = content

    return (
        <section className={classNames(styles['section'], { [styles['switch']!]: !!switched })}>
            <div className={classNames(styles['infos'])}>
                {title && <h1>Title</h1>}
                {subtitle && <h3>Subtitle</h3>}
                {text && <p dangerouslySetInnerHTML={{ __html: text }} />}

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

export const PropsEx = {
    View: TextBlock,
    Edit: TextBlock,
    title: 'Text',
    position: ['HEADER', 'FOOTER', 'SIDEBAR', 'CONTENT'],
    availableIn: ['LAYOUT', 'PAGE', 'CONTAINER', 'TEMPLATE', 'CONTENT', 'ELEMENT'],
    default: {},
}

export default TextBlock
