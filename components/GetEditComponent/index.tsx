import get from 'lodash.get'
import Blocks from '../../blocks'

interface GetEditComponentProps {
    block?: string | null
    defaultValues: any
    onChange: (value: any) => void
}

const GetEditComponent = ({ block, defaultValues, onChange }: GetEditComponentProps) => {
    if (!block) return null

    const Component = get(Blocks, block, () => null)

    return <Component.Edit defaultValues={defaultValues} onChange={onChange} />
}

export default GetEditComponent
