const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/scholarships', require('./routes/scholarships'));
app.use('/matches', require('./routes/matches'));
app.use('/documents', require('./routes/documents'));

app.use('/auth', require('./routes/auth'));


app.listen(3001, () => console.log('Backend running on port 3001'));
