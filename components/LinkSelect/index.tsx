import { Input, Select, Space, TreeSelect } from 'antd'
import {
    LinkOutlined,
    GlobalOutlined,
    HomeOutlined,
    LoginOutlined,
    FileOutlined,
    ContainerOutlined,
    BookOutlined,
} from '@ant-design/icons'
import './styles.scss'
import { useQuery } from '@tanstack/react-query'
import { getSlugsSimple } from '~/network/slugs'
import { ObjectId } from '~/types'
import { LinkType, LinkProtocol, PageType, Link } from '@prisma/client'

const { Option } = Select

interface Option {
    value: string | number
    label: string
    children?: Option[]
}

export type LinkValue =
    | {
          type: typeof LinkType.IN
          slugId?: ObjectId | undefined

          link?: never
          prototol?: never
      }
    | {
          type: typeof LinkType.OUT
          link?: string | undefined
          prototol?: LinkProtocol | undefined

          slugId?: never
      }

interface LinkSelectProps {
    value: LinkValue
    onChange(value: LinkValue): void
    error?: boolean
}

const LinkSelect = ({ value, onChange, error }: LinkSelectProps) => {
    // const [q, setQ] = useState('')
    const slugs = useQuery(['slugs-simple'], () => getSlugsSimple(), { enabled: value.type === LinkType.IN })

    const options = slugs.data?.map((slug) => ({
        value: slug.id,
        label: !!slug.page ? (
            <Space>
                <FileOutlined rev={undefined} />
                {slug.page?.name}
            </Space>
        ) : (
            <Space>
                <ContainerOutlined rev={undefined} />
                {slug.container?.name}
            </Space>
        ),
        children: slug.childs.map((child) => ({
            value: child.id,
            label: (
                <Space>
                    <BookOutlined rev={undefined} />
                    {child.content?.name}
                </Space>
            ),
        })),
    }))

    const onPageChange = (slugId: ObjectId | undefined) =>
        value.type === LinkType.IN && onChange({ ...value, slugId })

    const onTypeChange = (type: LinkType) => {
        if (type === LinkType.IN) {
            onChange({
                type: LinkType.IN,
                slugId: undefined,
            })
        } else {
            onChange({
                type: LinkType.OUT,
                link: undefined,
                prototol: LinkProtocol.HTTPS,
            })
        }
    }

    const onProtocolChange = (prototol: LinkProtocol) =>
        value.type === LinkType.OUT &&
        onChange({
            ...value,
            prototol,
        })

    const onLinkChange = (link: string) => value.type === 'OUT' && onChange({ ...value, link })

    const selectBefore = (
        <Select value={value.prototol} onChange={onProtocolChange} size="small">
            <Option value="http">http://</Option>
            <Option value="https">https://</Option>
        </Select>
    )

    return (
        <Space.Compact size="small">
            {value.type === 'IN' ? (
                <>
                    {/* <Cascader
                        size="small"
                        value={value.slugId ? [value.slugId] : undefined}
                        options={options}
                        onChange={(e) => onPageChange(e?.[0] as ObjectId)}
                        placeholder="Please select"
                        className="link-select-cascader"
                        changeOnSelect
                        showSearch
                        searchValue={q}
                        onSearch={setQ}
                    /> */}
                    <TreeSelect
                        // showSearch
                        status={error ? 'error' : undefined}
                        size="small"
                        placeholder="Please select"
                        className="link-select-tree"
                        value={value.slugId}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        onChange={onPageChange}
                        treeData={[
                            {
                                value: PageType.HOMEPAGE,
                                label: (
                                    <Space>
                                        <HomeOutlined rev={undefined} />
                                        Homepage
                                    </Space>
                                ),
                            },
                            {
                                value: PageType.SIGNIN,
                                label: (
                                    <Space>
                                        <LoginOutlined rev={undefined} />
                                        Sign In
                                    </Space>
                                ),
                            },
                            ...(options || []),
                        ]}
                        autoClearSearchValue={false}
                        // searchValue={q}
                        // onSearch={setQ}
                    />
                </>
            ) : (
                <Input
                    value={value.link}
                    status={error ? 'error' : undefined}
                    onChange={(e) => onLinkChange(e.target.value)}
                    addonBefore={selectBefore}
                    size="small"
                    placeholder="Please select"
                    className="link-select-input"
                    allowClear
                />
            )}
            <Select
                status={error ? 'error' : undefined}
                size="small"
                value={value.type}
                onChange={onTypeChange}
                className="link-select-select"
            >
                <Option value={LinkType.IN}>
                    <LinkOutlined rev={undefined} />
                </Option>
                <Option value={LinkType.OUT}>
                    <GlobalOutlined rev={undefined} />
                </Option>
            </Select>
        </Space.Compact>
    )
}

export default LinkSelect
