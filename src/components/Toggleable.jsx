import { useState, useImperativeHandle, forwardRef } from "react";

const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);

    const hideButton = { display: visible ? 'none' : '' }
    const showForm = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible);
    }

    useImperativeHandle(ref, () => {
        return { toggleVisibility }
    })

    return (
        <div>
            <div style={hideButton}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showForm}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    )
})

export default Togglable