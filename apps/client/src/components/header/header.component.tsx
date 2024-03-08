import useLocalStorage from '../../hooks/useLocalStorage ';
import { useRef } from 'preact/hooks';

export default function HeaderComponent() {
    const [userName, setUserName] = useLocalStorage('userName', null);
    const userNameInput = useRef(null);

    const onSetUserNameClick = () => {
        const newUserNameValue = userNameInput.current?.['value'];
        setUserName(newUserNameValue);
    }

    return (<>
        <div>
            Name [{userName}]:
            <input value={userName}
                type="text"
                placeholder={'your name'}
                ref={userNameInput} />
            <button onClick={onSetUserNameClick}>Set</button>
        </div>
    </>);
}