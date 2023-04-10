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
import { PageType } from '@prisma/client'

const { Option } = Select

interface Option {
    value: string | number
    label: string
    children?: Option[]
}

export type LinkValue = {
    type: 'IN' | 'OUT'
    slugId?: ObjectId | undefined
    link?: string | undefined
    prototol?: 'http' | 'https' | undefined
}

interface LinkSelectProps {
    value: LinkValue
    onChange(value: LinkValue): void
}

const LinkSelect = ({ value, onChange }: LinkSelectProps) => {
    // const [q, setQ] = useState('')
    const slugs = useQuery(['slugs-simple'], () => getSlugsSimple(), { enabled: value.type === 'IN' })

    const options = slugs.data?.map((slug) => ({
        value: slug.id,
        label: !!slug.page ? (
            <Space>
                <FileOutlined />
                {slug.page?.name}
            </Space>
        ) : (
            <Space>
                <ContainerOutlined />
                {slug.container?.name}
            </Space>
        ),
        children: slug.childs.map((child) => ({
            value: child.id,
            label: (
                <Space>
                    <BookOutlined />
                    {child.content?.name}
                </Space>
            ),
        })),
    }))

    const onPageChange = (slugId: ObjectId | undefined) => onChange({ ...value, slugId })

    const onTypeChange = (type: 'IN' | 'OUT') => {
        if (type === 'IN') {
            onChange({
                type: 'IN',
                link: '',
            })
        } else {
            onChange({
                type: 'OUT',
                slugId: undefined,
                prototol: 'https',
            })
        }
    }

    const onProtocolChange = (prototol: 'http' | 'https') => onChange({ ...value, prototol })

    const onLinkChange = (link: string) => onChange({ ...value, link })

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
                        size="small"
                        placeholder="Please select"
                        className="link-select-tree"
                        value={value.slugId}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        onChange={onPageChange}
                        treeData={[
                            {
                                value: 'HOME',
                                label: (
                                    <Space>
                                        <HomeOutlined />
                                        Homepage
                                    </Space>
                                ),
                            },
                            {
                                value: 'SIGNIN',
                                label: (
                                    <Space>
                                        <LoginOutlined />
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
                    onChange={(e) => onLinkChange(e.target.value)}
                    addonBefore={selectBefore}
                    size="small"
                    placeholder="Please select"
                    className="link-select-input"
                    allowClear
                />
            )}
            <Select size="small" value={value.type} onChange={onTypeChange} className="link-select-select">
                <Option value="IN">
                    <LinkOutlined />
                </Option>
                <Option value="OUT">
                    <GlobalOutlined />
                </Option>
            </Select>
        </Space.Compact>
    )
}

export default LinkSelect
