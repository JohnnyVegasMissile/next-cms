import { Article } from '@prisma/client'
import { FullPage } from '../types'

export interface Block {
    name: string
    preview: string
    View: (props: Props) => JSX.Element
    Edit: (props: Props) => JSX.Element
}

export interface Props {
    defaultValues: string
    onChange?: (values: string) => void
    page?: FullPage
}
