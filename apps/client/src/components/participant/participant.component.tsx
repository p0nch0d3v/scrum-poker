import { useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { getShortName, isUndefinedOrNull, sanitizeText } from "../../helpers/helpers";
import CardComponent from "../card/card.component";

type ParticipantProps = {
    participant: any
    current: boolean
    rommHasAdmin: boolean
    onSetRoomAdmin: any
    isUserAdmin: boolean
}

const cardContentStyle = (vote: boolean): any => {
    const themeOptions = useTheme();
    return {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 !important',
        marginRight: '1em',
        marginBottom: '1rem',
        border: `1px solid ${vote ? themeOptions.palette.primary.main : 'transparent'}`
    }
};

const ParticipantComponent: FunctionComponent<ParticipantProps> = ({ participant, current, rommHasAdmin, onSetRoomAdmin, isUserAdmin }) => {
    const emptyCard = { 'text': getShortName(sanitizeText(participant.userName)), 'value': '' };
    const hiddenCard = { 'text': '*', 'value': '*' };
    const card = participant.vote ? (participant.hide ? hiddenCard : participant.vote) : emptyCard;

    let onParticipantClick = undefined;
    let toolTipText = '';
    let innerTextStyle: any = { 'fontSize': '2em', 'font-style': 'normal' };

    if ((isUserAdmin === true && current === false) || rommHasAdmin === false) {
        onParticipantClick = () => { onSetRoomAdmin(participant.userName) };
        toolTipText = `${sanitizeText(participant.userName)} | Make Admin`;
        innerTextStyle = { ...innerTextStyle };
    }
    if (!participant.vote || !participant.hide || (participant.vote && participant.hide)) {
        toolTipText = toolTipText || sanitizeText(participant.userName);
        innerTextStyle = { ...innerTextStyle };
    }
    if (!participant.vote || !participant.hide) {
        innerTextStyle = { ...innerTextStyle, 'font-style': 'italic' };
    }
    if (participant.vote && participant.hide && isUserAdmin) {
        toolTipText = toolTipText || `${sanitizeText(participant.userName)} | ${participant.vote.text}`;
    }

    return (
        <span style={cardContentStyle(!isUndefinedOrNull(participant.vote))}>
            <CardComponent card={card} onClick={onParticipantClick} toolTipText={toolTipText} innerTextStyle={innerTextStyle} />
        </span>
    );
}

export default ParticipantComponent;
