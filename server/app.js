import express from 'express';
import path from 'path';

const app = express();
const port = 2026;

app.get('/', (req, res) => {
    res.send('SecretCurse boilerplate :P');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

