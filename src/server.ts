import { app } from './app';
import mongoose from 'mongoose';

process.on('uncaughtException', (err: any) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

let DB;

if (process.env.DATABASE && process.env.PASSWORD_DB) {
  DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.PASSWORD_DB
  );
}

if (DB) {
  mongoose
    .connect(DB)
    .then(() =>
      console.log('DB connection successful')
    );
}

const port = process.env.PORT || 3000;

// eslint-disable-next-line no-unused-vars
const server = app.listen(port, () => {
  console.log(`App listening on ${port}...`);
});

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
