import { AutoComplete, Typography } from 'antd'
import { useQuery, UseQueryResult } from 'react-query'
import { getContainers } from '../../network/containers'
import { getArticles } from '../../network/articles'
import type { Container } from '@prisma/client'
import { useMemo } from 'react'
// import { FullArticle } from 'types'
import get from 'lodash.get'

const { Text } = Typography

interface Props {
    value: string
    width?: number | `${string}%`
    onChange: (value: string) => void
}

const LinkInput = ({ value, onChange, width = 300 }: Props) => {
    const pages: UseQueryResult<Container[], Error> = useQuery<Container[], Error>(
        ['containers'],
        () => getContainers(),
        {
            // select: (data) => data.filter((e) => e.type !== 'error'),
            refetchOnMount: false,
        }
    )

    // const articles: UseQueryResult<FullArticle[], Error> = useQuery<FullArticle[], Error>(
    //     ['acticles'],
    //     () => getArticles(),
    //     {
    //         refetchOnMount: false,
    //     }
    // )

    const options = useMemo(() => {
        const pagesOptions =
            pages?.data?.map((page) => ({
                value: `/${page.slug}`,
                searchLabel: page.title,
                label: (
                    <>
                        <Text>{page.title}</Text>
                        <Text type="secondary">{` (Page)`}</Text>
                    </>
                ),
            })) || []
        // const articlesOptions =
        //     articles?.data?.map((article) => ({
        //         value: `/${article.page.slug}/${article.slug}`,
        //         searchLabel: `${article.title} ${article.page.title}`,
        //         label: (
        //             <>
        //                 <Text>{article.title}</Text>
        //                 <Text type="secondary">{` (${article.page.title} article)`}</Text>
        //             </>
        //         ),
        //     })) || []

        return [...pagesOptions]
    }, [pages])

    const isError = !!value && get(value, '0', '') !== '/' ? 'error' : ''

    return (
        <AutoComplete
            status={isError}
            value={value}
            options={options}
            style={{ width }}
            onSelect={(value: string) => onChange(value)}
            onChange={onChange}
            allowClear
            filterOption={(inputValue, option) =>
                option!.searchLabel.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        />
    )
}

export default LinkInput
