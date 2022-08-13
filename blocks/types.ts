import { ContainerField } from '@prisma/client'
import { FullSection, PageProps } from '../types'

export interface Block {
    name: string
    preview?: string
    type?: 'container' | 'content'
    View: (props: Props) => JSX.Element
    Edit: (props: Props) => JSX.Element
}

export interface Props {
    defaultValues: string
    theme: {
        background: string
        primary: string
        secondary: string
    }
    onChange?: (values: string) => void
    section?: FullSection
    page?: PageProps
    fields?: ContainerField[]
}
