import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import styles from './ImageBlock.module.scss'

interface ImageBlock {
    content: {
        title?: string
        image: string
        button?: {
            label: string
            link: string
            type?: 'secondary' | 'primary'
        }
    }
}

const ImageBlock = ({ content }: ImageBlock) => {
    const { title, image, button } = content

    return (
        <section className={classNames(styles['section'])}>
            {title && <h1>Title</h1>}
            <Image src={image} alt="Picture of the author" height={400} width={600} />
            {button && (
                <div
                    className={classNames(styles['button'], {
                        [styles['secondary']!]: button.type === 'secondary',
                    })}
                >
                    <Link href={button.label}>
                        <span>{button.label}</span>
                    </Link>
                </div>
            )}
        </section>
    )
}

export default ImageBlock
