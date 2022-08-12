import { Theme } from '@types'
import get from 'lodash.get'
import Blocks from '../../blocks'

interface GetEditComponentProps {
    block?: string | null
    defaultValues: any
    onChange: (value: any) => void
    theme?: Theme
}

const GetEditComponent = ({ block, defaultValues, onChange, theme }: GetEditComponentProps) => {
    if (!block) return null

    const Component = get(Blocks, block, () => null)

    return <Component.Edit defaultValues={defaultValues} onChange={onChange} theme={theme} />
}

export default GetEditComponent
