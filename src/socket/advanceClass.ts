import { Server, Socket } from 'socket.io';

interface UserClass {
  classId?: string;
  userId: string;
}

//const userGroups: Map<string, UserGroup> = new Map();

const advanceClassSocketConnection = (io: Server, userAdvanceClasses: Map<string, UserClass>) => {
  io.on('connection', (socket: Socket) => {
    console.log('New user connected:', socket.id);

    socket.on('join-advance-class', ({ classId, userId }: { classId: string; userId: string }) => {
      userAdvanceClasses.set(socket.id, { classId, userId });
      console.log(`User ${userId} joined class: ${classId}`);
      socket.join(classId);
      io.to(classId).emit('user-joined', { userId, classId });
    });

    socket.on('join-advance-class-upload', ({ userId }: { userId: string }) => {
      userAdvanceClasses.set(socket.id, { userId });
      console.log(`User ${userId} joined group`);
      socket.join(userId);
      io.to(userId).emit('join-group-upload', { userId });
    });

    socket.on('leave-advance-class', ({ classId, userId }: { classId: string; userId: string }) => {
      console.log(`User ${userId} left group: ${classId}`);
      socket.leave(classId);
      io.to(classId).emit('user-left', { userId, classId });
    });

    socket.on('disconnect', () => {
      const user = userAdvanceClasses.get(socket.id);
      if (user?.classId) {
        io.to(user.classId).emit('user-left', { userId: user.userId, classId: user.classId });
      }
      userAdvanceClasses.delete(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default advanceClassSocketConnection;