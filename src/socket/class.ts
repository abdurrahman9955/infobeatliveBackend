import { Server, Socket } from 'socket.io';

interface UserClass {
  classId?: string;
  userId: string;
}

const classSocketConnection = (io: Server, userClasses: Map<string, UserClass>) => {
  io.on('connection', (socket: Socket) => {
    console.log('New user connected:', socket.id);

    socket.on('join-class', ({ classId, userId }: { classId: string; userId: string }) => {
      userClasses.set(socket.id, { classId, userId });
      console.log(`User ${userId} joined class: ${classId}`);
      socket.join(classId);
      io.to(classId).emit('user-joined', { userId, classId });
    });

    socket.on('leave-class', ({ classId, userId }: { classId: string; userId: string }) => {
      console.log(`User ${userId} left group: ${classId}`);
      socket.leave(classId);
      io.to(classId).emit('user-left', { userId, classId });
    });

    socket.on('disconnect', () => {
      const user = userClasses.get(socket.id);
      if (user?.classId) {
        io.to(user.classId).emit('user-left', { userId: user.userId, classId: user.classId });
      }
      userClasses.delete(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default classSocketConnection;