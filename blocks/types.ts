import { FullSection } from '../types'

export interface Block {
    name: string
    preview?: string
    type?: 'container' | 'content'
    View: (props: Props) => JSX.Element
    Edit: (props: Props) => JSX.Element
}

export interface Props {
    defaultValues: string
    onChange?: (values: string) => void
    section?: FullSection
}
