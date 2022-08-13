import { ContainerField } from '@prisma/client'
import { Theme } from '@types'
import get from 'lodash.get'
import Blocks from '../../blocks'

interface GetEditComponentProps {
    block?: string | null
    defaultValues: any
    onChange: (value: any) => void
    theme?: Theme
    fields?: ContainerField[]
}

const GetEditComponent = ({ block, defaultValues, onChange, theme, fields }: GetEditComponentProps) => {
    if (!block) return null

    const Component = get(Blocks, block, () => null)

    return <Component.Edit defaultValues={defaultValues} onChange={onChange} theme={theme} fields={fields} />
}

export default GetEditComponent
