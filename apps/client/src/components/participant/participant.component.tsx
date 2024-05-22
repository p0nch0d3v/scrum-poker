import { Box, Card, CardContent, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import CardComponent from "../card/card.component";

type ParticipantProps = {
    participant: any
    current: boolean
}

const cardBoxStyle = {
    minWidth: '15em',
    paddingTop: '0',
    paddingBottom: '0',
    minHeight: '7.5em'
};

const cardContentStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '0',
    paddingBottom: '0'
};

const userNameStyle = (current: boolean) => {
    return {
        fontSize: '1em',
        textDecoration: current ? 'underline' : '',
        textWrap: 'wrap',
        maxWidth: '50%'
    }
};

const emptyCard = {'text': '', 'value': ''};
const hiddenCard = { 'text': '*', 'value': '*' };

const ParticipantComponent: FunctionComponent<ParticipantProps> = ({ participant, current }) => {
    return (
        <Card sx={cardBoxStyle} >
            <CardContent sx={cardContentStyle}>
                <Typography sx={userNameStyle(current)}>
                    {participant.userName}
                </Typography>
                {!participant.vote && <CardComponent card={emptyCard} onClick={null} />}
                {participant.vote && <CardComponent card={participant.hide ? hiddenCard : participant.vote} onClick={null} />}
                
            </CardContent>
        </Card>
    );
}

export default ParticipantComponent;
