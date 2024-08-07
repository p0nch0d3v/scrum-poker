import { FunctionComponent } from "react";
import { backdropClasses, Box } from "@mui/material";
import ParticipantComponent from "../participant/participant.component";
import { ParticipantDTO } from "models";

type ParticipantListProps = {
    users: Array<ParticipantDTO>
    connectionId: string | undefined
    rommHasAdmin: boolean
    isCurrentUserAdmin: boolean
    onSetRoomAdmin: any
}

const participantListWrapperStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  alignSelf: 'center',
  marginTop: '1rem'
}

const ParticipantListComponent: FunctionComponent<ParticipantListProps> = ({ users, connectionId, rommHasAdmin, isCurrentUserAdmin, onSetRoomAdmin }) => {
    return (
      <Box
        sx={participantListWrapperStyle}
        width={{ xs: '100%', s: '100%', md: '75%', l: '75%', xl: '75%' }}>
          {[...new Set(users)].map((user) =>
            <ParticipantComponent
              participant={user}
              current={user.socketId === connectionId ? true : false}
              rommHasAdmin={rommHasAdmin}
              isCurrentUserAdmin={isCurrentUserAdmin}
              onSetRoomAdmin={onSetRoomAdmin}
            />
            )}
        </Box>
    );
};

export default ParticipantListComponent;
