import { Media, MediaType } from '@prisma/client'
import Image from 'next/image'
import { ReactNode } from 'react'

interface CustomImageProps {
    media?: Media
    height?: number
    width?: number
    className?: string
}

const CustomImage = ({ media, height, width, className }: CustomImageProps) => {
    if (!media || media.type !== MediaType.IMAGE) return <></>

    return (
        <Image
            src={`/api/uploads/images/${media.uri}`}
            alt={media.alt || ''}
            height={height}
            width={width}
            className={className}
        />
    )
}

interface BackgroundProps {
    media?: Media
    className?: string
    classNameImage?: string
    children?: ReactNode
}

const Background = ({ media, className, classNameImage, children }: BackgroundProps) => {
    if (!media || media.type !== MediaType.IMAGE) return null

    return (
        <div className={className} style={{ position: 'relative' }}>
            <Image
                src={`/api/uploads/images/${media.uri}`}
                alt={media.alt || ''}
                className={classNameImage}
                fill={true}
            />
            {children}
        </div>
    )
}

CustomImage.Background = Background

export default CustomImage
