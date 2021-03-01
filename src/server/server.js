import express from 'express';
import reactDOM from 'react-dom/server';
import {Header} from '../shared/Header'

const app = express();

app.use('/static', express.static('./dist/client'))

app.get('/', (req, res) => {
    res.send(
        reactDOM.renderToString(Header()),
    );
})

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
})