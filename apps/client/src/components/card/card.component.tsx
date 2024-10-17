import { Card, CardContent, Tooltip, Typography, useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { isUndefinedNullOrEmpty, isUndefinedOrNull } from "../../helpers/helpers";

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
        margin: '0.1em',
        height: '5em',
        width: '3.6em',
        cursor: disabled === true ? 'not-allowed' : 'pointer',
        opacity: disabled === true ? 0.5 : 1,
        border: `2px solid ${selected === true ? themeOptions.palette.primary.main : 'transparent'}`,
        display: 'flex',
        padding: '0 !important',
        alignItems: 'center', 
        alignContent: 'center', 
        justifyContent: 'center', 
        justifyItems: 'center'
    }
}

const cardContentStyle = () => {
    return {
        display: 'flex',
        flexDirection: 'column',         
        padding: '0 !important', 
        alignItems: 'center', 
        alignContent: 'center', 
        justifyContent: 'center', 
        justifyItems: 'center'
    };
}

const CardComponent: FunctionComponent<CardProps> = ({ card, onClick, disabled, selected, toolTipText, innerTextStyle }) => {
    let innerCardContent = (
        <></>
    )

    if (!isUndefinedOrNull(card.user)) {
        innerCardContent = (
            <img src={card.user.user.picture} style={{ height: 'auto', maxWidth: '100%' }} />
        );
    }
    else if (!isUndefinedOrNull(card.text)) {
        innerCardContent = (
            <Typography sx={{ fontSize: '2em' }} style={innerTextStyle}>
                {card.text && card.text.length > 0 ? card?.text : <>&nbsp;</>}
            </Typography>
        );
    }

    return (
        card.value !== null ? (
            <Card sx={cardStyle(disabled, selected)} onClick={disabled === true ? undefined : onClick}>
                <CardContent sx={cardContentStyle()} >
                    {!isUndefinedNullOrEmpty(toolTipText) && <Tooltip arrow
                        placement="bottom"
                        title={<Typography variant="h5">{toolTipText}</Typography>}>
                        {innerCardContent}
                    </Tooltip>}
                    {isUndefinedNullOrEmpty(toolTipText) && innerCardContent}
                </CardContent>
            </Card>
        ) : <></>
    );
}

export default CardComponent;