import { useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { getShortName, isUndefinedNullOrEmpty, isUndefinedOrNull, sanitizeText } from "../../helpers/helpers";
import CardComponent from "../card/card.component";
import { ParticipantDTO } from "models";
import { act } from "react-dom/test-utils";

type ParticipantProps = {
    participant: ParticipantDTO
    current: boolean
    rommHasAdmin: boolean
    onSetRoomAdmin: Function
    isCurrentUserAdmin: boolean
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

const ParticipantComponent: FunctionComponent<ParticipantProps> = ({ participant, current, rommHasAdmin, onSetRoomAdmin, isCurrentUserAdmin }) => {
    const initialsCard = { 'text': getShortName(sanitizeText(participant.userName)), 'value': '' };
    const hiddenCard = { 'text': '*', 'value': '*' };

    console.debug('isCurrentUserAdmin', isCurrentUserAdmin);
    console.debug('participant.isAdmin', participant.isAdmin);
    console.debug('participant.vote', participant.vote, !isUndefinedOrNull(participant?.vote));
    console.debug('participant.hide', participant.hide);

    // ----------
    let card = undefined;
    if (!isUndefinedOrNull(participant?.vote)) {
        card = participant.vote;
        if (participant.hide) {
            card = hiddenCard;
        }
    }
    else if (!participant.vote) {
        card = initialsCard;
    }

    // ----------
    let innerTextStyle: any = { 'fontSize': '2em' };
    if (participant.isAdmin) {
        innerTextStyle = { ...innerTextStyle, 'font-weight': '900' };
    }
    else {
        innerTextStyle = { ...innerTextStyle, 'font-style': 'italic' };
    }

    // ----------
    let onParticipantClick = () => { };
    if ((!isCurrentUserAdmin && !participant.isAdmin) || (isCurrentUserAdmin && !participant.isAdmin)) {
        onParticipantClick = () => {onSetRoomAdmin(participant.userName)};
    }

    // ----------
    let toolTipText = ""
    /*if (participant.isAdmin) {
        toolTipText = "Admin";
    }
    else if (isCurrentUserAdmin && participant.isAdmin && !isUndefinedOrNull(participant.vote) && participant.hide) {
        toolTipText = `Admin | ${participant.vote?.text}`;
    }
    else if (isCurrentUserAdmin && !participant.isAdmin) {
        toolTipText = "Make Admin";
    }
    else if (isCurrentUserAdmin && !participant.isAdmin && !isUndefinedOrNull(participant.vote) && participant.hide) {
        toolTipText = `Make Admin | ${participant.vote?.text}`;
    }
    else if (!isCurrentUserAdmin && !participant.isAdmin) {
        toolTipText
    }
    else {
        toolTipText = sanitizeText(participant.userName);
    }*/

    return (
        <span style={cardContentStyle(!isUndefinedOrNull(participant.vote))}>
            <CardComponent card={card} onClick={onParticipantClick} toolTipText={toolTipText} innerTextStyle={innerTextStyle} />
        </span>
    );
}

export default ParticipantComponent;
