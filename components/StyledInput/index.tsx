import styles from './StyledInput.module.css'

interface Props<T> {
    value: T
    onChange: (value: T) => void
    className?: string
}

const StyledInput = ({ value, onChange, className }: Props<string>) => (
    <div className={className}>
        <textarea
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            // type="text"
        />
    </div>
)

const Span = ({ value, onChange, className }: Props<string>) => (
    <span className={className}>
        <textarea
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            // type="text"
        />
    </span>
)

const P = ({ value, onChange, className }: Props<string>) => (
    <p className={className}>
        <textarea
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            // type="text"
        />
    </p>
)

const Li = ({ value, onChange, className }: Props<string>) => (
    <li className={className}>
        <input
            placeholder="Lorem ipsum dolor sit amet"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </li>
)

const H1 = ({ value, onChange, className }: Props<string>) => (
    <h1 className={className}>
        <input
            placeholder="Lorem ipsum dolor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </h1>
)

const H2 = ({ value, onChange, className }: Props<string>) => (
    <h2 className={className}>
        <input
            placeholder="Lorem ipsum dolor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </h2>
)

const H3 = ({ value, onChange, className }: Props<string>) => (
    <h3 className={className}>
        <input
            placeholder="Lorem ipsum dolor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </h3>
)

const H4 = ({ value, onChange, className }: Props<string>) => (
    <h4 className={className}>
        <input
            placeholder="Lorem ipsum dolor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            type="text"
        />
    </h4>
)

StyledInput.div = StyledInput
StyledInput.span = Span
StyledInput.p = P
StyledInput.li = Li
StyledInput.h1 = H1
StyledInput.h2 = H2
StyledInput.h3 = H3
StyledInput.h4 = H4

export default StyledInput
