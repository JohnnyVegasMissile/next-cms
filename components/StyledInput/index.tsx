import styles from './StyledInput.module.css'

interface Props<T> {
    value: T
    onChange: (value: T) => void
    className?: string
    style?: React.CSSProperties
}

const StyledInput = ({ value, onChange, className, style }: Props<string>) => (
    <div className={className} style={style}>
        <textarea
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            // type="text"
        />
    </div>
)

const A = ({ value, onChange, className, style }: Props<string>) => (
    <span className={className} style={style}>
        <input
            placeholder="Lorem ipsum dolor sit amet"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </span>
)

const Span = ({ value, onChange, className, style }: Props<string>) => (
    <span className={className} style={style}>
        <textarea
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            // type="text"
        />
    </span>
)

const P = ({ value, onChange, className, style }: Props<string>) => (
    <p className={className} style={style}>
        <textarea
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            // type="text"
        />
    </p>
)

const Li = ({ value, onChange, className, style }: Props<string>) => (
    <li className={className} style={style}>
        <input
            placeholder="Lorem ipsum dolor sit amet"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </li>
)

const H1 = ({ value, onChange, className, style }: Props<string>) => (
    <h1 className={className} style={style}>
        <input
            placeholder="Lorem ipsum dolor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </h1>
)

const H2 = ({ value, onChange, className, style }: Props<string>) => (
    <h2 className={className} style={style}>
        <input
            placeholder="Lorem ipsum dolor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </h2>
)

const H3 = ({ value, onChange, className, style }: Props<string>) => (
    <h3 className={className} style={style}>
        <input
            placeholder="Lorem ipsum dolor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </h3>
)

const H4 = ({ value, onChange, className, style }: Props<string>) => (
    <h4 className={className} style={style}>
        <input
            placeholder="Lorem ipsum dolor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </h4>
)

const Button = ({ value, onChange, className, style }: Props<string>) => (
    <button className={className} onClick={(e) => e.preventDefault()} style={style}>
        <input
            placeholder="Lorem ipsum"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </button>
)

StyledInput.div = StyledInput
StyledInput.span = Span
StyledInput.p = P
StyledInput.li = Li
StyledInput.h1 = H1
StyledInput.h2 = H2
StyledInput.h3 = H3
StyledInput.h4 = H4
StyledInput.button = Button
StyledInput.a = A

export default StyledInput
