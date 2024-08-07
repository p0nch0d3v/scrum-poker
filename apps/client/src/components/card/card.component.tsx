import { Card, CardContent, Tooltip, Typography, useTheme } from "@mui/material";
import { FunctionComponent } from "react";

type CardProps = {
    card: any,
    onClick?: any,
    disabled?: boolean,
    selected?: boolean,
    toolTipText?: string | undefined, 
    innerTextStyle?: any | undefined
}

const cardStyle = (disabled?: boolean, selected?: boolean) => {
    const themeOptions = useTheme();
    return {
        margin: '0.75em',
        height: '5em',
        width: '3.5em',
        cursor: disabled === true ? 'not-allowed' : 'pointer',
        opacity: disabled === true ? 0.5 : 1,
        border: `2px solid ${selected === true ? themeOptions.palette.primary.main : 'transparent'}`
    }
}

const CardComponent: FunctionComponent<CardProps> = ({ card, onClick, disabled, selected, toolTipText, innerTextStyle }) => {
    return (
        card.value !== null ? (
            <Card sx={cardStyle(disabled, selected)} onClick={disabled === true ? undefined : onClick}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}>
                    <Tooltip arrow
                        placement="bottom"
                        title={<Typography variant="h5">{toolTipText}</Typography>}>
                        <Typography sx={{ fontSize: '2em' }} style={innerTextStyle}>
                            {card.text && card.text.length > 0 ? card?.text : <>&nbsp;</>}
                        </Typography>
                    </Tooltip>
                </CardContent>
            </Card>
        ) : <></>
    );
}

export default CardComponent;