import { route } from 'preact-router';
import { useRef } from 'preact/hooks';
import useLocalStorage from '../../hooks/useLocalStorage ';

export default function HeaderComponent() {
    const [userName, setUserName] = useLocalStorage('userName', null);
    const userNameInput = useRef(null);

    const onSetUserNameClick = () => {
        const newUserNameValue = userNameInput.current?.['value'];
        setUserName(newUserNameValue);
    }

    return (<>
        <div><span onClick={() => route('/')}>Back to home</span>{' '}<span>{userName}</span></div>
        Name [{userName}]:
        <input value={userName} 
            type="text" 
            placeholder={'your name'} 
            ref={userNameInput} />
        <button onClick={onSetUserNameClick}>Set</button>
    </>);
}