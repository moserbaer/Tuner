if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb+srv://aman:aman@cluster0-kot7e.mongodb.net/waves?retryWrites=true&w=majority'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost:27017/waves'}
}
