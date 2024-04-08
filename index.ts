import './server/db';
import {app,server,io} from './app';

// dotenv.config();

const PORT = process.env.PORT || 3000; //port for https

app.get('/', (req, res) => {
    res.send('hello');
})

server
    .listen(PORT ,() => console.log(`Listening on ${PORT}`));