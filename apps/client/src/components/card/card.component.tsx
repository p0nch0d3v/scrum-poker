import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { FunctionComponent } from "react";


type CardProps = {
    card: any,
    onClick: any,
    disabled: boolean
}

const cardStyle = (disabled: boolean) => {
    return {
        margin: '1em',
        width: '4em',
        cursor: disabled === true ? 'not-allowed' : 'pointer',
        opacity: disabled === true ? 0.5 : 1
    }
}

const CardComponent: FunctionComponent<CardProps> = ({ card, onClick, disabled }) => {
    return (
        card.value !== null ? (<Card sx={cardStyle(disabled)} onClick={disabled === true ? undefined : onClick}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}>
                <Typography sx={{ fontSize: '2em' }}>
                    {card.text && card.text.length > 0 ? card?.text : <>&nbsp;</>}
                </Typography>
            </CardContent>
        </Card>) : <></>

    );
}

export default CardComponent;