import { Box, useTheme } from "@mui/material";
import { CardDTO } from "models";
import { ParticipantDTO } from "models";
import { FunctionComponent, useEffect, useState } from "react";

type VoteSummaryProps = {
    users: Array<ParticipantDTO>
}

const mainStyle = () => {
    const themeOptions = useTheme();
    return {
        'width': '100%',
        'min-height': '2.5em',
        'borderTop': `1px solid ${themeOptions.palette.primary.main}`,
        'borderBottom': `1px solid ${themeOptions.palette.primary.main}`,
        'marginTop': '1em',
        'display': 'flex',
        'alignContent': 'center',
        'alignItems': 'start',
        'flexWrap': 'wrap',
        'flexFlow': 'wrap'
    }
};

const summaryItemStyle = {
    'fontSize': '1.5em',
    'display': 'inline-block'
};

const summaryItemKeyStyle = {
    'paddingLeft': '0.5em',
    'paddingRight': '1em',
    'fontWeight': '900'
};

const summaryItemValueStyle = {
    'fontStyle': 'italic',
};

const VoteSummaryComponent: FunctionComponent<VoteSummaryProps> = ({ users }) => {

    const [summary, setSummary] = useState<any>([]);

    useEffect(() => {
        let summaryTmp: any = {};
        users.forEach(user => {
            let index: Number = isNaN(Number(user.vote?.value)) ? -1 : Number(user.vote?.value);
            if (index !== -1) {
                if (summaryTmp[index.toString()]) {
                    summaryTmp[index.toString()] += (", " + user.userName);
                }
                else {
                    summaryTmp[index.toString()] = user.userName;
                }
            }
        });
        setSummary(summaryTmp);
    }, [users])

    return (
        <Box sx={mainStyle}>
            {Object.keys(summary).reverse().map(function (key) {
                return <Box sx={summaryItemStyle}>
                    <span style={summaryItemKeyStyle}>{key}</span>
                    <span style={summaryItemValueStyle}>{summary[key]}</span>
                </Box>
            })}
        </Box>
    )
}

export default VoteSummaryComponent;