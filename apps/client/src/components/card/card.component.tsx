import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { FunctionComponent } from "react";


type CardProps = {
    card: any,
    onClick: any
}

const CardComponent: FunctionComponent<CardProps> = ({ card, onClick }) => {
    return (
            card.value !== null ?  (<Card sx={{ margin: '1em', width: '4em', cursor: 'pointer' }} onClick={onClick}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}>
                    <Typography sx={{ fontSize: '2em' }}>
                        {card.text}
                    </Typography>
                </CardContent>
            </Card>) : <></>
        
    );
}

export default CardComponent;