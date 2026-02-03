module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        socket.on('joinMatch', (matchId) => {
            socket.join(matchId);
            console.log(`Socket ${socket.id} joined match ${matchId}`);
        });

        socket.on('leaveMatch', (matchId) => {
            socket.leave(matchId);
            console.log(`Socket ${socket.id} left match ${matchId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
