// import styles from './Form.module.scss'

const Form = () => {
    return (
        <section>
            <h4>Award winning work</h4>
            <h3>Recent works</h3>

            <div>
                <div>
                    {[].map((_, idx) => (
                        <div key={idx}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt="" />
                            <span>email@mail.com</span>
                        </div>
                    ))}
                </div>
                <div>
                    <div>
                        <input />
                        <input />
                    </div>
                    <div>
                        <input />
                        <input />
                    </div>
                    <div>
                        <textarea />
                    </div>
                </div>
                <button>Send message</button>
            </div>
        </section>
    )
}

export default Form
