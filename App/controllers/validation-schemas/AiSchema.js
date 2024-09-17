exports.Login = { 
  email: 'required|string',
  password: 'required|string', 
};
exports.Chat = {
  query: 'required|array'
};
exports.getTopics = {
  id: 'required|string'
};

exports.editTopics = {
  id: 'required|string',
  name: 'required|string'
};
exports.deleteTopics = {
  id: 'required|string'
};

exports.Share = {
  id: 'required|string',
  emails: 'required|array'
};
exports.saveImage = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

