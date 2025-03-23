import { Server, Socket } from 'socket.io';

interface UserGroup {
  groupId?: string;
  userId: string;
}

const groupSocketConnection = (io: Server, userGroups: Map<string, UserGroup>) => {
  io.on('connection', (socket: Socket) => {
    console.log('New user connected:', socket.id);

    socket.on('join-group', ({ groupId, userId }: { groupId: string; userId: string }) => {
      userGroups.set(socket.id, { groupId, userId });
      console.log(`User ${userId} joined group: ${groupId}`);
      socket.join(groupId);
      io.to(groupId).emit('user-joined', { userId, groupId });
    });

    socket.on('join-group-upload', ({ userId }: { userId: string }) => {
      userGroups.set(socket.id, { userId });
      console.log(`User ${userId} joined group`);
      socket.join(userId);
      io.to(userId).emit('join-group-upload', { userId });
    });

    socket.on('leave-group', ({ groupId, userId }: { groupId: string; userId: string }) => {
      console.log(`User ${userId} left group: ${groupId}`);
      socket.leave(groupId);
      io.to(groupId).emit('user-left', { userId, groupId });
    });

    socket.on('disconnect', () => {
      const user = userGroups.get(socket.id);
      if (user?.groupId) {
        io.to(user.groupId).emit('user-left', { userId: user.userId, groupId: user.groupId });
      }
      userGroups.delete(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default groupSocketConnection;