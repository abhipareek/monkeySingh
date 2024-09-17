exports.create = {
  fname: 'required|string',
  lname: 'required|string',
  email: 'required|string',
  gender: 'required',
  group: 'required|string',
  address: 'required|string',
  mobile: 'required|string',
};
exports.findWithCustomer = {
  search: 'required|string'
};
exports.getCustomer = {
  id: 'required|string'
};

exports.saveImage = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

