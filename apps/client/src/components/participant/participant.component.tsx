import { useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { getShortName, isUndefinedOrNull, sanitizeText } from "../../helpers/helpers";
import CardComponent from "../card/card.component";
import { ParticipantDTO } from "models";

type ParticipantProps = {
    participant: ParticipantDTO
    onSetRoomAdmin: Function
    isCurrentUserAdmin: boolean
    roomHasAdmin: boolean
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

const ParticipantComponent: FunctionComponent<ParticipantProps> = ({ participant, isCurrentUserAdmin, onSetRoomAdmin, roomHasAdmin }) => {
    const initialsCard = {
        'user': participant
    }

    const hiddenCard = { 
        'text': '*', 
        'value': '*' 
    };

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
    let innerTextStyle: any = { 'fontSize': '1.8em', 'textAlign': 'center' };
    if (participant.isAdmin) {
        innerTextStyle = { ...innerTextStyle, 'font-weight': '900' };
    }
    else {
        innerTextStyle = { ...innerTextStyle, 'fontStyle': 'italic' };
    }

    // ----------
    let onParticipantClick = () => { };
    if ((roomHasAdmin === false && isCurrentUserAdmin === false && participant.isAdmin === false) || (isCurrentUserAdmin && participant.isAdmin === false)) {
        onParticipantClick = () => { onSetRoomAdmin(participant.user.email) };
    }

    // ----------
    let toolTipText = "";
    if (!isCurrentUserAdmin) {
        if (!participant.isAdmin) {
            toolTipText = participant.user.email;
        }
        else if (participant.isAdmin) {
            toolTipText = `${participant.user.email} | Admin`;
        }
    }
    else if (isCurrentUserAdmin) {
        if (!participant.isAdmin) {
            if (isUndefinedOrNull(participant.vote)) {
                toolTipText = `${participant.user.email} | Make Admin`;
            }
            else if (participant.vote) {
                if (!participant.hide) {
                    toolTipText = `${participant.user.email} | Make Admin`;
                }
                else if (participant.hide) {
                    toolTipText = `${participant.user.email} | Make Admin | ${participant.vote?.text}`;
                }
            }
        }
        else if (participant.isAdmin) {
            if (isUndefinedOrNull(participant.vote)) {
                toolTipText = `${participant.user.email} | Admin`;
            }
            else if (participant.vote) {
                if (!participant.hide) {
                    toolTipText = `${participant.user.email} | Admin`;
                }
                else if (participant.hide) {
                    toolTipText = `${participant.user.email} | Admin | ${participant.vote?.text}`;
                }
            }
        }
    }

    return (
        <span style={cardContentStyle(!isUndefinedOrNull(participant.vote))}>
            <CardComponent 
                card={card} 
                onClick={onParticipantClick} 
                toolTipText={toolTipText} 
                innerTextStyle={innerTextStyle} />
        </span>
    );
}

export default ParticipantComponent;
