import { useEffect, useState } from 'react';
import Markdown from 'react-markdown'
// import text from './privacyPolicy.md'

export default function PrivacyPolicyComponent() {
    const [content, setContent] = useState('');
    useEffect(() => {
        fetch('/privacyPolicy.md')
            .then((r) => r.text())
            .then(text => {
                setContent(text);
            })
    }, [])

    return (
        <div style={{margin:'1rem'}}>
            <Markdown>
                {content}
            </Markdown>
        </div>);
}