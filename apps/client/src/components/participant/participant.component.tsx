import { Button, Card, CardContent, Typography, Tooltip } from "@mui/material";
import { FunctionComponent } from "react";
import CardComponent from "../card/card.component";

type ParticipantProps = {
    participant: any
    current: boolean
    rommHasAdmin: boolean
    onSetRoomAdmin: any
    isUserAdmin: boolean
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

const emptyCard = { 'text': '', 'value': '' };
const hiddenCard = { 'text': '*', 'value': '*' };

const ParticipantComponent: FunctionComponent<ParticipantProps> = ({ participant, current, rommHasAdmin, onSetRoomAdmin, isUserAdmin }) => {
    return (
        <Card sx={cardBoxStyle} >
            <CardContent sx={cardContentStyle}>
                <Typography sx={userNameStyle(current)}>
                    {participant.userName}
                    {
                      (isUserAdmin === true && current === false) || rommHasAdmin === false ? 
                      <Tooltip disableFocusListener arrow 
                               placement="bottom"
                               title="Make Admin">
                        <Button onClick={() => { onSetRoomAdmin(participant.userName) }}>⭐</Button> 
                      </Tooltip>
                      : null
                    }
                </Typography>
                {!participant.vote && <CardComponent card={emptyCard} />}
                {participant.vote && <CardComponent card={participant.hide ? hiddenCard : participant.vote} />}

            </CardContent>
        </Card>
    );
}

export default ParticipantComponent;
