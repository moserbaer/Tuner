if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb+srv://aman:aman@cluster0-kot7e.mongodb.net/tuner?retryWrites=true&w=majority'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost:27017/waves'}
}
