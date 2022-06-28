import { ChangeEventHandler } from 'react'

interface Props<T> {
    value: T
    onChange: (value: T) => void
    className?: string
}

const style = {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    height: 'inherit',
    width: 'inherit',

    border: 'none',
    // all: 'inherit',
}

const StyledInput = ({ value, onChange, className }: Props<string>) => (
    <div className={className}>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={style}
            type="text"
        />
    </div>
)

const Span = ({ value, onChange, className }: Props<string>) => (
    <span className={className}>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={style}
            type="text"
        />
    </span>
)

const P = ({ value, onChange, className }: Props<string>) => (
    <p className={className}>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={style}
            type="text"
        />
    </p>
)

const H1 = ({ value, onChange, className }: Props<string>) => (
    <h1 className={className}>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={style}
            type="text"
        />
    </h1>
)

const H2 = ({ value, onChange, className }: Props<string>) => (
    <h2 className={className}>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={style}
            type="text"
        />
    </h2>
)

const H3 = ({ value, onChange, className }: Props<string>) => (
    <h3 className={className}>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={style}
            type="text"
        />
    </h3>
)

const H4 = ({ value, onChange, className }: Props<string>) => (
    <h4 className={className}>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={style}
            type="text"
        />
    </h4>
)

StyledInput.div = StyledInput
StyledInput.span = Span
StyledInput.p = P
StyledInput.h1 = H1
StyledInput.h2 = H2
StyledInput.h3 = H3
StyledInput.h4 = H4

export default StyledInput
