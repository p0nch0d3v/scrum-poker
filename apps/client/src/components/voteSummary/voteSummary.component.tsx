import { Box, useTheme } from "@mui/material";
import { CardDTO } from "models";
import { ParticipantDTO, SummaryChartItemDTO } from "models";
import { FunctionComponent, useEffect, useState } from "react";
import SummaryChartComponent from '../summaryChart/summaryChart.component';

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
        'alignItems': 'center',
        'flexWrap': 'no-wrap',
        'flexDirection': 'row'
    }
};

const summaryChartStyle = {
    'width': '50vw'
};

const summaryTableStyle = {
    'width': '50vw'
};

const summaryItemStyle = {
    'fontSize': '1.5em',
    'display': 'block'
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
    const [chartData, setChartData] = useState<Array<SummaryChartItemDTO>>([]);

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

        let chartDataTemp: SummaryChartItemDTO[] = [];
        users.forEach(user => {
            let voteValue: Number = isNaN(Number(user.vote?.value)) ? -1 : Number(user.vote?.value);
            console.log('voteValue', voteValue);
            if (voteValue !== -1) {
                let findIndex = chartDataTemp.findIndex((i) => i.label === voteValue.toString())
                if (findIndex > -1) {
                    chartDataTemp[findIndex].value += 1;
                }
                else {
                    chartDataTemp.push({ label: voteValue.toString(), value: 1 });
                }
            }
        });
        console.log('chartDataTemp', chartDataTemp)
        setChartData(chartDataTemp);
    }, [users])

    return (
        <Box sx={mainStyle}>
            <SummaryChartComponent style={summaryChartStyle}
                data={chartData} innerRadius={100 * 0.25} outerRadius={100} />
            <Box sx={summaryTableStyle}>
                {Object.keys(summary).reverse().map(function (key) {
                    return <Box sx={summaryItemStyle}>
                        <span style={summaryItemKeyStyle}>{key}</span>
                        <span style={summaryItemValueStyle}>{summary[key]}</span>
                    </Box>
                })}</Box>
        </Box>
    )
}

export default VoteSummaryComponent;
