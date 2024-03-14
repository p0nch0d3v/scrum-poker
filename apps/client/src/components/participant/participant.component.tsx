import { Box, Card, CardContent, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import CardComponent from "../card/card.component";

type ParticipantProps = {
    participant: any
    current: boolean
}

const ParticipantComponent: FunctionComponent<ParticipantProps> = ({ participant, current }) => {
    return (
        <Card sx={{}}>
            <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '1em', textDecoration: current ? 'underline' : '' }}>
                    {participant.userName}
                </Typography>
                {participant.vote && <CardComponent card={participant.hide ? { 'text': '*', 'value': '*' } : participant.vote} onClick={null} />}
            </CardContent>
        </Card>
    );
}

export default ParticipantComponent;
