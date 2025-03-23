// src/socket.ts
import { Server as SocketIOServer, Socket } from 'socket.io';

type RoomStates = Map<string, {
  participants: Record<string, { isMuted: boolean; isVideoOn: boolean }>;
  callActive: boolean;
  host: string;
}>;

export const videoCallSocketHandlers = (io: SocketIOServer, roomStates: RoomStates) => {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

      // Signaling for WebRTC
      socket.on('offer', (data) => {
        const { groupId, offer, userId } = data;
        console.log(`Offer received from ${userId} for group ${groupId}`);
        socket.to(groupId).emit('offer', { offer, userId });
      });
 
      socket.on('answer', (data) => {
        const { groupId, answer, userId } = data;
        console.log(`Answer received from ${userId} for group ${groupId}`);
        socket.to(groupId).emit('answer', { answer, userId });
      });
 
      socket.on('ice-candidate', (data) => {
        const { groupId, candidate, userId } = data;
        console.log(`ICE candidate received from ${userId} for group ${groupId}`);
        socket.to(groupId).emit('ice-candidate', { candidate, userId });
      });  

    // Check if a call is active for the given group ID
   socket.on('check-call-status', (groupId) => {
    if (roomStates.has(groupId)) {
      const roomState = roomStates.get(groupId);
      if (roomState!.callActive) {
        socket.emit('call-status', { groupId, callActive: true });
      } else {
        socket.emit('call-status', { groupId, callActive: false });
      }
    } else {
      socket.emit('call-status', { groupId, callActive: false });
    }
  });

  function updateMemberCount(groupId:string) {
    if (roomStates.has(groupId)) {
      const roomState = roomStates.get(groupId);
      const count = Object.keys(roomState!.participants).length;
      io.to(groupId).emit('member-count', { groupId, count }); // Notify all group members
      console.log(`Group ${groupId} now has ${count} members`);
    }
  }

  // Get the number of participants in the group
  socket.on('get-member-count', (groupId) => {
    if (!roomStates.has(groupId)) {
      socket.emit('member-count', { groupId, count: 0 });
      return;
    }

    const roomState = roomStates.get(groupId);
    const count = Object.keys(roomState!.participants).length;

    socket.emit('member-count', { groupId, count });

    console.log(`Group ${groupId} has ${count} members`);
  });

socket.on('start-call', (groupId, hostId) => {
  // Check if a call already exists for this group
  if (roomStates.has(groupId)) {
    socket.emit('call-already-started', groupId);
    return;
  }

  // Initialize the room state for the call
  roomStates.set(groupId, {
    participants: {}, // Start with an empty participants object
    callActive: true,
    host: hostId, // Store the host ID for later use
  });

  // Notify the host that the call has started
  socket.emit('call-started', { groupId, hostId });

  // Optionally broadcast to the group that the call is ready
  io.to(groupId).emit('update-room', {
    roomState: roomStates.get(groupId),
    hostId, // Send the host ID as part of the room state
  });

  console.log(`Call started in group ${groupId} by host ${hostId}`);
});

  socket.on('join-room', (groupId, userId) => {
    socket.join(groupId);
  
    if (!roomStates.has(groupId)) {
      roomStates.set(groupId, { participants: {}, callActive: false, host: '' });
    }
  
    roomStates.get(groupId)!.participants[userId] = { isMuted: false, isVideoOn: true };
  
    // Emit only the participants object to the room
    const participants = Object.entries(roomStates.get(groupId)!.participants).map(
      ([id, status]) => ({ id, ...status })
    );
    io.to(groupId).emit('update-room', participants);
  
    updateMemberCount(groupId); // Send real-time member count
    console.log(`User ${userId} joined group ${groupId}`);
  });

  socket.on('leave-room', (groupId, userId) => {
    socket.leave(groupId);
  
    if (roomStates.has(groupId)) {
      delete roomStates.get(groupId)!.participants[userId];
  
      // Emit updated room state and member count
      io.to(groupId).emit('update-room', roomStates.get(groupId));
      updateMemberCount(groupId); // Send real-time member count
      console.log(`User ${userId} left group ${groupId}`);
    }
  });

  socket.on('toggle-video', ({ groupId, userId, isVideoOn }) => {
    if (roomStates.has(groupId)) {
      roomStates.get(groupId)!.participants[userId].isVideoOn = isVideoOn;
      io.to(groupId).emit('update-room', roomStates.get(groupId));  // Broadcast updated state
    }
  });

  socket.on('mute-participant', ({ groupId, userId, isMuted }) => {
      if (roomStates.has(groupId)) {
        roomStates.get(groupId)!.participants[userId].isMuted = isMuted;
        io.to(groupId).emit('participant-muted', { userId, isMuted });
      }
    });

    // Handle screen sharing
  socket.on('start-screen-share', ({ groupId, userId }) => {
    io.to(groupId).emit('screen-share-started', { userId });
    console.log(`User ${userId} started screen sharing in group ${groupId}`);
  });

  socket.on('stop-screen-share', ({ groupId, userId }) => {
    io.to(groupId).emit('screen-share-stopped', { userId });
    console.log(`User ${userId} stopped screen sharing in group ${groupId}`);
  });

  socket.on('end-call', (groupId) => {
    const roomState = roomStates.get(groupId);
  
    if (roomState) { // Ensure roomState is not undefined
      // Emit a message to notify all users in the room that the call has ended
      io.to(groupId).emit('call-ended', { message: 'The call has ended.' });
  
      // Get userIds as an array
      const users = Object.keys(roomState.participants); 
  
      users.forEach((userId) => {
        socket.to(groupId).emit('update-room', {}); // Emit update to all users
        socket.leave(groupId); // Remove user from the room
      });
  
      // Remove the group state from the map
      roomStates.delete(groupId);
      console.log(`Call in group ${groupId} has ended, and all users have been disconnected.`);
    } else {
      console.error(`Group ${groupId} does not exist or has already been cleaned up.`);
    }
  });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};

