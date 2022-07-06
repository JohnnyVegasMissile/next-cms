import get from 'lodash.get'
import Blocks from '../../blocks'

interface GetEditComponentProps {
    type?: string | null
    defaultValues: any
    onChange: (value: any) => void
}

const GetEditComponent = ({ type, defaultValues, onChange }: GetEditComponentProps) => {
    if (!type) return null

    const Component = get(Blocks, type, () => null)

    return <Component.Edit defaultValues={defaultValues} onChange={onChange} />
}

export default GetEditComponent
