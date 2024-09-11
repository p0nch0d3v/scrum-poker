import { Box, useTheme } from "@mui/material";
import { CardDTO } from "models";
import { ParticipantDTO, SummaryChartItemDTO } from "models";
import { FunctionComponent, useEffect, useState } from "react";
import { useWindowSize, useScreen } from 'usehooks-ts';
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
        'justifyContent': 'center',
        'flexWrap': 'wrap',
        'flexDirection': 'row'
    }
};

const summaryChartStyle = {
    'border': '1px solid transparent'
};

const summaryTableStyle = {
    'border': '1px solid transparent',
    'width': '50%'
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
    const { width = 0, height = 0 } = useWindowSize();

    useEffect(() => {
        let summaryTmp: any = {};
        users.forEach(user => {
            let index: number = isNaN(Number(user.vote?.value)) ? -1 : Number(user.vote?.value);
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
        let total: number = 0;
        users.forEach(user => {
            let voteValue: number = isNaN(Number(user.vote?.value)) ? -1 : Number(user.vote?.value);
            if (voteValue !== -1) {
                let findIndex = chartDataTemp.findIndex((i) => i.label === voteValue.toString())
                if (findIndex > -1) {
                    chartDataTemp[findIndex].value += 1;
                }
                else {
                    chartDataTemp.push({ label: voteValue.toString(), value: 1 });
                }
                total ++;
            }
        });
        chartDataTemp.forEach((item) => {
            let pct: number = (item.value * 100) / total;
            let pctStr: string = (Math.round(pct * 100) / 100).toFixed(1);
            item.label = `${item.label} [${pctStr}%]`;
        });
        setChartData(chartDataTemp);
    }, [users, width, height])

    const resizeFactor = width > height ? 0.15 : 0.25;

    if (chartData.length > 0 || summary.length > 0) {
        return (
            <Box sx={mainStyle}>
                <SummaryChartComponent style={summaryChartStyle}
                    data={chartData}
                    innerRadius={width * resizeFactor * 0.25}
                    outerRadius={width * resizeFactor}
                    windowinnerWidth={width} />
                <Box sx={summaryTableStyle}>
                    {Object.keys(summary).reverse().map(function (key) {
                        return <Box sx={summaryItemStyle}>
                            <span style={summaryItemKeyStyle}>{key}</span>
                            <span style={summaryItemValueStyle}>{summary[key]}</span>
                        </Box>
                    })}</Box>
            </Box>
        );
    }
    return <></>;
}

export default VoteSummaryComponent;
