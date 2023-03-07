import { useMemo } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Button, Input, Popover, Space } from 'antd'
import { BgColorsOutlined } from '@ant-design/icons'

function padZero(str: number, len?: number) {
    len = len || 2
    var zeros = new Array(len).join('0')
    return (zeros + str).slice(-len)
}

function invertColor(hex: string, bw: boolean = true) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1)
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = (hex[0] || '') + (hex[0] || '') + hex[1] + hex[1] + hex[2] + hex[2]
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.')
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16)
    if (bw) {
        // https://stackoverflow.com/a/3943023/112731
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF'
    }
    // invert color components
    r = parseInt((255 - r).toString(16))
    g = parseInt((255 - g).toString(16))
    b = parseInt((255 - b).toString(16))
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b)
}

interface ColorPickerProps {
    value: string | undefined
    onChange(color: string): void
    disabled?: boolean
}

const ColorPicker = ({ value, onChange, disabled }: ColorPickerProps) => {
    // const [color, setColor] = useState('#aabbcc')

    const labelColor = useMemo(() => {
        if (!value) return '#ffffff'

        return invertColor(value)
    }, [value])

    if (disabled)
        return (
            <Button disabled={disabled} size="small" icon={<BgColorsOutlined />}>
                Choose color
            </Button>
        )

    return (
        <Popover
            placement="right"
            content={
                <Space direction="vertical" align="center">
                    <HexColorPicker color={value} onChange={onChange} />
                    <Input
                        size="small"
                        style={{ textAlign: 'center', width: 100 }}
                        value={value}
                        onChange={(e) =>
                            onChange(
                                !!e.target.value && e.target.value[0] !== '#'
                                    ? `#${e.target.value}`
                                    : e.target.value
                            )
                        }
                    />
                </Space>
            }
            trigger="click"
        >
            <Button
                size="small"
                icon={<BgColorsOutlined />}
                style={{
                    color: labelColor,
                    backgroundColor: value,
                    borderColor: labelColor,
                }}
            >
                Choose color
            </Button>
        </Popover>
    )
}

export default ColorPicker
