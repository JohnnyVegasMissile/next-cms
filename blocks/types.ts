import { FullPage, PageTypes } from '../types'

export interface Block {
    name: string
    preview: string
    pages: (PageTypes | 'element')[]
    View: (props: Props) => JSX.Element
    Edit: (props: Props) => JSX.Element
}

export interface Props {
    defaultValues: string
    onChange?: (values: string) => void
    page?: FullPage
}
