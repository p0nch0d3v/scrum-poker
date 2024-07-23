import { Button, Card, CardContent, Tooltip } from '@mui/material'
import { ParticipantDTO } from 'models'
import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { sanitizeText } from '../../helpers/helpers';
import CardComponent from '../card/card.component';


const emptyVote = { 'text': '', 'value': '' };
const hiddenVote = { 'text': '*', 'value': '*' };

const ResultsComponent = ({
  users,
  connectionId,
  roomHasAdmin,
  isUserAdmin,
  onSetRoomAdmin
}: {
  users: ParticipantDTO[];
  connectionId: string | undefined;
  roomHasAdmin: boolean;
  isUserAdmin: boolean;
  onSetRoomAdmin: (userName: string) => void;
}) => {
  const isUserCurrent = (user: ParticipantDTO) => user.socketId === connectionId ? true : false;
  return (
    <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell component='th'>Participant</TableCell>
            <TableCell component='th'>Estimation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: ParticipantDTO) => (
            <TableRow
              key={user.userName}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell scope="row">
                {(isUserAdmin === true && isUserCurrent(user) === false) || roomHasAdmin === false ? (
                    <Tooltip
                      disableFocusListener
                      arrow
                      placement="bottom"
                      title="Make Admin"
                    >
                      <Button onClick={() => onSetRoomAdmin(user.userName)}>
                        ⭐
                      </Button>
                    </Tooltip>
                  ) : null}
              </TableCell>
              <TableCell>
                {sanitizeText(user.userName)}{' '}

              </TableCell>
              <TableCell>
                <CardComponent size='small' card={user.vote ? (user.hide ? hiddenVote : user.vote) : emptyVote} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsComponent