import { getElementDetails } from '../../network/elements'
import { useQuery, UseQueryResult } from 'react-query'
import Blocks from '../../blocks'
import { Typography } from 'antd'
import get from 'lodash.get'
import type { Element } from '@prisma/client'

const { Text } = Typography

const DisplayElementView = ({ id }: { id: string }) => {
    const element: UseQueryResult<Element, Error> = useQuery<Element, Error>(
        ['elements', { id }],
        () => getElementDetails(id),
        {
            refetchOnWindowFocus: false,
        }
    )

    if (element.isLoading) {
        return <Text>Loading...</Text>
    }

    if (element.isError || element.data === undefined) {
        return <Text>Error</Text>
    }

    const Component = get(Blocks, element.data.type, () => null)

    return <Component.View defaultValues={element.data.content} />
}

export default DisplayElementView
