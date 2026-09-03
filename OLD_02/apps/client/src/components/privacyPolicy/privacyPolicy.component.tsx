import { useEffect, useState } from 'react';
import Markdown from 'react-markdown'
// import text from './privacyPolicy.md'

export default function PrivacyPolicyComponent() {
    const [content, setContent] = useState('');
    

    const replaceOriginPlaceholder = function (input: string) {
        const origin = window.location.origin;
        const regex = /\{\{ORIGIN\}\}/gmi;
        const result = input.replace(regex, origin);
        return result;
    }

    useEffect(() => {
        fetch('/privacyPolicy.md')
            .then((r) => r.text())
            .then(text => {
                text = replaceOriginPlaceholder(text)
                setContent(text);
            })
    }, [])

    return (
        <div style={{ margin: '1rem' }}>
            <Markdown>
                {content}
            </Markdown>
        </div>);
}